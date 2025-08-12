import { Router } from 'express';
import pool from '../lib/db';

const router = Router();

// Ratings histogram for a creator (counts for 1..5)
router.get('/creators/:id/reviews/summary', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT rating, COUNT(*)::int AS c FROM "Reviews" r JOIN "Packs" p ON r.pack_id = p.pack_id WHERE p.creator_id = $1 GROUP BY rating',
      [id]
    );
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const row of result.rows) counts[row.rating] = row.c;
    res.json({ counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ratings summary' });
  }
});

// Follow count trend (stubbed)
router.get('/creators/:id/follows/trends', async (req, res) => {
  const days = Math.max(1, Math.min(30, parseInt((req.query.days as string) || '7', 10) || 7));
  try {
    const today = new Date();
    const labels: string[] = [];
    const followers: number[] = [];
    let base = 100;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(`${d.getMonth()+1}/${d.getDate()}`);
      base += Math.floor(Math.random() * 5) - 2; // small fluctuations
      followers.push(Math.max(0, base));
    }
    res.json({ labels, followers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch follows trend' });
  }
});

export default router;
