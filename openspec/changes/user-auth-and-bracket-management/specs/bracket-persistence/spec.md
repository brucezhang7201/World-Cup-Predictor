## ADDED Requirements

### Requirement: Save bracket
The system SHALL allow an authenticated user to save their current bracket state to their account. Each saved bracket SHALL have a user-defined name. The full `AppState` SHALL be serialized and stored as a JSON snapshot. A unique, random share token SHALL be generated for each saved bracket.

#### Scenario: Successful save
- **WHEN** an authenticated user submits a save request with a bracket name and their current bracket state
- **THEN** the system stores the bracket snapshot and returns the saved bracket's ID and share token

#### Scenario: Unauthenticated save attempt
- **WHEN** an unauthenticated user attempts to save a bracket
- **THEN** the system returns a 401 Unauthorized error

#### Scenario: Missing bracket name
- **WHEN** an authenticated user submits a save request without a name
- **THEN** the system returns a 400 Bad Request error

### Requirement: Load saved bracket
The system SHALL allow an authenticated user to load a previously saved bracket, restoring the full bracket state into the app.

#### Scenario: Successful load
- **WHEN** an authenticated user selects a saved bracket to load
- **THEN** the app replaces the current bracket state with the saved snapshot and navigates to the appropriate step

#### Scenario: Load bracket belonging to another user
- **WHEN** an authenticated user attempts to load a bracket they do not own (by ID)
- **THEN** the system returns a 403 Forbidden error

### Requirement: Public share link
Each saved bracket SHALL have a permanent, publicly accessible share URL in the format `/?share=<token>`. Anyone with the link SHALL be able to view the bracket in read-only mode without logging in.

#### Scenario: Valid share link
- **WHEN** any visitor (authenticated or not) opens a `/?share=<token>` URL
- **THEN** the app loads and displays the shared bracket in read-only mode

#### Scenario: Invalid or missing share token
- **WHEN** a visitor opens a `/?share=<token>` URL where the token does not match any bracket
- **THEN** the app displays an appropriate "bracket not found" error state
