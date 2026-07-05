# user-login Specification

## Purpose
TBD - created by archiving change add-login-screen. Update Purpose after archive.
## Requirements
### Requirement: Login screen with username and password

The system SHALL provide a `/` screen with a form containing a username field and a password field, styled with the app's dark color scheme, when no valid session exists. If a valid session already exists, visiting `/` SHALL redirect to `/home` instead of showing the form.

#### Scenario: Login screen renders in dark mode

- **WHEN** an unauthenticated user navigates to `/`
- **THEN** the screen displays username and password inputs and a submit control, styled using the app's dark theme

#### Scenario: Already-authenticated visitor is redirected away from login

- **WHEN** a user with a valid stored session navigates to `/`
- **THEN** the system redirects them to `/home` without showing the login form

### Requirement: Client-side input validation

The system SHALL require both username and password to be non-empty and at least 3 characters long before submitting the login request, and SHALL show a validation message without contacting the backend if this is not met.

#### Scenario: Submission blocked when a field is too short

- **WHEN** a user submits the form with a username or password shorter than 3 characters
- **THEN** the system displays a validation error and does not call the login endpoint

#### Scenario: Submission blocked when a field is empty

- **WHEN** a user submits the form with an empty username or password
- **THEN** the system displays a validation error and does not call the login endpoint

### Requirement: Login request to backend

When client-side validation passes, the system SHALL send a `POST` request to `{PUBLIC_API_URL}/login` with a JSON body `{ "username": string, "password": string }`.

#### Scenario: Valid form submission calls the backend

- **WHEN** a user submits a username and password each at least 3 characters long
- **THEN** the system sends a POST request to `{PUBLIC_API_URL}/login` with a JSON body containing the entered username and password

### Requirement: Handle successful login

The system SHALL treat a successful backend response as authentication success, parse the response body as `{ "access_token": string, "token_type": string }`, persist both values, and redirect the user to `/home`.

#### Scenario: Backend accepts credentials

- **WHEN** the backend responds to the login request with a success status and a JSON body containing `access_token` and `token_type`
- **THEN** the system stores the `access_token` and `token_type` and redirects the user to `/home`

### Requirement: Handle failed login

The system SHALL display a clear error message when the backend rejects the credentials or the request fails, without navigating away from the login screen.

#### Scenario: Backend rejects credentials

- **WHEN** the backend responds to the login request with an error status indicating invalid credentials
- **THEN** the system displays an "invalid username or password" message and remains on `/`

#### Scenario: Backend or network is unreachable

- **WHEN** the login request fails due to a network error or an unexpected server error
- **THEN** the system displays a generic "couldn't reach the server" message and remains on `/`

