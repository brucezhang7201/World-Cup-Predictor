## ADDED Requirements

### Requirement: AuthContext provides session state
The app SHALL have an AuthContext that exposes `{ user, isLoading, login, logout }` to all components. On app mount, it SHALL call `GET /api/auth/me` to restore the session from the cookie.

#### Scenario: Session restored on page load
- **WHEN** the app loads and a valid JWT cookie exists
- **THEN** AuthContext sets `user` to the current user object and `isLoading` to false

#### Scenario: No session on page load
- **WHEN** the app loads and no valid JWT cookie exists
- **THEN** AuthContext sets `user` to null and `isLoading` to false

### Requirement: Email login prompt
The app SHALL provide an email input UI that allows users to identify themselves by entering their email address. Submitting the email SHALL call the login endpoint and update AuthContext.

#### Scenario: User enters email and submits
- **WHEN** a user enters their email and submits the login form
- **THEN** the app calls `POST /api/auth/login` with the email, sets the user in AuthContext, and closes the login UI

#### Scenario: Login with invalid email
- **WHEN** a user enters an invalid email format and submits
- **THEN** the app shows an inline error message

### Requirement: Header shows auth status
The Header component SHALL show a "Log In" button when the user is not authenticated, and the user's email plus a "Log Out" button when authenticated.

#### Scenario: Not logged in
- **WHEN** the user is not authenticated
- **THEN** the Header displays a "Log In" button that opens the email login prompt

#### Scenario: Logged in
- **WHEN** the user is authenticated
- **THEN** the Header displays the user's email and a "Log Out" button that calls logout and clears the session
