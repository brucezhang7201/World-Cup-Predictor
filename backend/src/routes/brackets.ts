import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db';
import { requireAuth, type AuthRequest } from '../middleware/auth';

const router = Router();

// POST / — save a new bracket
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const { name, stateJson } = req.body;
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'Name is required' });
    return;
  }
  if (!stateJson) {
    res.status(400).json({ error: 'stateJson is required' });
    return;
  }

  const id = uuid();
  const shareToken = uuid();
  const stateStr = typeof stateJson === 'string' ? stateJson : JSON.stringify(stateJson);

  db.prepare(
    'INSERT INTO brackets (id, user_id, name, state_json, share_token) VALUES (?, ?, ?, ?, ?)'
  ).run(id, req.userId!, name, stateStr, shareToken);

  res.status(201).json({ id, name, shareToken });
});

// GET / — list all brackets for the current user
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const rows = db.prepare(
    'SELECT id, name, share_token as shareToken, created_at as createdAt, updated_at as updatedAt FROM brackets WHERE user_id = ? ORDER BY updated_at DESC'
  ).all(req.userId!) as Array<{ id: string; name: string; shareToken: string; createdAt: string; updatedAt: string }>;

  res.json(rows);
});

// GET /share/:token — public, no auth
router.get('/share/:token', (req, res) => {
  const row = db.prepare(
    'SELECT name, state_json as stateJson FROM brackets WHERE share_token = ?'
  ).get(req.params.token) as { name: string; stateJson: string } | undefined;

  if (!row) {
    res.status(404).json({ error: 'Bracket not found' });
    return;
  }
  res.json({ name: row.name, stateJson: JSON.parse(row.stateJson) });
});

// GET /:id — load a bracket by ID (must be owned by user)
router.get('/:id', requireAuth, (req: AuthRequest, res) => {
  const row = db.prepare(
    'SELECT id, user_id as userId, name, state_json as stateJson, share_token as shareToken, created_at as createdAt, updated_at as updatedAt FROM brackets WHERE id = ?'
  ).get(req.params.id) as { id: string; userId: string; name: string; stateJson: string; shareToken: string; createdAt: string; updatedAt: string } | undefined;

  if (!row) {
    res.status(404).json({ error: 'Bracket not found' });
    return;
  }
  if (row.userId !== req.userId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  res.json({ ...row, stateJson: JSON.parse(row.stateJson) });
});

// DELETE /:id — delete a bracket (must be owned by user)
router.delete('/:id', requireAuth, (req: AuthRequest, res) => {
  const row = db.prepare('SELECT user_id as userId FROM brackets WHERE id = ?').get(req.params.id) as { userId: string } | undefined;

  if (!row) {
    res.status(404).json({ error: 'Bracket not found' });
    return;
  }
  if (row.userId !== req.userId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  db.prepare('DELETE FROM brackets WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
