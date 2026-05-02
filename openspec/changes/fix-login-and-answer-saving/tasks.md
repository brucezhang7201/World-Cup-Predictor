## 1. Backend Schema Update

- [x] 1.1 Update `backend/src/db.ts` to remove `password_hash` column from the `users` table schema (make it email-only)

## 2. Auth API Routes

- [x] 2.1 Create `backend/src/routes/auth.ts` with `POST /login` — validate email, find-or-create user, return JWT cookie and user object
- [x] 2.2 Add `POST /logout` — clear the `token` cookie
- [x] 2.3 Add `GET /me` — verify JWT cookie and return current user, or 401

## 3. Brackets API Routes

- [x] 3.1 Create `backend/src/routes/brackets.ts` with `POST /` — auth required; save bracket with name, stateJson, and generated share token
- [x] 3.2 Add `GET /` — auth required; return all brackets for the current user ordered by updatedAt DESC
- [x] 3.3 Add `GET /:id` — auth required; return bracket if owned by user, else 403
- [x] 3.4 Add `DELETE /:id` — auth required; delete bracket if owned by user, else 403; 404 if not found
- [x] 3.5 Add `GET /share/:token` — public; return bracket name and stateJson by share token, 404 if not found

## 4. Frontend — Vite Proxy

- [x] 4.1 Update `vite.config.ts` to proxy `/api` requests to `http://localhost:3001`

## 5. Frontend — Auth Context

- [x] 5.1 Create `src/context/AuthContext.tsx` with `AuthProvider` exposing `{ user, isLoading, login, logout }` via `useAuth()` hook
- [x] 5.2 Call `GET /api/auth/me` on mount to restore session from cookie
- [x] 5.3 Wrap the app with `<AuthProvider>` in `src/App.tsx` (wraps AppProvider)

## 6. Frontend — Auth UI

- [x] 6.1 Create `src/components/Auth/LoginModal.tsx` — modal with email input and submit button
- [x] 6.2 Add login/logout controls to `src/components/Header.tsx` — show email + "Log Out" when authenticated, "Log In" button when not

## 7. Frontend — Bracket Save

- [x] 7.1 Create `src/components/Share/SaveBracketPanel.tsx` — name input + "Save" button, visible only when authenticated
- [x] 7.2 Wire save to `POST /api/brackets` with current AppState; show confirmation with share link on success

## 8. Frontend — My Brackets Panel

- [ ] 8.1 Create `src/components/Brackets/MyBracketsPanel.tsx` — list saved brackets with Load, Copy Link, and Delete actions
- [ ] 8.2 Add `loadBracket(state: AppState)` action to AppContext
- [ ] 8.3 Add "My Brackets" button to Header (visible when authenticated)

## 9. Frontend — Token-Based Share Loading

- [ ] 9.1 On app load, check for `?share=<token>` query param and fetch `GET /api/brackets/share/:token` to load in read-only mode
- [ ] 9.2 Show "Bracket not found" message if share token returns 404
- [ ] 9.3 Ensure legacy hash-based sharing (`/#/share?d=...`) continues to work
