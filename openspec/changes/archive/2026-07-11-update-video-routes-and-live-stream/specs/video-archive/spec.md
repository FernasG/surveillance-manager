## MODIFIED Requirements

### Requirement: Video playback on thumbnail selection

The system SHALL open a centered playback overlay containing an HTML5 `<video controls autoplay>` element when a user selects a video's thumbnail, streaming from `GET /videos/{video_name}/playback`.

#### Scenario: User selects a video thumbnail

- **WHEN** a user clicks/activates a thumbnail in the gallery
- **THEN** the system opens a centered modal containing a `<video controls autoplay>` element whose source is the selected video's stream URL

#### Scenario: User closes the playback overlay

- **WHEN** a user dismisses the modal (close control, backdrop click, or Escape key)
- **THEN** the system closes the modal and stops the video element from playing

### Requirement: Authenticated media URLs via query parameter

The system SHALL append the current session's access token as a `token` query parameter on every thumbnail image URL and video stream URL, since these are loaded via native `<img>`/`<video>` elements that cannot send an `Authorization` header.

#### Scenario: Gallery renders thumbnails

- **WHEN** the system renders a thumbnail for a video whose `thumbnail_url` is `http://localhost:3000/videos/cam1_1783291071.mp4/thumbnail`
- **THEN** the `<img>` element's `src` is that URL with `?token={access_token}` appended

#### Scenario: Playback overlay loads a video stream

- **WHEN** the system opens the playback overlay for `cam1_1783291071.mp4`
- **THEN** the `<video>` element's `src` is `http://localhost:8000/videos/cam1_1783291071.mp4/playback?token={access_token}`

#### Scenario: No active session

- **WHEN** a request for a media URL is constructed while there is no valid stored session
- **THEN** the system does not render the media element with a tokenless URL; the surrounding route-level authentication guard applies instead
