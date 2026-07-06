## ADDED Requirements

### Requirement: Video Archive gallery

The system SHALL provide a Video Archive section, reachable from the app sidebar, that lists recorded videos as a gallery of thumbnails fetched from `GET /videos`.

#### Scenario: Authenticated user opens the Video Archive

- **WHEN** a user with a valid stored session selects "Video Archive" in the sidebar
- **THEN** the system requests `GET /videos` (page 1, default size) and renders a thumbnail for each returned video

#### Scenario: No recorded videos exist

- **WHEN** `GET /videos` returns `total_items: 0`
- **THEN** the system shows an empty-state message instead of an empty grid

#### Scenario: Video list request fails

- **WHEN** `GET /videos` fails or returns a non-2xx response
- **THEN** the system shows an inline error message and does not render a partial/broken gallery

### Requirement: Optional date range filtering

The system SHALL allow the user to optionally filter the gallery by a start date and/or end date, sent to the API as `start_date` and `end_date` query parameters in `YYYY-MM-DD` format.

#### Scenario: User filters by start and end date

- **WHEN** a user sets both a start date and an end date and applies the filter
- **THEN** the system requests `GET /videos` with `start_date` and `end_date` query parameters formatted as `YYYY-MM-DD`, resets to page 1, and replaces the gallery with the filtered results

#### Scenario: User filters with only one date set

- **WHEN** a user sets only a start date (or only an end date) and applies the filter
- **THEN** the system sends only the populated date as a query parameter and omits the empty one entirely

#### Scenario: User clears the date filters

- **WHEN** a user clears previously-applied date filters
- **THEN** the system requests `GET /videos` with no date query parameters and shows the unfiltered, most-recent-first archive

### Requirement: Paginated loading of older videos

The system SHALL use the pagination metadata (`page`, `total_pages`) from `GET /videos` to let the user load additional, older videos via a "Load More" control, appending results to the existing gallery.

#### Scenario: More pages are available

- **WHEN** the current response's `page` is less than `total_pages`
- **THEN** the system shows a "Load More" control that, when activated, requests the next `page` (with any active date filters preserved) and appends the returned videos to the gallery

#### Scenario: All pages have been loaded

- **WHEN** the current response's `page` equals `total_pages`
- **THEN** the system hides the "Load More" control

### Requirement: Video playback on thumbnail selection

The system SHALL open a centered playback overlay containing an HTML5 `<video controls autoplay>` element when a user selects a video's thumbnail, streaming from `GET /videos/{video_name}`.

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
- **THEN** the `<video>` element's `src` is `http://localhost:8000/videos/cam1_1783291071.mp4?token={access_token}`

#### Scenario: No active session

- **WHEN** a request for a media URL is constructed while there is no valid stored session
- **THEN** the system does not render the media element with a tokenless URL; the surrounding route-level authentication guard applies instead
