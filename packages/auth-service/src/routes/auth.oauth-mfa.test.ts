// @ts-nocheck
/// <reference types="jest" />
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock before requiring modules that depend on them
jest.mock('jsonwebtoken');
jest.mock('../lib/hash', () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}));

// Require after mocks to avoid loading native deps
const authRoutes = require('./auth').default;
const jwt = require('jsonwebtoken');
const mockJwt = jwt as unknown as { sign: jest.Mock };

describe('OAuth and MFA success paths (test mode)', () => {
  const app = express();
  app.use(express.json());
  app.use('/api', authRoutes);

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret';
    mockJwt.sign.mockReset();
    mockJwt.sign
      .mockReturnValueOnce('access-token-google')
      .mockReturnValueOnce('refresh-token-google')
      .mockReturnValueOnce('access-token-apple')
      .mockReturnValueOnce('refresh-token-apple');
  });

  it('POST /auth/oauth/google returns tokens', async () => {
    const res = await request(app)
      .post('/api/auth/oauth/google')
      .send({ email: 'guser@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBe('access-token-google');
    expect(res.body.refreshToken).toBe('refresh-token-google');
    expect(res.body.email).toBe('guser@example.com');
  });

  it('POST /auth/oauth/apple returns tokens', async () => {
    const res = await request(app)
      .post('/api/auth/oauth/apple')
      .send({ email: 'auser@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    expect(res.body.email).toBe('auser@example.com');
  });

  it('POST /auth/mfa/setup returns a secret', async () => {
    const res = await request(app).post('/api/auth/mfa/setup');
    expect(res.status).toBe(200);
    expect(res.body.secret).toBe('TEST-MFA-SECRET');
  });

  it('POST /auth/mfa/verify accepts code 123456', async () => {
    const res = await request(app).post('/api/auth/mfa/verify').send({ code: '123456' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ verified: true });
  });
});
