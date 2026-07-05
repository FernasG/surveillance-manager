## ADDED Requirements

### Requirement: Authenticated home screen

The system SHALL provide a `/home` screen that is only shown to visitors holding a valid stored session, with a visual design consistent with the rest of the app.

#### Scenario: Authenticated visitor sees the home screen

- **WHEN** a user with a valid stored session navigates to `/home`
- **THEN** the system renders the home screen

### Requirement: Home screen requires authentication

The system SHALL redirect visitors without a valid stored session away from `/home` to `/`.

#### Scenario: Unauthenticated visitor is redirected to login

- **WHEN** a user without a valid stored session navigates to `/home`
- **THEN** the system redirects them to `/` without rendering home screen content
