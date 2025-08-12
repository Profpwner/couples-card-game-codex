import { Router } from 'express';
import pool from '../lib/db';

const router = Router();

// Returns stubbed sales metrics for a creator
router.get('/analytics/sales', async (req, res) => {
  const userId = (req as any).user?.userId || (req.query.userId as string | undefined);
  if (!userId) return res.status(400).json({ error: 'userId (JWT or query) required' });
  try {
    // Example aggregate; in real impl, compute from orders table
    const result = await pool.query('SELECT COUNT(*)::int as packs_sold, 12345::int as revenue_cents');
    const row = result.rows[0] || { packs_sold: 0, revenue_cents: 0 };
    res.json({ userId, packsSold: row.packs_sold, revenueCents: row.revenue_cents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sales analytics' });
  }
});

// Returns stubbed engagement metrics for a creator
router.get('/analytics/engagement', async (req, res) => {
  const userId = (req as any).user?.userId || (req.query.userId as string | undefined);
  if (!userId) return res.status(400).json({ error: 'userId (JWT or query) required' });
  try {
    // Example stub: readers and avg session length
    res.json({ userId, readers: 256, avgSessionSec: 312 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch engagement analytics' });
  }
});

export default router;



// Weekly trend stub: last 7 days sales and readers
router.get('/analytics/trends', async (req, res) => {
  const userId = (req as any).user?.userId || (req.query.userId as string | undefined);
  if (!userId) return res.status(400).json({ error: 'userId (JWT or query) required' });
  try {
    const today = new Date();
    const labels: string[] = [];
    const sales: number[] = [];
    const readers: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(`${d.getMonth()+1}/${d.getDate()}`);
      sales.push(Math.floor(Math.random() * 20));
      readers.push(Math.floor(Math.random() * 100));
    }
    res.json({ labels, sales, readers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});
