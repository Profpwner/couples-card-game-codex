import { Router } from 'express';
import pool from '../lib/db';

const router = Router();

/**
 * Convert a user to a creator. Expects:
 *  - userId: string
 *  - displayName: string
 *  - payoutToken: string
 *  - termsAccepted: boolean
 */
router.post('/onboard', async (req, res) => {
  const { userId, displayName, payoutToken, termsAccepted } = req.body;
  if (!userId || !displayName || !payoutToken) {
    return res.status(400).json({ error: 'Missing onboarding fields' });
  }
  if (!termsAccepted) {
    return res.status(400).json({ error: 'Terms must be accepted' });
  }
  try {
    await pool.query(
      'UPDATE "Users" SET is_creator = TRUE WHERE user_id = $1',
      [userId]
    );
    await pool.query(
      'INSERT INTO "Creators" (creator_id, display_name, payout_details_token) VALUES ($1, $2, $3) '
      + 'ON CONFLICT (creator_id) DO UPDATE SET display_name = EXCLUDED.display_name, payout_details_token = EXCLUDED.payout_details_token',
      [userId, displayName, payoutToken]
    );
    res.json({ message: 'Onboarding successful', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Onboarding failed' });
  }
});

/**
 * Get creator status for a given userId query param.
 */
router.get('/status', async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: 'userId query required' });
  }
  try {
    const result = await pool.query(
      'SELECT is_creator FROM "Users" WHERE user_id = $1',
      [userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ userId, isCreator: result.rows[0].is_creator });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot fetch status' });
  }
});

export default router;