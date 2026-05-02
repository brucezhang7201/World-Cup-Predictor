## Why

The World Cup Predictor has a partially built backend (Express + SQLite schema + JWT middleware) but no working auth routes, bracket API endpoints, or frontend integration. Users cannot identify themselves, save brackets, or load previously saved predictions. This change implements a simplified email-only login (no password) so users can save and retrieve their brackets by entering their email address.

## What Changes

- Simplify the `users` table to email-only (remove `password_hash` column)
- Implement simplified auth API: identify by email, create user on first use, return JWT cookie
- Implement bracket CRUD API routes: save, list, load, delete, and public share (`/api/brackets/*`)
- Add Vite dev proxy for `/api` requests to the backend
- Create `AuthContext` for frontend session management
- Add simple email input UI for login (no password, no registration flow)
- Add bracket save functionality for identified users
- Add "My Brackets" panel to list, load, delete, and share saved brackets
- Support token-based public sharing (`?share=<token>`) alongside the existing URL-hash sharing

## Capabilities

### New Capabilities

- `auth-api`: Backend route for email-only identification — creates user on first use, returns JWT cookie for session persistence
- `brackets-api`: Backend routes for bracket CRUD operations and public sharing via token
- `frontend-auth`: AuthContext, simple email login prompt, and header integration for login/logout
- `frontend-bracket-management`: Save, list, load, delete, and share brackets from the UI

### Modified Capabilities

<!-- None — the backend skeleton and middleware already exist; this completes the unfinished routes and frontend -->

## Impact

- **Backend**: Simplify `users` table schema (drop `password_hash`); new route files `backend/src/routes/auth.ts` and `backend/src/routes/brackets.ts`; updates to `backend/src/app.ts` to mount routes
- **Frontend**: New components (`AuthContext`, email login UI, `SaveBracketPanel`, `MyBracketsPanel`); updates to `Header.tsx`, `main.tsx`, `AppContext.tsx`, `vite.config.ts`
- **Dependencies**: `bcrypt` is no longer needed; all other backend dependencies (`jsonwebtoken`, `cookie-parser`, `cors`, `uuid`) are already installed
