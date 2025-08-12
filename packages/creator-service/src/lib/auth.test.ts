// @ts-nocheck
import request from 'supertest';
import express from 'express';
import { authenticate } from './auth';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');
const mockJwt = jwt as unknown as { verify: jest.Mock };

describe('authenticate middleware', () => {
  const app = express();
  app.get('/protected', authenticate, (req, res) => {
    res.json({ ok: true, user: req.user });
  });

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    mockJwt.verify.mockReset();
  });

  it('rejects missing token', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  it('rejects invalid token', async () => {
    mockJwt.verify.mockImplementation(() => {
      throw new Error('bad');
    });
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer bad.token');
    expect(res.status).toBe(401);
  });

  it('accepts valid token and sets req.user', async () => {
    mockJwt.verify.mockReturnValue({ userId: 'u1', isCreator: true } as any);
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer good.token');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, user: { userId: 'u1', isCreator: true } });
  });
});
