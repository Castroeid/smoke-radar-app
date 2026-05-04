const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

export function hasOpenAiKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function createOpenAiResponse({ input, instructions, text, maxOutputTokens = 900 }) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is missing');
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5.2',
      instructions,
      input,
      text,
      max_output_tokens: maxOutputTokens,
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error?.message || `OpenAI request failed with status ${response.status}`);
  }

  return body.output_text || extractOutputText(body);
}

function extractOutputText(body) {
  const parts = [];

  for (const item of body.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === 'output_text' && content.text) {
        parts.push(content.text);
      }
    }
  }

  return parts.join('\n').trim();
}
