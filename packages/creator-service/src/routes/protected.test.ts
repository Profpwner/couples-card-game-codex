// @ts-nocheck
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { authenticate } from '../lib/auth';
import llmRoutes from './llm';
import * as llmService from 'llm-service';

jest.mock('llm-service');

describe('Protected routes with JWT middleware', () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/creator', authenticate, llmRoutes);

  beforeAll(() => {
    (llmService.ideationPrompt as jest.Mock).mockResolvedValue('ok');
    process.env.JWT_SECRET = 'test-secret';
  });

  it('rejects without Authorization header', async () => {
    const res = await request(app).post('/creator/packs/1/ideation').send({ idea: 'x' });
    expect(res.status).toBe(401);
  });

  it('allows with valid JWT', async () => {
    const token = jwt.sign({ userId: 'u1', isCreator: true }, process.env.JWT_SECRET as string);
    const res = await request(app)
      .post('/creator/packs/1/ideation')
      .set('Authorization', `Bearer ${token}`)
      .send({ idea: 'x' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ packId: '1', output: 'ok' });
  });

  it('allows with cookie-based JWT', async () => {
    const token = jwt.sign({ userId: 'u1', isCreator: true }, process.env.JWT_SECRET as string);
    const res = await request(app)
      .post('/creator/packs/1/ideation')
      .set('Cookie', [`access_token=${token}`])
      .send({ idea: 'x' });
    expect(res.status).toBe(200);
  });
});
