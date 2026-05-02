## ADDED Requirements

### Requirement: Save bracket for authenticated users
The app SHALL allow authenticated users to save their current bracket with a name via `POST /api/brackets`. A save option SHALL be visible in the share step.

#### Scenario: Save bracket successfully
- **WHEN** an authenticated user clicks "Save Bracket" and enters a name
- **THEN** the app sends the current AppState to the backend, shows a confirmation with the share link

#### Scenario: Save option hidden for unauthenticated users
- **WHEN** a user is not authenticated and reaches the share step
- **THEN** the save bracket option is not visible (only URL-hash sharing is available)

### Requirement: My Brackets panel
The app SHALL provide a "My Brackets" panel accessible from the Header that lists all brackets saved by the authenticated user.

#### Scenario: View saved brackets
- **WHEN** an authenticated user opens "My Brackets"
- **THEN** the app fetches brackets from `GET /api/brackets` and displays them with name, date, and action buttons

#### Scenario: Load a saved bracket
- **WHEN** a user clicks "Load" on a saved bracket
- **THEN** the app fetches the bracket state from `GET /api/brackets/:id` and restores it into AppContext

#### Scenario: Delete a saved bracket
- **WHEN** a user clicks "Delete" on a saved bracket and confirms
- **THEN** the app sends `DELETE /api/brackets/:id` and removes it from the list

#### Scenario: Copy share link
- **WHEN** a user clicks "Copy Link" on a saved bracket
- **THEN** the app copies `{origin}/?share={token}` to the clipboard and shows a brief confirmation

### Requirement: Token-based share loading
The app SHALL check for a `?share=<token>` query parameter on load and fetch the bracket state from the public share endpoint.

#### Scenario: Load bracket from share token
- **WHEN** the app loads with `?share=abc123` in the URL
- **THEN** the app fetches `GET /api/brackets/share/abc123` and displays the bracket in read-only mode

#### Scenario: Invalid share token
- **WHEN** the app loads with `?share=invalid` and the token returns 404
- **THEN** the app shows a "Bracket not found" message

#### Scenario: Legacy hash-based share still works
- **WHEN** the app loads with `/#/share?d=...` in the URL
- **THEN** the app decodes and displays the bracket using the existing URL-hash mechanism
