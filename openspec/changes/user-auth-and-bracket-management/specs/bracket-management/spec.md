## ADDED Requirements

### Requirement: List saved brackets
The system SHALL allow an authenticated user to retrieve a list of all brackets they have saved, ordered by most recently updated. Each entry SHALL include the bracket ID, name, share token, and timestamps.

#### Scenario: User with saved brackets
- **WHEN** an authenticated user requests their bracket list
- **THEN** the system returns all of their saved brackets ordered by `updated_at` descending

#### Scenario: User with no saved brackets
- **WHEN** an authenticated user who has not saved any brackets requests their bracket list
- **THEN** the system returns an empty array with a 200 response

#### Scenario: Unauthenticated list request
- **WHEN** an unauthenticated user requests the bracket list endpoint
- **THEN** the system returns a 401 Unauthorized error

### Requirement: Delete saved bracket
The system SHALL allow an authenticated user to permanently delete one of their saved brackets. Deletion SHALL be irreversible.

#### Scenario: Successful deletion
- **WHEN** an authenticated user sends a delete request for a bracket they own
- **THEN** the system removes the bracket from the database and returns a 200 success response

#### Scenario: Delete bracket belonging to another user
- **WHEN** an authenticated user attempts to delete a bracket they do not own
- **THEN** the system returns a 403 Forbidden error without deleting any data

#### Scenario: Delete non-existent bracket
- **WHEN** an authenticated user sends a delete request for a bracket ID that does not exist
- **THEN** the system returns a 404 Not Found error

### Requirement: Copy share link
The system SHALL provide a way for an authenticated user to copy the public share URL of any of their saved brackets to the clipboard.

#### Scenario: Copy link from bracket list
- **WHEN** an authenticated user clicks "Copy Link" on a saved bracket in their list
- **THEN** the full `/?share=<token>` URL is copied to the clipboard and a confirmation is shown
