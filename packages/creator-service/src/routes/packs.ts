import { Router } from 'express';
import pool from '../lib/db';

const router = Router();

// Constraints & simple profanity list (placeholder for MVP)
const MAX_CARDS = 100;
const MAX_CARD_LENGTH = 500;
const PROFANE = ['fuck', 'shit', 'bitch'];

function hasProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return PROFANE.some(w => lower.includes(w));
}

function validateContent(content?: string) {
  if (typeof content !== 'string' || !content.trim()) return 'content is required';
  if (content.length > MAX_CARD_LENGTH) return `content exceeds ${MAX_CARD_LENGTH} chars`;
  if (hasProfanity(content)) return 'content contains prohibited words';
  return null;
}

function validateCards(cards?: string[]) {
  if (!Array.isArray(cards)) return 'cards must be an array';
  if (cards.length > MAX_CARDS) return `too many cards (>${MAX_CARDS})`;
  for (const c of cards) {
    const err = validateContent(c);
    if (err) return err;
  }
  return null;
}

// Create a new pack
router.post('/', async (req, res) => {
  const { creatorId, title, description } = req.body as {
    creatorId?: string;
    title?: string;
    description?: string;
  };
  if (!creatorId || !title) {
    return res.status(400).json({ error: 'creatorId and title are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO "Packs" (creator_id, title, description) VALUES ($1, $2, $3) RETURNING pack_id',
      [creatorId, title, description ?? null]
    );
    return res.status(201).json({ packId: result.rows[0].pack_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create pack' });
  }
});

router.post('/:id/submit', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE "Packs" SET status = $1 WHERE pack_id = $2',
      ['pending_review', id]
    );
    const result = await pool.query(
      'INSERT INTO "ModerationLog" (content_id, content_type, status, action_taken, moderator_id, notes, timestamp) VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING log_id',
      [id, 'pack', 'pending_review', 'submitted', null, 'Pack submitted for review']
    );
    res.json({ message: 'Submitted', logId: result.rows[0].log_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit pack' });
  }
});

// Save cards ordering/content for a pack (MVP stores JSON in description)
router.put('/:id/cards', async (req, res) => {
  const { id } = req.params;
  const { cards } = req.body as { cards?: string[] };
  if (!Array.isArray(cards)) {
    return res.status(400).json({ error: 'cards must be an array of strings' });
  }
  const invalid = validateCards(cards);
  if (invalid) return res.status(400).json({ error: invalid });
  try {
    await pool.query('BEGIN');
    await pool.query('DELETE FROM "Cards" WHERE pack_id = $1',[id]);
    for (let i = 0; i < cards.length; i++) {
      await pool.query('INSERT INTO "Cards" (pack_id, position, content) VALUES ($1, $2, $3)',[id, i, cards[i]]);
    }
    await pool.query('UPDATE "Packs" SET description = $1 WHERE pack_id = $2',[JSON.stringify({ cards }), id]);
    await pool.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save cards' });
  }
});

// Load cards for a pack
router.get('/:id/cards', async (req, res) => {
  const { id } = req.params;
  try {
    const norm = await pool.query('SELECT content FROM "Cards" WHERE pack_id = $1 ORDER BY position ASC',[id]);
    if (norm.rowCount && norm.rowCount > 0) {
      return res.json({ cards: norm.rows.map((r: any) => r.content) });
    }
    const result = await pool.query('SELECT description FROM "Packs" WHERE pack_id = $1',[id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Pack not found' });
    const desc = result.rows[0]?.description || '';
    let cards: string[] = [];
    try {
      const parsed = JSON.parse(desc);
      if (parsed && Array.isArray(parsed.cards)) cards = parsed.cards;
    } catch {}
    return res.json({ cards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// Partial update a single card by index (position)
router.patch('/:id/cards', async (req, res) => {
  const { id } = req.params;
  const { index, content } = req.body as { index?: number; content?: string };
  if (typeof index !== 'number' || index < 0 || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'index (>=0) and non-empty content are required' });
  }
  const invalid = validateContent(content);
  if (invalid) return res.status(400).json({ error: invalid });
  try {
    // Try to update; if no row, insert
    const upd = await pool.query(
      'UPDATE "Cards" SET content = $3, updated_at = NOW() WHERE pack_id = $1 AND position = $2',
      [id, index, content]
    );
    if (upd.rowCount === 0) {
      await pool.query(
        'INSERT INTO "Cards" (pack_id, position, content) VALUES ($1, $2, $3)',
        [id, index, content]
      );
    }
    // Keep JSON fallback in sync (best-effort)
    const descRes = await pool.query('SELECT description FROM "Packs" WHERE pack_id = $1', [id]);
    if (descRes.rowCount && descRes.rowCount > 0) {
      let cardsJson: any = { cards: [] as string[] };
      try {
        cardsJson = JSON.parse(descRes.rows[0]?.description || '{}');
      } catch {}
      if (!cardsJson || !Array.isArray(cardsJson.cards)) cardsJson = { cards: [] };
      // Ensure array length
      while (cardsJson.cards.length <= index) cardsJson.cards.push('');
      cardsJson.cards[index] = content;
      await pool.query('UPDATE "Packs" SET description = $1 WHERE pack_id = $2', [JSON.stringify(cardsJson), id]);
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update card' });
  }
});

// Add a single card at index (append if index omitted)
router.post('/:id/cards', async (req, res) => {
  const { id } = req.params;
  const { content, index } = req.body as { content?: string; index?: number };
  if (typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'non-empty content is required' });
  }
  const invalid = validateContent(content);
  if (invalid) return res.status(400).json({ error: invalid });
  try {
    await pool.query('BEGIN');
    let pos: number;
    if (typeof index !== 'number' || index < 0) {
      const cnt = await pool.query('SELECT COUNT(*)::int AS c FROM "Cards" WHERE pack_id = $1', [id]);
      pos = (cnt.rows?.[0]?.c ?? 0);
    } else {
      pos = index;
      await pool.query('UPDATE "Cards" SET position = position + 1 WHERE pack_id = $1 AND position >= $2', [id, pos]);
    }
    await pool.query('INSERT INTO "Cards" (pack_id, position, content) VALUES ($1, $2, $3)', [id, pos, content.trim()]);
    // Update JSON fallback
    const descRes = await pool.query('SELECT description FROM "Packs" WHERE pack_id = $1', [id]);
    let cardsJson: any = { cards: [] as string[] };
    try { cardsJson = JSON.parse(descRes.rows?.[0]?.description || '{}'); } catch {}
    if (!cardsJson || !Array.isArray(cardsJson.cards)) cardsJson = { cards: [] };
    if (pos >= cardsJson.cards.length) cardsJson.cards.push(content.trim());
    else cardsJson.cards.splice(pos, 0, content.trim());
    await pool.query('UPDATE "Packs" SET description = $1 WHERE pack_id = $2', [JSON.stringify(cardsJson), id]);
    await pool.query('COMMIT');
    return res.json({ ok: true, index: pos });
  } catch (err) {
    console.error(err);
    await pool.query('ROLLBACK').catch(() => {});
    return res.status(500).json({ error: 'Failed to add card' });
  }
});

// Delete a single card by index and shift positions
router.delete('/:id/cards', async (req, res) => {
  const { id } = req.params;
  const index = Number(req.query.index);
  if (!Number.isInteger(index) || index < 0) {
    return res.status(400).json({ error: 'index query param (>=0) is required' });
  }
  try {
    await pool.query('BEGIN');
    await pool.query('DELETE FROM "Cards" WHERE pack_id = $1 AND position = $2', [id, index]);
    await pool.query('UPDATE "Cards" SET position = position - 1 WHERE pack_id = $1 AND position > $2', [id, index]);
    // Update JSON fallback
    const descRes = await pool.query('SELECT description FROM "Packs" WHERE pack_id = $1', [id]);
    let cardsJson: any = { cards: [] as string[] };
    try { cardsJson = JSON.parse(descRes.rows?.[0]?.description || '{}'); } catch {}
    if (cardsJson && Array.isArray(cardsJson.cards) && index < cardsJson.cards.length) {
      cardsJson.cards.splice(index, 1);
      await pool.query('UPDATE "Packs" SET description = $1 WHERE pack_id = $2', [JSON.stringify(cardsJson), id]);
    }
    await pool.query('COMMIT');
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    await pool.query('ROLLBACK').catch(() => {});
    return res.status(500).json({ error: 'Failed to delete card' });
  }
});

// Bulk reorder positions based on source indices -> new order
router.patch('/:id/cards/reorder', async (req, res) => {
  const { id } = req.params;
  const { order } = req.body as { order?: number[] };
  if (!Array.isArray(order) || order.some(n => typeof n !== "number" || n < 0)) {
    return res.status(400).json({ error: "order must be an array of >=0 integers" });
  }
  try {
    await pool.query('BEGIN');
    const cur = await pool.query('SELECT content FROM "Cards" WHERE pack_id = $1 ORDER BY position ASC', [id]);
    const contents: string[] = cur.rows.map((r: any) => r.content);
    if (order.length !== contents.length) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: "order size mismatch" });
    }
    const newContentsts = order.map(i => contents[i]);
    await pool.query('DELETE FROM "Cards" WHERE pack_id = $1', [id]);
    for (let i = 0; i < newContentsts.length; i++) {
      await pool.query('INSERT INTO "Cards" (pack_id, position, content) VALUES ($1, $2, $3)', [id, i, newContentsts[i]]);
    }
    await pool.query('UPDATE "Packs" SET description = $1 WHERE pack_id = $2', [JSON.stringify({ cards: newContentsts }), id]);
    await pool.query('COMMIT');
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    await pool.query('ROLLBACK').catch(() => {});
    return res.status(500).json({ error: "Failed to reorder cards" });
  }
});

export default router;
