import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db';
import { requireAuth, signToken, type AuthRequest } from '../middleware/auth';

const router = Router();

// POST /login — find-or-create user by email, return JWT cookie
router.post('/login', (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  let row = db.prepare('SELECT id, email FROM users WHERE email = ?').get(normalizedEmail) as { id: string; email: string } | undefined;

  if (!row) {
    const id = uuid();
    db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').run(id, normalizedEmail);
    row = { id, email: normalizedEmail };
  }

  const token = signToken(row.id);
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ user: { id: row.id, email: row.email } });
});

// POST /logout — clear the token cookie
router.post('/logout', (_req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

// GET /me — return current user if JWT is valid
router.get('/me', requireAuth, (req: AuthRequest, res) => {
  const row = db.prepare('SELECT id, email FROM users WHERE id = ?').get(req.userId!) as { id: string; email: string } | undefined;
  if (!row) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.json({ user: { id: row.id, email: row.email } });
});

export default router;
