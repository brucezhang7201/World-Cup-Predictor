import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'data.sqlite');

const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for better concurrency
db.exec('PRAGMA journal_mode=WAL;');
db.exec('PRAGMA foreign_keys=ON;');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS brackets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    state_json TEXT NOT NULL,
    share_token TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_brackets_user_id ON brackets(user_id);
  CREATE INDEX IF NOT EXISTS idx_brackets_share_token ON brackets(share_token);
`);

export default db;
