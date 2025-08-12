// @ts-nocheck
import request from 'supertest';
import express from 'express';
import onboardingRoutes from './onboarding';
import pool from '../lib/db';

jest.mock('../lib/db');
const mockPool = pool as jest.Mocked<typeof pool>;

const app = express();
app.use(express.json());
app.use('/creator', onboardingRoutes);

describe('Creator onboarding', () => {
  beforeEach(() => {
    mockPool.query.mockReset();
  });

  it('POST /creator/onboard requires termsAccepted', async () => {
    const res = await request(app).post('/creator/onboard').send({
      userId: 'u1', displayName: 'Test', payoutToken: 'tok_123', termsAccepted: false,
    });
    expect(res.status).toBe(400);
  });

  it('POST /creator/onboard success', async () => {
    mockPool.query.mockResolvedValueOnce({});
    mockPool.query.mockResolvedValueOnce({});
    const res = await request(app).post('/creator/onboard').send({
      userId: 'u1', displayName: 'Test', payoutToken: 'tok_123', termsAccepted: true,
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Onboarding successful', userId: 'u1' });
  });

  it('GET /creator/status requires userId', async () => {
    const res = await request(app).get('/creator/status');
    expect(res.status).toBe(400);
  });

  it('GET /creator/status user not found', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    const res = await request(app).get('/creator/status').query({ userId: 'u1' });
    expect(res.status).toBe(404);
  });

  it('GET /creator/status success', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ is_creator: true }] });
    const res = await request(app).get('/creator/status').query({ userId: 'u1' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: 'u1', isCreator: true });
  });
});
