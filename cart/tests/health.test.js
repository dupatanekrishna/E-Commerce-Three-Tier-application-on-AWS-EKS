// Ensure server.js knows we are in test mode
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');

describe('GET /health', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });
});
