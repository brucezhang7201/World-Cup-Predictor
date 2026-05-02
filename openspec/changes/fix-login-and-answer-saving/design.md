## Context

The World Cup Predictor is a React 19 + TypeScript frontend with a partially built Express + SQLite backend. The backend has:
- SQLite schema with `users` and `brackets` tables (`backend/src/db.ts`)
- Express app with CORS and cookie parsing (`backend/src/app.ts`)
- JWT auth middleware (`backend/src/middleware/auth.ts`)
- App already imports route files from `./routes/auth` and `./routes/brackets` (not yet created)

The current `users` table has a `password_hash` column which is no longer needed — we're switching to email-only identification (no password). The frontend has no auth context, no login UI, and no API integration.

## Goals / Non-Goals

**Goals:**
- Email-only login: user enters email, gets identified (created on first use)
- Persistent sessions via JWT httpOnly cookies (7-day expiry)
- Full bracket CRUD: save, list, load, delete
- Public sharing via token-based URLs (`?share=<token>`)
- Backwards compatibility with existing URL-hash sharing

**Non-Goals:**
- Password-based authentication or email verification
- OAuth / social login
- Rate limiting or abuse prevention
- Multi-user collaboration on a single bracket
- Bracket versioning or history

## Decisions

### 1. Email-only identification (no password)

Users identify themselves by email only. On `POST /api/auth/login`, if the email doesn't exist, a new user is created automatically. No registration step needed.

**Rationale**: Simplifies the UX for a prediction app where security of predictions is low-stakes. Users just need a way to recall their brackets across sessions. Removes the need for `bcrypt` and password validation.

**Alternative considered**: Magic-link email verification — rejected as overkill for this use case and requires email infrastructure.

### 2. Simplify `users` table schema

Drop the `password_hash` column from the `users` table. Since SQLite doesn't support `ALTER TABLE DROP COLUMN` cleanly on all versions, we'll recreate the table without it in the migration.

**Approach**: Update `db.ts` schema to remove `password_hash NOT NULL` — since we use `CREATE TABLE IF NOT EXISTS`, we need to drop and recreate or handle the migration. Simplest: update the schema definition and let new databases use the clean schema. For existing databases with the old schema, add a migration step.

### 3. Single login endpoint replaces register + login

One endpoint `POST /api/auth/login` handles both cases:
- If email exists → return JWT for that user
- If email doesn't exist → create user, return JWT

**Rationale**: No need for separate register/login when there's no password. Reduces UI complexity to a single email input.

### 4. Frontend auth via React Context

`AuthContext` wraps the app and provides `{ user, isLoading, login, logout }`. On mount, it calls `GET /api/auth/me` to restore the session from the cookie. Components access auth state via `useAuth()` hook.

### 5. Vite dev proxy for `/api`

Configure `vite.config.ts` to proxy `/api` to `http://localhost:3001` during development, avoiding CORS issues.

## Risks / Trade-offs

- **No authentication security** → Anyone who knows an email can access that user's brackets. Acceptable for a low-stakes prediction app. Mitigation: document this as a known limitation.
- **JWT cookie without HTTPS** → In development, cookies are sent over HTTP. Mitigation: set `secure: true` only in production via environment variable.
- **SQLite schema migration** → Existing databases have `password_hash NOT NULL`. Mitigation: make the column nullable or handle the migration in `db.ts` startup.
