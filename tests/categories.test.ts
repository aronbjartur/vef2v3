import { app } from '../src/index.js';

describe('Categories API', () => {
  test('GET /categories returns 200 and a list', async () => {
    const res = await app.fetch(new Request('/categories'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('GET /categories/:slug returns 404 for non-existing category', async () => {
    const res = await app.fetch(new Request('/categories/nonexistent'));
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.message).toBe('not found');
  });
});