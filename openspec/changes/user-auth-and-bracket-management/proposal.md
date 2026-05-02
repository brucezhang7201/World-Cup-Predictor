## Why

The World Cup Predictor currently has no user accounts, meaning brackets are lost when the browser session ends and cannot be saved, shared, or managed across devices. Adding user authentication enables persistent, user-owned brackets that can be revisited, shared with others, and curated over time.

## What Changes

- Users can create an account with email and password
- Users can log in and log out
- Authenticated users can save brackets they create, with a custom name
- Users can view a list of their previously saved brackets and reload any of them
- Users can share a bracket via a public link that anyone can view (read-only)
- Users can delete brackets they no longer want

## Capabilities

### New Capabilities

- `user-auth`: Account registration, login, logout, and session management using email and password
- `bracket-persistence`: Saving the current bracket state to the user's account with a name
- `bracket-management`: Listing, loading, sharing (public link), and deleting saved brackets

### Modified Capabilities

<!-- None — this is a greenfield addition with no existing specs to update -->

## Impact

- **Frontend**: New auth UI (login/register forms), bracket save/load/share/delete controls, routing for shared bracket views
- **Backend**: New backend service (API + database) required — the app is currently frontend-only
- **Dependencies**: Backend framework (e.g., Node/Express or similar), database (e.g., PostgreSQL or SQLite), JWT or session-based auth, password hashing (bcrypt)
- **State management**: AppContext will need to integrate saved bracket data and current user session
