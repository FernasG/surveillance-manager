# live-camera-stream Specification

## Purpose
TBD - created by syncing change update-video-routes-and-live-stream. Update Purpose after archive.

## Requirements

### Requirement: Live camera feed on Home

The system SHALL render a live video player on the Home screen, streaming from `GET /videos/live`, in place of the previous static placeholder content.

#### Scenario: Authenticated user opens Home

- **WHEN** a user with a valid stored session navigates to `/home`
- **THEN** the system renders a live video player sourced from `GET /videos/live` and begins playback automatically

#### Scenario: No active session

- **WHEN** a request for the live stream URL is constructed while there is no valid stored session
- **THEN** the system does not render the player with a tokenless URL; the surrounding route-level authentication guard applies instead

### Requirement: Authenticated live stream URL via query parameter

The system SHALL append the current session's access token as a `token` query parameter on the live stream URL, since it is loaded via a native media element that cannot send an `Authorization` header.

#### Scenario: Home renders the live player

- **WHEN** the system renders the live video player for a session with access token `abc123`
- **THEN** the player's source URL is `http://localhost:8000/videos/live?token=abc123`

### Requirement: Live feed error and offline state

The system SHALL show an inline error state with a manual retry control when the live stream fails to load or stalls, instead of a broken or frozen player.

#### Scenario: Live stream fails to load

- **WHEN** the live video element emits an error while loading `GET /videos/live`
- **THEN** the system replaces the player with an inline message indicating the feed is unavailable and a "Retry" control

#### Scenario: User retries after a failure

- **WHEN** a user activates the "Retry" control after a feed failure
- **THEN** the system attempts to reload the live stream and returns to the loading/live state on success
