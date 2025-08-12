import { Router } from 'express';
import pool from '../lib/db';

const router = Router();

// Public endpoint to list packs for the marketplace
router.get('/packs', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT pack_id, title FROM "Packs" ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch packs' });
  }
});

// Public endpoint to fetch a single pack by id with creator info
router.get('/packs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT pack_id, creator_id, title, description, created_at FROM "Packs" WHERE pack_id = $1',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Pack not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pack' });
  }
});

export default router;
