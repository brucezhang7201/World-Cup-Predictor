## ADDED Requirements

### Requirement: User registration
The system SHALL allow a new user to create an account using an email address and password. The email SHALL be unique across all accounts. The password SHALL be stored as a bcrypt hash and never in plaintext.

#### Scenario: Successful registration
- **WHEN** a user submits a valid email and password (minimum 8 characters)
- **THEN** the system creates a new account, returns a success response, and sets an authenticated session cookie

#### Scenario: Duplicate email
- **WHEN** a user attempts to register with an email already associated with an existing account
- **THEN** the system returns a 409 Conflict error with a message indicating the email is already in use

#### Scenario: Invalid email format
- **WHEN** a user submits a registration form with a malformed email address
- **THEN** the system returns a 400 Bad Request error before attempting to create the account

#### Scenario: Password too short
- **WHEN** a user submits a password shorter than 8 characters
- **THEN** the system returns a 400 Bad Request error indicating the password requirement

### Requirement: User login
The system SHALL allow an existing user to log in using their email and password. On success, the system SHALL issue a JWT stored in an `httpOnly` cookie valid for 7 days.

#### Scenario: Successful login
- **WHEN** a user submits a correct email and password
- **THEN** the system returns a 200 response with user information and sets an `httpOnly` JWT cookie

#### Scenario: Wrong password
- **WHEN** a user submits a correct email but incorrect password
- **THEN** the system returns a 401 Unauthorized error with a generic "Invalid credentials" message (not revealing which field was wrong)

#### Scenario: Unknown email
- **WHEN** a user submits an email not associated with any account
- **THEN** the system returns a 401 Unauthorized error with a generic "Invalid credentials" message

### Requirement: User logout
The system SHALL allow an authenticated user to log out, which clears the JWT cookie and ends their session.

#### Scenario: Successful logout
- **WHEN** an authenticated user sends a logout request
- **THEN** the system clears the JWT cookie and returns a 200 success response

### Requirement: Session persistence
The system SHALL maintain a user's authenticated session across page reloads using the `httpOnly` JWT cookie. On app load, the frontend SHALL check if a valid session exists and restore the authenticated state.

#### Scenario: Valid session on reload
- **WHEN** a user with a valid JWT cookie loads or reloads the app
- **THEN** the frontend identifies the user as authenticated without requiring a new login

#### Scenario: Expired session on reload
- **WHEN** a user's JWT cookie has expired and they load the app
- **THEN** the frontend treats the user as unauthenticated and the expired cookie is cleared
