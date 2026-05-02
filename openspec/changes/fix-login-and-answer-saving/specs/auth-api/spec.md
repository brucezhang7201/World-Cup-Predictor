## ADDED Requirements

### Requirement: Email-only login
The system SHALL accept a POST request to `/api/auth/login` with an email address. If the email already exists, the system SHALL return a JWT cookie for that user. If the email does not exist, the system SHALL create a new user record and return a JWT cookie.

#### Scenario: Login with existing email
- **WHEN** a POST request is sent to `/api/auth/login` with `{ "email": "user@example.com" }` and the email exists in the database
- **THEN** the system returns status 200 with `{ "user": { "id": "...", "email": "user@example.com" } }` and sets an httpOnly JWT cookie named `token` with 7-day expiry

#### Scenario: Login with new email (auto-registration)
- **WHEN** a POST request is sent to `/api/auth/login` with `{ "email": "new@example.com" }` and the email does not exist
- **THEN** the system creates a new user record, returns status 200 with `{ "user": { "id": "...", "email": "new@example.com" } }`, and sets an httpOnly JWT cookie

#### Scenario: Login with invalid email format
- **WHEN** a POST request is sent to `/api/auth/login` with `{ "email": "not-an-email" }`
- **THEN** the system returns status 400 with `{ "error": "Invalid email" }`

### Requirement: Logout
The system SHALL accept a POST request to `/api/auth/logout` and clear the JWT cookie.

#### Scenario: Successful logout
- **WHEN** a POST request is sent to `/api/auth/logout`
- **THEN** the system clears the `token` cookie and returns status 200

### Requirement: Session restore
The system SHALL accept a GET request to `/api/auth/me` and return the current user if the JWT cookie is valid.

#### Scenario: Valid session
- **WHEN** a GET request is sent to `/api/auth/me` with a valid JWT cookie
- **THEN** the system returns status 200 with `{ "user": { "id": "...", "email": "..." } }`

#### Scenario: No session or expired token
- **WHEN** a GET request is sent to `/api/auth/me` without a valid JWT cookie
- **THEN** the system returns status 401 with `{ "error": "Unauthorized" }`
