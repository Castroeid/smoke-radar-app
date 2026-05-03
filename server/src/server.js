import { createServer } from 'node:http';

import { buildExpertAnswer, buildRecipe, butchers, trendingCuts } from './mockData.js';
import { readJson, sendJson, sendOptions } from './http.js';

export async function route(req, res) {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  if (req.method === 'OPTIONS') {
    sendOptions(res);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { ok: true, service: 'smoke-radar-api' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/trends') {
    sendJson(res, 200, trendingCuts);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/recipes/generate') {
    const body = await readJson(req);
    sendJson(res, 200, buildRecipe(body));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/expert/ask') {
    const body = await readJson(req);
    sendJson(res, 200, buildExpertAnswer(body.question));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/butchers/nearby') {
    sendJson(res, 200, butchers);
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
