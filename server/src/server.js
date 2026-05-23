import { createServer } from 'node:http';

import { answerExpertWithAi, generateRecipeWithAi } from './aiService.js';
import { trendingCuts } from './mockData.js';
import { readJson, sendHtml, sendJson, sendOptions } from './http.js';
import { findButchersWithPlaces } from './placesService.js';
import { privacyPolicyHtml } from './privacyPolicy.js';

export async function route(req, res) {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  if (url.pathname === '/butchers/nearby') {
    console.log('Incoming butchers request:', url.searchParams.toString() || 'without-location');
  }

  if (req.method === 'OPTIONS') {
    sendOptions(res);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { ok: true, service: 'smoke-radar-api' });
    return;
  }

  if (req.method === 'GET' && (url.pathname === '/privacy' || url.pathname === '/privacy-policy')) {
    sendHtml(res, 200, privacyPolicyHtml);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/trends') {
    sendJson(res, 200, trendingCuts);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/recipes/generate') {
    const body = await readJson(req);
    sendJson(res, 200, await generateRecipeWithAi(body));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/expert/ask') {
    const body = await readJson(req);
    sendJson(res, 200, await answerExpertWithAi(body.question));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/feedback') {
    const body = await readJson(req);
    const message = String(body.message ?? '').trim();

    if (message.length < 3) {
      sendJson(res, 400, { error: 'Feedback message is required' });
      return;
    }

    const feedback = {
      id: `fb_${Date.now()}`,
      createdAt: new Date().toISOString(),
      source: String(body.source ?? 'app').slice(0, 80),
      platform: String(body.platform ?? 'unknown').slice(0, 40),
      contact: String(body.contact ?? '').slice(0, 160),
      message: message.slice(0, 4000),
    };

    console.log('Smoke Radar feedback:', JSON.stringify(feedback));
    await forwardFeedback(feedback);
    await emailFeedback(feedback);
    sendJson(res, 200, { ok: true, id: feedback.id });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/butchers/nearby') {
    sendJson(res, 200, await findButchersWithPlaces({ lat: url.searchParams.get('lat'), lng: url.searchParams.get('lng') }));
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
}

export function createSmokeRadarServer() {
  return createServer(async (req, res) => {
    try {
      await route(req, res);
    } catch (error) {
      const statusCode = error.statusCode ?? 500;
      sendJson(res, statusCode, {
        error: statusCode === 500 ? 'Internal server error' : error.message,
      });
    }
  });
}

async function forwardFeedback(feedback) {
  const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
  } catch (error) {
    console.error('Failed to forward Smoke Radar feedback:', error);
  }
}

async function emailFeedback(feedback) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return;
  }

  const to = process.env.FEEDBACK_TO_EMAIL || 'castroeid@gmail.com';
  const from = process.env.FEEDBACK_FROM_EMAIL || 'Smoke Radar <onboarding@resend.dev>';
  const subject = `משוב חדש מ-Smoke Radar (${feedback.source})`;
  const text = [
    'משוב חדש מ-Smoke Radar',
    '',
    `מקור: ${feedback.source}`,
    `פלטפורמה: ${feedback.platform}`,
    `פרטי קשר: ${feedback.contact || 'לא נמסרו'}`,
    `זמן: ${feedback.createdAt}`,
    '',
    feedback.message,
  ].join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text,
        html: renderFeedbackEmail(feedback),
      }),
    });

    if (!response.ok) {
      console.error('Failed to email Smoke Radar feedback:', response.status, await response.text());
    }
  } catch (error) {
    console.error('Failed to email Smoke Radar feedback:', error);
  }
}

function renderFeedbackEmail(feedback) {
  return `
    <div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.7;color:#241510">
      <h2 style="color:#ff771f">משוב חדש מ-Smoke Radar</h2>
      <p><strong>מקור:</strong> ${escapeHtml(feedback.source)}</p>
      <p><strong>פלטפורמה:</strong> ${escapeHtml(feedback.platform)}</p>
      <p><strong>פרטי קשר:</strong> ${escapeHtml(feedback.contact || 'לא נמסרו')}</p>
      <p><strong>זמן:</strong> ${escapeHtml(feedback.createdAt)}</p>
      <hr />
      <p style="white-space:pre-wrap">${escapeHtml(feedback.message)}</p>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
