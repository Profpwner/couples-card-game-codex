// @ts-nocheck
import request from 'supertest';
import express from 'express';
import marketplaceRoutes from './marketplace';
import pool from '../lib/db';

jest.mock('../lib/db');
const mockPool = pool as jest.Mocked<typeof pool>;

const app = express();
app.use(express.json());
app.use('/', marketplaceRoutes);

describe('Marketplace routes', () => {
  beforeEach(() => {
    mockPool.query.mockReset();
  });

  it('GET /packs returns list of packs', async () => {
    const rows = [
      { pack_id: 'p1', title: 'Pack One' },
      { pack_id: 'p2', title: 'Pack Two' },
    ];
    mockPool.query.mockResolvedValueOnce({ rows } as any);
    const res = await request(app).get('/packs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(rows);
  });

  it('GET /packs/:id returns a single pack', async () => {
    const row = {
      pack_id: 'p1',
      creator_id: 'c1',
      title: 'Pack One',
      description: 'Desc',
      created_at: new Date().toISOString(),
    };
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [row] } as any);
    const res = await request(app).get('/packs/p1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(row);
  });

  it('GET /packs/:id returns 404 when not found', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] } as any);
    const res = await request(app).get('/packs/missing');
    expect(res.status).toBe(404);
  });
});
