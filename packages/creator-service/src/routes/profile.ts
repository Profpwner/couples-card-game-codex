import { Router } from 'express';
import pool from '../lib/db';

const router = Router();

router.get('/creators/:id/profile', async (req, res) => {
  const { id } = req.params;
  try {
    const creator = await pool.query('SELECT display_name, bio FROM "Creators" WHERE creator_id = $1', [id]);
    if (creator.rowCount === 0) return res.status(404).json({ error: 'Creator not found' });
    const displayName = creator.rows[0].display_name;
    const bio = creator.rows[0].bio || '';

    const followers = await pool.query('SELECT COUNT(*)::int as c FROM "Follows" WHERE creator_id = $1', [id]);
    const packs = await pool.query('SELECT pack_id, title FROM "Packs" WHERE creator_id = $1 ORDER BY created_at DESC', [id]);
    const avg = await pool.query(
      'SELECT COALESCE(AVG(r.rating),0)::float AS avg_rating FROM "Reviews" r JOIN "Packs" p ON r.pack_id = p.pack_id WHERE p.creator_id = $1',
      [id]
    );

    res.json({
      creator_id: id,
      display_name: displayName,
      bio,
      followers: followers.rows[0].c,
      avg_rating: avg.rows[0].avg_rating || 0,
      packs: packs.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
