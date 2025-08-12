// @ts-nocheck
import request from 'supertest';
import express from 'express';
import packRoutes from './packs';
import pool from '../lib/db';

jest.mock('../lib/db');

const mockPool = pool as jest.Mocked<typeof pool>;
const app = express();
app.use(express.json());
app.use('/creator/packs', packRoutes);

describe('Pack submission endpoint', () => {
  it('submits a pack and logs moderation', async () => {
    mockPool.query
      .mockResolvedValueOnce({}) // update status
      .mockResolvedValueOnce({ rows: [{ log_id: 'log-1' }] });
    const res = await request(app).post('/creator/packs/pack-1/submit');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Submitted', logId: 'log-1' });
  });
});

describe('Pack cards endpoints', () => {
  beforeEach(() => {
    mockPool.query.mockReset();
});

describe('Create pack endpoint', () => {
  it('creates a pack and returns packId', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [{ pack_id: 'new-pack-id' }] });
    const res = await request(app)
      .post('/creator/packs')
      .send({ creatorId: 'u1', title: 'My Pack' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ packId: 'new-pack-id' });
  });
  it('patches a single card by index', async () => {
    mockPool.query
      .mockResolvedValueOnce({ rowCount: 1 })
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ description: JSON.stringify({ cards: ['A', 'B'] }) }] })
      .mockResolvedValueOnce({});
    const res = await request(app)
      .patch('/creator/packs/pack-9/cards')
      .send({ index: 1, content: 'B2' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
  it('saves cards with PUT /creator/packs/:id/cards', async () => {
    mockPool.query.mockResolvedValueOnce({});
    const res = await request(app)
      .put('/creator/packs/pack-2/cards')
      .send({ cards: ['A', 'B', 'C'] });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(mockPool.query).toHaveBeenCalled();
  });

  it('loads cards with GET /creator/packs/:id/cards', async () => {
    // First call: normalized returns no rows; second call: JSON fallback
    mockPool.query
      .mockResolvedValueOnce({ rowCount: 0, rows: [] })
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ description: JSON.stringify({ cards: ['X', 'Y'] }) }] });
    const res = await request(app).get('/creator/packs/pack-3/cards');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ cards: ['X', 'Y'] });
  });
  it('adds a card with POST /creator/packs/:id/cards', async () => {
    mockPool.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ c: 2 }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ description: JSON.stringify({ cards: ['A','B'] }) }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});
    const res = await request(app)
      .post('/creator/packs/pack-10/cards')
      .send({ index: 1, content: 'B2' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
  it('deletes a card with DELETE /creator/packs/:id/cards', async () => {
    mockPool.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ description: JSON.stringify({ cards: ['A','B','C'] }) }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});
    const res = await request(app)
      .delete('/creator/packs/pack-11/cards')
      .query({ index: 1 });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
