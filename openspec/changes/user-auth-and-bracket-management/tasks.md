## 1. Backend Setup

- [x] 1.1 Create `backend/` directory and initialize a Node.js project (`package.json`, TypeScript config)
- [x] 1.2 Install backend dependencies: `express`, `better-sqlite3`, `bcrypt`, `jsonwebtoken`, `cookie-parser`, `cors`, `uuid`
- [x] 1.3 Install backend dev dependencies: `@types/*` for all above, `ts-node`, `nodemon`
- [x] 1.4 Create `backend/src/db.ts` — initialize SQLite connection and run schema migration on startup
- [x] 1.5 Create the `users` table: `id`, `email` (unique), `password_hash`, `created_at`
- [x] 1.6 Create the `brackets` table: `id`, `user_id` (FK), `name`, `state_json`, `share_token` (unique UUID), `created_at`, `updated_at`
- [x] 1.7 Create `backend/src/app.ts` — set up Express app with `cookie-parser`, `cors`, and JSON body parsing
- [x] 1.8 Create `backend/src/server.ts` — start the HTTP server on a configurable port (default 3001)
- [x] 1.9 Add `dev` script to `backend/package.json` to run with `nodemon` + `ts-node`

## 2. Auth API

- [x] 2.1 Create `backend/src/middleware/auth.ts` — JWT verification middleware that reads the `httpOnly` cookie and attaches `req.userId`
- [ ] 2.2 Create `POST /api/auth/register` — validate email format and password length (≥8), hash password with bcrypt, insert user, return JWT cookie
- [ ] 2.3 Create `POST /api/auth/login` — look up user by email, compare bcrypt hash, return JWT cookie on success or 401 on failure
- [ ] 2.4 Create `POST /api/auth/logout` — clear the JWT cookie and return 200
- [ ] 2.5 Create `GET /api/auth/me` — return current user info if JWT cookie is valid, 401 otherwise (used for session restore on page load)

## 3. Brackets API

- [ ] 3.1 Create `POST /api/brackets` — auth required; validate name, serialize `state_json`, generate UUID share token, insert bracket, return saved bracket with ID and share token
- [ ] 3.2 Create `GET /api/brackets` — auth required; return all brackets for the current user ordered by `updated_at` DESC
- [ ] 3.3 Create `GET /api/brackets/:id` — auth required; return bracket if owned by current user, else 403
- [ ] 3.4 Create `DELETE /api/brackets/:id` — auth required; delete bracket if owned by current user, else 403; 404 if not found
- [ ] 3.5 Create `GET /api/brackets/share/:token` — public (no auth); return bracket state for the given share token, 404 if not found

## 4. Frontend — Vite Proxy

- [ ] 4.1 Update `vite.config.ts` to proxy `/api` requests to `http://localhost:3001` during development

## 5. Frontend — Auth Context

- [ ] 5.1 Create `src/context/AuthContext.tsx` with `AuthProvider` exposing `{ user, isLoading, login, logout, register }`
- [ ] 5.2 In `AuthProvider`, call `GET /api/auth/me` on mount to restore session from cookie
- [ ] 5.3 Wrap `<AppProvider>` with `<AuthProvider>` in `src/main.tsx`

## 6. Frontend — Auth UI

- [ ] 6.1 Create `src/components/Auth/AuthModal.tsx` — modal with tabbed Login / Register forms
- [ ] 6.2 Implement the Register form: email + password fields, submit calls `register()`, shows inline errors
- [ ] 6.3 Implement the Login form: email + password fields, submit calls `login()`, shows inline errors
- [ ] 6.4 Add a login/logout button to `src/components/Header.tsx` — shows user email when logged in, opens `AuthModal` when logged out

## 7. Frontend — Bracket Save

- [ ] 7.1 Create `src/components/Share/SaveBracketPanel.tsx` — input for bracket name + "Save" button, visible only when authenticated
- [ ] 7.2 Wire the Save button to `POST /api/brackets` with the current `AppState` and bracket name
- [ ] 7.3 On successful save, display a confirmation and the share link

## 8. Frontend — My Brackets Panel

- [ ] 8.1 Create `src/components/Brackets/MyBracketsPanel.tsx` — shows a list of the user's saved brackets fetched from `GET /api/brackets`
- [ ] 8.2 Each bracket entry shows: name, save date, a "Load" button, a "Copy Link" button, and a "Delete" button
- [ ] 8.3 "Load" button fetches the bracket by ID and restores the full `AppState` via a new `loadBracket(state: AppState)` action in `AppContext`
- [ ] 8.4 "Copy Link" button copies `window.location.origin + '/?share=<token>'` to clipboard and shows a brief confirmation toast
- [ ] 8.5 "Delete" button sends `DELETE /api/brackets/:id`, prompts for confirmation first, then removes the entry from the list on success
- [ ] 8.6 Add `loadBracket(state: AppState)` action to `AppContext` and `AppContextValue`
- [ ] 8.7 Add a "My Brackets" entry point in `Header.tsx` (button or link) that opens/reveals `MyBracketsPanel` when the user is authenticated

## 9. Frontend — Public Share via Token

- [ ] 9.1 On app load, check for `?share=<token>` query parameter in addition to the existing URL hash check
- [ ] 9.2 If `?share=<token>` is present, fetch `GET /api/brackets/share/:token` and load the state in read-only mode
- [ ] 9.3 Show a "Bracket not found" message if the token returns 404
- [ ] 9.4 Update `src/utils/urlEncoding.ts` (or equivalent) to handle both the legacy hash-based share and the new token-based share
