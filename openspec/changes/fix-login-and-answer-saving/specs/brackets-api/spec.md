## ADDED Requirements

### Requirement: Save bracket
The system SHALL accept a POST request to `/api/brackets` from authenticated users to save the current bracket state with a name.

#### Scenario: Successful save
- **WHEN** an authenticated user sends POST to `/api/brackets` with `{ "name": "My Bracket", "stateJson": { ... } }`
- **THEN** the system creates a bracket record with a generated UUID share token and returns status 201 with `{ "id": "...", "name": "My Bracket", "shareToken": "..." }`

#### Scenario: Unauthenticated save attempt
- **WHEN** an unauthenticated request is sent to POST `/api/brackets`
- **THEN** the system returns status 401

### Requirement: List user brackets
The system SHALL accept a GET request to `/api/brackets` and return all brackets owned by the authenticated user, ordered by most recently updated.

#### Scenario: User has saved brackets
- **WHEN** an authenticated user sends GET to `/api/brackets`
- **THEN** the system returns status 200 with an array of bracket summaries (id, name, shareToken, createdAt, updatedAt) ordered by updatedAt DESC

#### Scenario: User has no brackets
- **WHEN** an authenticated user with no saved brackets sends GET to `/api/brackets`
- **THEN** the system returns status 200 with an empty array

### Requirement: Load bracket by ID
The system SHALL accept a GET request to `/api/brackets/:id` and return the full bracket state if owned by the authenticated user.

#### Scenario: Load own bracket
- **WHEN** an authenticated user sends GET to `/api/brackets/:id` for a bracket they own
- **THEN** the system returns status 200 with the full bracket record including `stateJson`

#### Scenario: Load another user's bracket
- **WHEN** an authenticated user sends GET to `/api/brackets/:id` for a bracket they do not own
- **THEN** the system returns status 403

### Requirement: Delete bracket
The system SHALL accept a DELETE request to `/api/brackets/:id` to delete a bracket owned by the authenticated user.

#### Scenario: Delete own bracket
- **WHEN** an authenticated user sends DELETE to `/api/brackets/:id` for a bracket they own
- **THEN** the system deletes the bracket and returns status 200

#### Scenario: Delete nonexistent bracket
- **WHEN** an authenticated user sends DELETE to `/api/brackets/:id` for an ID that does not exist
- **THEN** the system returns status 404

### Requirement: Public share by token
The system SHALL accept a GET request to `/api/brackets/share/:token` without authentication and return the bracket state for read-only viewing.

#### Scenario: Valid share token
- **WHEN** a GET request is sent to `/api/brackets/share/:token` with a valid token
- **THEN** the system returns status 200 with `{ "name": "...", "stateJson": { ... } }`

#### Scenario: Invalid share token
- **WHEN** a GET request is sent to `/api/brackets/share/:token` with an unknown token
- **THEN** the system returns status 404
