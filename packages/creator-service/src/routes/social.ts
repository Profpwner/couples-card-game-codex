import { Router } from 'express';
import pool from '../lib/db';
import { authenticate } from '../lib/auth';

const router = Router();

// Create a review for a pack
router.post('/packs/:id/reviews', authenticate, async (req, res) => {
  const { id: packId } = req.params;
  const { rating, reviewText } = req.body;
  const userId = req.user?.userId;
  if (!userId || rating == null) {
    return res.status(400).json({ error: 'userId (JWT) and rating are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be between 1 and 5' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO "Reviews" (user_id, pack_id, rating, review_text) VALUES ($1,$2,$3,$4) RETURNING review_id, user_id, pack_id, rating, review_text, created_at',
      [userId, packId, rating, reviewText]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Fetch all reviews for a pack
router.get('/packs/:id/reviews', async (req, res) => {
  const { id: packId } = req.params;
  try {
    const result = await pool.query(
      'SELECT review_id, user_id, rating, review_text, created_at FROM "Reviews" WHERE pack_id = $1 ORDER BY created_at DESC',
      [packId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Follow a creator
router.post('/creators/:id/follow', authenticate, async (req, res) => {
  const { id: creatorId } = req.params;
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId (JWT) is required' });
  }
  try {
    await pool.query(
      'INSERT INTO "Follows" (user_id, creator_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [userId, creatorId]
    );
    res.json({ message: 'Followed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to follow creator' });
  }
});

// Unfollow a creator
router.delete('/creators/:id/follow', authenticate, async (req, res) => {
  const { id: creatorId } = req.params;
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId (JWT) is required' });
  }
  try {
    await pool.query(
      'DELETE FROM "Follows" WHERE user_id = $1 AND creator_id = $2',
      [userId, creatorId]
    );
    res.json({ message: 'Unfollowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unfollow creator' });
  }
});


// Get follow status
router.get('/creators/:id/follow', async (req, res) => {
  const { id: creatorId } = req.params;
  const userId = req.query.userId as string | undefined;
  if (!userId) {
    return res.status(400).json({ error: 'userId query is required' });
  }
  try {
    const result = await pool.query(
      'SELECT 1 FROM "Follows" WHERE user_id = $1 AND creator_id = $2 LIMIT 1',
      [userId, creatorId]
    );
    res.json({ isFollowing: (result.rowCount || 0) > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch follow status' });
  }
});

export default router;
