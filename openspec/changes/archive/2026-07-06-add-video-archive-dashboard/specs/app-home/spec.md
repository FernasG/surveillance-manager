## MODIFIED Requirements

### Requirement: Authenticated home screen

The system SHALL provide a `/home` screen that is only shown to visitors holding a valid stored session, rendered within the app's sidebar navigation shell with a visual design consistent with the rest of the app.

#### Scenario: Authenticated visitor sees the home screen

- **WHEN** a user with a valid stored session navigates to `/home`
- **THEN** the system renders the home screen inside the sidebar shell, with "Home" indicated as the active sidebar entry
