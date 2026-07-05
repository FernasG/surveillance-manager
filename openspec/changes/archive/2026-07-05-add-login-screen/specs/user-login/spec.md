## ADDED Requirements

### Requirement: Login screen with username and password

The system SHALL provide a `/login` screen with a form containing a username field and a password field, styled with the app's dark color scheme.

#### Scenario: Login screen renders in dark mode

- **WHEN** a user navigates to `/login`
- **THEN** the screen displays username and password inputs and a submit control, styled using the app's dark theme

### Requirement: Client-side input validation

The system SHALL require both username and password to be non-empty and at least 3 characters long before submitting the login request, and SHALL show a validation message without contacting the backend if this is not met.

#### Scenario: Submission blocked when a field is too short

- **WHEN** a user submits the form with a username or password shorter than 3 characters
- **THEN** the system displays a validation error and does not call the login endpoint

#### Scenario: Submission blocked when a field is empty

- **WHEN** a user submits the form with an empty username or password
- **THEN** the system displays a validation error and does not call the login endpoint

### Requirement: Login request to backend

When client-side validation passes, the system SHALL send a `POST` request to `{API_URL}/login` with a JSON body `{ "username": string, "password": string }`.

#### Scenario: Valid form submission calls the backend

- **WHEN** a user submits a username and password each at least 3 characters long
- **THEN** the system sends a POST request to `{API_URL}/login` with a JSON body containing the entered username and password

### Requirement: Handle successful login

The system SHALL treat a successful backend response as authentication success, persist the returned session data, and redirect the user away from the login screen.

#### Scenario: Backend accepts credentials

- **WHEN** the backend responds to the login request with a success status
- **THEN** the system stores the returned session/token data and redirects the user to the app's home page

### Requirement: Handle failed login

The system SHALL display a clear error message when the backend rejects the credentials or the request fails, without navigating away from the login screen.

#### Scenario: Backend rejects credentials

- **WHEN** the backend responds to the login request with an error status indicating invalid credentials
- **THEN** the system displays an "invalid username or password" message and remains on the login screen

#### Scenario: Backend or network is unreachable

- **WHEN** the login request fails due to a network error or an unexpected server error
- **THEN** the system displays a generic "couldn't reach the server" message and remains on the login screen
