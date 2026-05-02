## Context

The World Cup Predictor is a frontend-only React + TypeScript + Vite SPA. All state lives in `AppContext` (React context + `useState`). Sharing is currently done by encoding the full `AppState` into the URL hash. There is no backend, no database, and no user identity.

Adding user accounts requires introducing a backend layer for the first time. The frontend already has a clean context-based state model that can be extended to include auth state and saved brackets.

## Goals / Non-Goals

**Goals:**
- Introduce a backend API and database to support user accounts and bracket persistence
- Allow users to register and log in with email and password
- Allow authenticated users to save, load, share (public link), and delete their brackets
- Keep the existing URL-hash sharing working unchanged (backwards compatibility)

**Non-Goals:**
- OAuth / social login (Google, GitHub, etc.) — out of scope for v1
- Email verification or password reset flows — out of scope for v1
- Real-time collaboration or bracket forking
- Admin dashboards or moderation tools

## Decisions

### Decision 1: Use a lightweight Node.js/Express backend with SQLite

**Choice:** Node.js + Express + SQLite (via `better-sqlite3`)

**Rationale:** The app is a small personal/hobby project. A heavyweight stack (NestJS, PostgreSQL, ORM) adds unnecessary complexity. SQLite stores the database as a single file, requires zero infrastructure, and is well-suited for a low-traffic app. The existing frontend is already JS/TS, so Node keeps the language consistent.

**Alternatives considered:**
- PostgreSQL: More production-ready but requires a running DB server. Overkill for a small app.
- Firebase/Supabase: Managed BaaS avoids building a backend but adds vendor lock-in and cost. A local backend is simpler for development.
- Serverless functions (e.g., Vercel): Viable long-term but adds deployment complexity now.

### Decision 2: JWT-based stateless authentication

**Choice:** JWTs stored in `httpOnly` cookies

**Rationale:** JWTs are stateless (no server-side session store needed), and `httpOnly` cookies prevent XSS-based token theft. The token carries the `userId` claim, so the API can identify the user on every request without a DB lookup for auth.

**Alternatives considered:**
- `localStorage` JWTs: Simpler but vulnerable to XSS.
- Server-side sessions (express-session): Requires session storage and stickiness — more operational complexity.

### Decision 3: Store bracket snapshots as JSON blobs

**Choice:** Serialize the full `AppState` as a JSON string in a `brackets` table

**Rationale:** The `AppState` shape already works as a complete, self-contained snapshot. Normalizing it into relational tables (groups, matches, teams) would require significant schema design and migration complexity with no query benefit — the app always loads/saves the whole bracket at once.

**Schema:**
```
users(id, email, password_hash, created_at)
brackets(id, user_id, name, state_json, share_token, created_at, updated_at)
```

`share_token` is a random UUID generated on save; the public share URL is `/?share=<token>`.

### Decision 4: Introduce a React `AuthContext` alongside existing `AppContext`

**Choice:** New `AuthContext` wraps `AppProvider` and holds `{ user, login, logout, register }`

**Rationale:** Keeps auth concerns separated from bracket state logic. `AppContext` doesn't need to know about the user; it just manages the bracket state. Components that need to gate features on auth (save button, bracket list) consume `AuthContext` directly.

### Decision 5: Vite proxy for local dev

**Choice:** Configure `vite.config.ts` to proxy `/api/*` to the backend server during development

**Rationale:** Avoids CORS issues in dev without changing production deployment assumptions. In production, a reverse proxy (nginx, Vercel rewrites, etc.) serves the same purpose.

## Risks / Trade-offs

- **SQLite concurrency**: SQLite has limited write concurrency. Acceptable for a personal/low-traffic app; migrating to PostgreSQL later is straightforward since the schema is simple.
- **No refresh tokens**: Access tokens expire, and the user must log in again. Simple for v1; refresh token rotation can be added later.
- **Plain JSON bracket storage**: If `AppState` shape changes in a future version, old saved brackets may not deserialize correctly. A migration strategy (schema version field) should be considered before the first breaking `AppState` change.
- **No email verification**: Users can register with any email. This is acceptable for v1 but means no password recovery path.

## Migration Plan

1. Add `backend/` directory with Express server, routes, and SQLite schema
2. Update `vite.config.ts` to proxy `/api` in dev
3. Add `AuthContext` and auth UI (login/register modal or page)
4. Add bracket save/load/delete UI in the `Share` step and a new "My Brackets" panel
5. Extend the URL-hash share flow to also support `/?share=<token>` deep links

No data migration is needed (no existing users/data). The existing URL-hash share feature continues to work unchanged.

## Open Questions

- Should saving a bracket be a one-time snapshot, or should users be able to overwrite/update an existing saved bracket?
- Where in the UI should "My Brackets" live — a sidebar, a modal from the header, or a dedicated route?
- Should the public share link show the bracket interactively (but read-only), or as a static summary?
