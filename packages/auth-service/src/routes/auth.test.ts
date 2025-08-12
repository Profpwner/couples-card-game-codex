// @ts-nocheck
/// <reference types="jest" />
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock before requiring modules that depend on them
jest.mock('../lib/db');
jest.mock('../lib/hash', () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}));
jest.mock('jsonwebtoken');

// Require after mocks to avoid loading native deps
const authRoutes = require('./auth').default;
const pool = require('../lib/db').default;
const hash = require('../lib/hash');
const jwt = require('jsonwebtoken');

const mockPool = pool as unknown as { query: jest.Mock };
const mockHash = hash as unknown as { hashPassword: jest.Mock; verifyPassword: jest.Mock };
const mockJwt = jwt as unknown as { sign: jest.Mock; verify: jest.Mock };

// Setup express app for testing
const app = express();
app.use(express.json());
app.use('/api', authRoutes);

describe('Auth Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api', authRoutes);

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    mockPool.query.mockReset();
    mockHash.hashPassword.mockReset();
    mockHash.verifyPassword.mockReset();
    mockJwt.sign.mockReset();
    mockJwt.verify.mockReset();
  });

  it('should return 400 if registration data is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
  });

  it('should enforce password policy', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'short' });
    expect(res.status).toBe(400);
  });

  it('should return 400 if login data is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('should return 400 if refresh token is missing', async () => {
    const res = await request(app).post('/api/auth/refresh').send({});
    expect(res.status).toBe(400);
  });

  it('registers a new user successfully', async () => {
    mockHash.hashPassword.mockResolvedValue('hashed');
    mockPool.query.mockResolvedValueOnce({
      rows: [{ user_id: 'u1', email: 'test@example.com', is_creator: false, created_at: new Date().toISOString() }],
    } as any);
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'Password1' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ email: 'test@example.com', is_creator: false });
  });

  it('logs in and sets cookies (success only response)', async () => {
    mockPool.query
      .mockResolvedValueOnce({
        rows: [{ user_id: 'u1', email: 'test@example.com', password_hash: 'hashed', is_creator: true }],
      } as any)
      .mockResolvedValueOnce({}); // insert refresh token
    mockHash.verifyPassword.mockResolvedValue(true);
    mockJwt.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Password1' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(res.headers['set-cookie']).toBeTruthy();
  });

  it('refreshes tokens successfully (success only response)', async () => {
    mockJwt.verify.mockReturnValue({ userId: 'u1' } as any);
    mockPool.query
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ token: 'old' }] } as any) // check existing token
      .mockResolvedValueOnce({ rows: [{ is_creator: true }] } as any) // user fetch
      .mockResolvedValueOnce({} as any) // delete old token
      .mockResolvedValueOnce({} as any); // insert new token
    mockJwt.sign
      .mockReturnValueOnce('new-access')
      .mockReturnValueOnce('new-refresh');

    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'rt' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(res.headers['set-cookie']).toBeTruthy();
  });
});
