// @ts-nocheck
import request from 'supertest';
import express from 'express';
import analytics from './analytics';
import cookieParser from 'cookie-parser';

jest.mock('../lib/db');
const pool = require('../lib/db').default;

describe('Creator analytics routes (stub)', () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/creator', analytics);

  beforeEach(() => {
    pool.query.mockReset?.();
  });

  it('GET /creator/analytics/sales returns stubbed metrics', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ packs_sold: 7, revenue_cents: 9900 }] });
    const res = await request(app).get('/creator/analytics/sales').query({ userId: 'u1' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: 'u1', packsSold: 7, revenueCents: 9900 });
  });

  it('GET /creator/analytics/engagement returns stubbed metrics', async () => {
    const res = await request(app).get('/creator/analytics/engagement').query({ userId: 'u2' });
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe('u2');
    expect(res.body).toMatchObject({ readers: expect.any(Number), avgSessionSec: expect.any(Number) });
  });

  it('requires userId when no JWT present', async () => {
    const res = await request(app).get('/creator/analytics/sales');
    expect(res.status).toBe(400);
  });
});

