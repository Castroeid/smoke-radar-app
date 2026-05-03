import assert from 'node:assert/strict';

import { createSmokeRadarServer } from '../src/server.js';

const server = createSmokeRadarServer();

await new Promise((resolve) => server.listen(0, resolve));

const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;

try {
  const healthResponse = await fetch(`${baseUrl}/health`);
  const health = await healthResponse.json();
  assert.equal(healthResponse.status, 200);
  assert.equal(health.ok, true);

  const trendsResponse = await fetch(`${baseUrl}/trends`);
  const trends = await trendsResponse.json();
  assert.equal(trendsResponse.status, 200);
  assert.ok(trends.length > 0);
  assert.equal(typeof trends[0].title, 'string');

  const recipeResponse = await fetch(`${baseUrl}/recipes/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cut: 'אסאדו מעושן', method: 'מעשנה', effort: 'מאוזן' }),
  });
  const recipe = await recipeResponse.json();
  assert.equal(recipeResponse.status, 200);
  assert.equal(recipe.sideDishes.length, 2);
  assert.equal(recipe.sauces.length, 2);

  const expertResponse = await fetch(`${baseUrl}/expert/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'מתי עוטפים את הנתח?' }),
  });
  const expert = await expertResponse.json();
  assert.equal(expertResponse.status, 200);
  assert.equal(expert.question, 'מתי עוטפים את הנתח?');
  assert.ok(expert.tips.length > 0);

  const butchersResponse = await fetch(`${baseUrl}/butchers/nearby`);
  const butchers = await butchersResponse.json();
  assert.equal(butchersResponse.status, 200);
  assert.ok(butchers.length > 0);
  assert.equal(typeof butchers[0].address, 'string');

  console.log('Smoke Radar API smoke test passed');
} finally {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
