// @ts-nocheck
import request from 'supertest';
import express from 'express';
import socialRoutes from './social';
import pool from '../lib/db';
import jwt from 'jsonwebtoken';

jest.mock('../lib/db');
const mockPool = pool as jest.Mocked<typeof pool>;

const app = express();
app.use(express.json());
app.use('/', socialRoutes);

describe('Reviews & Follows endpoints', () => {
  beforeEach(() => {
    mockPool.query.mockReset();
  });
  beforeAll(() => {
    process.env.JWT_SECRET = 'test';
  });

  it('POST /packs/:id/reviews - validation (requires rating)', async () => {
    const token = jwt.sign({ userId: 'u1' }, 'test');
    const res = await request(app)
      .post('/packs/1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it('POST /packs/:id/reviews - success with JWT', async () => {
    const row = { review_id: 'r1', user_id: 'u1', pack_id: 'p1', rating: 5, review_text: 'Nice', created_at: new Date() };
    mockPool.query.mockResolvedValueOnce({ rows: [row] });
    const token = jwt.sign({ userId: 'u1' }, 'test');
    const res = await request(app)
      .post('/packs/p1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5, reviewText: 'Nice' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ review_id: 'r1', rating: 5, review_text: 'Nice' });
  });

  it('GET /packs/:id/reviews - success', async () => {
    const rows = [{ review_id: 'r1' }];
    mockPool.query.mockResolvedValueOnce({ rows });
    const res = await request(app).get('/packs/p1/reviews');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(rows);
  });

  it('POST /creators/:id/follow - success with JWT', async () => {
    mockPool.query.mockResolvedValueOnce({});
    const token = jwt.sign({ userId: 'u1' }, 'test');
    const res = await request(app)
      .post('/creators/c1/follow')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Followed');
  });

  it('DELETE /creators/:id/follow - success with JWT', async () => {
    mockPool.query.mockResolvedValueOnce({});
    const token = jwt.sign({ userId: 'u1' }, 'test');
    const res = await request(app)
      .delete('/creators/c1/follow')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Unfollowed');
  });

  it('GET /creators/:id/follow - returns follow status', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1 } as any);
    const res = await request(app)
      .get('/creators/c1/follow')
      .query({ userId: 'u1' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ isFollowing: true });
  });

  it('POST /creators/:id/follow - 401 without token', async () => {
    const res = await request(app)
      .post('/creators/c1/follow')
      .send({});
    expect(res.status).toBe(401);
  });

  it('POST /packs/:id/reviews - success with header JWT', async () => {
    const row = { review_id: 'r2', user_id: 'u2', pack_id: 'p1', rating: 4, review_text: 'Good', created_at: new Date() };
    mockPool.query.mockResolvedValueOnce({ rows: [row] } as any);
    const token = jwt.sign({ userId: 'u2' }, 'test');
    const res = await request(app)
      .post('/packs/p1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 4, reviewText: 'Good' });
    expect(res.status).toBe(201);
  });
});
