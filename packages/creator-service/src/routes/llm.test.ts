// @ts-nocheck
import request from 'supertest';
import express from 'express';
import llmRoutes from './llm';
import * as llmService from 'llm-service';

jest.mock('llm-service');

const app = express();
app.use(express.json());
app.use('/creator', llmRoutes);

describe('AI Co-Pilot endpoints', () => {
  beforeAll(() => {
    (llmService.ideationPrompt as jest.Mock).mockResolvedValue('ideation');
    (llmService.structuringPrompt as jest.Mock).mockResolvedValue('structure');
    (llmService.contentGenerationPrompt as jest.Mock).mockResolvedValue('content');
    (llmService.refinementPrompt as jest.Mock).mockResolvedValue('refinement');
  });

  it('POST /creator/packs/:id/ideation', async () => {
    const res = await request(app)
      .post('/creator/packs/123/ideation')
      .send({ idea: 'test' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ packId: '123', output: 'ideation' });
  });

  it('POST /creator/packs/:id/structure', async () => {
    const res = await request(app)
      .post('/creator/packs/123/structure')
      .send({ context: 'test' });
    expect(res.body.output).toBe('structure');
  });

  it('POST /creator/packs/:id/content', async () => {
    const res = await request(app)
      .post('/creator/packs/123/content')
      .send({ topic: 'test' });
    expect(res.body.output).toBe('content');
  });

  it('POST /creator/packs/:id/refinement', async () => {
    const res = await request(app)
      .post('/creator/packs/123/refinement')
      .send({ feedback: 'test' });
    expect(res.body.output).toBe('refinement');
  });
});
