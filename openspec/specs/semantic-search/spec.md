# semantic-search Specification

## Purpose
TBD - created by archiving change add-semantic-search. Update Purpose after archive.

## Requirements

### Requirement: Natural-language query submission

The system SHALL provide a Semantic Search section, reachable from the app sidebar, with a centered search input that submits the entered text to `POST /query` with an `Authorization: Bearer <token>` header and a JSON body `{ "text": <query> }`.

#### Scenario: User submits a query

- **WHEN** a user with a valid stored session types a natural-language query and submits it
- **THEN** the system sends `POST /query` with the query text in the body and the session's bearer token in the `Authorization` header

#### Scenario: Query request fails

- **WHEN** `POST /query` fails or returns a non-2xx response
- **THEN** the system shows an inline error message and does not render a partial/broken result grid

#### Scenario: No matching moments found

- **WHEN** `POST /query` succeeds and returns an empty `results` array
- **THEN** the system shows an empty-state message instead of an empty grid

### Requirement: Search result cards

The system SHALL render each entry in the `results` array as a card showing the matched frame's thumbnail, the generated description, the occurrence timestamp formatted as `MM:SS`, and the confidence score. The confidence score SHALL be displayed as a percentage alongside a color-coded tier indicator, with color and label determined by the score:

| Score range | Tier | Color |
| --- | --- | --- |
| 85–100% | Excellent | Emerald green |
| 70–84% | Good | Amber |
| 50–69% | Low | Orange |
| 0–49% | Irrelevant | Neutral gray |

#### Scenario: Rendering a result card

- **WHEN** the system renders a result with `frame_base64: "/9j/4AAQ..."`, `description: "A person walking near the gate wearing a red shirt."`, `elapsed_ms: 14000`, and `confidence_score: 0.85`
- **THEN** the card displays an image whose `src` is `data:image/jpeg;base64,/9j/4AAQ...`, the description text, a timestamp of `00:14`, and the confidence score

#### Scenario: Thumbnail renders without a network request

- **WHEN** the system renders a result card's thumbnail
- **THEN** the `<img>` element's `src` is set directly from the result's `frame_base64` field as a `data:image/jpeg;base64,` URI, with no HTTP request made to fetch the image

#### Scenario: Frame extraction failed on the backend

- **WHEN** a result's `frame_base64` field is `null` (the backend failed to extract a frame from the source video)
- **THEN** the system renders a "Preview unavailable" placeholder in place of the thumbnail instead of a broken image

#### Scenario: Excellent confidence score

- **WHEN** a result's `confidence_score` is between `0.85` and `1.0` inclusive
- **THEN** the system displays the percentage with the "Excellent" tier's emerald-green color indicator

#### Scenario: Good confidence score

- **WHEN** a result's `confidence_score` is between `0.70` and `0.84`
- **THEN** the system displays the percentage with the "Good" tier's amber color indicator

#### Scenario: Low confidence score

- **WHEN** a result's `confidence_score` is between `0.50` and `0.69`
- **THEN** the system displays the percentage with the "Low" tier's orange color indicator

#### Scenario: Irrelevant confidence score

- **WHEN** a result's `confidence_score` is below `0.50`
- **THEN** the system displays the percentage with the "Irrelevant" tier's neutral gray color indicator, with no more visual emphasis than surrounding metadata text

#### Scenario: Confidence color is a supplementary signal, not the only one

- **WHEN** the system renders any result card's confidence score
- **THEN** the numeric percentage remains visible alongside the color indicator, so the tier is never conveyed by color alone

### Requirement: Jump-to-moment playback

The system SHALL open a centered playback overlay containing an HTML5 `<video controls autoplay>` element when a user selects a result card, streaming the video derived from that result's `video_path` and starting playback at that result's `elapsed_ms` offset.

#### Scenario: User selects a result card

- **WHEN** a user clicks/activates a result card whose `video_path` is `/app/videos/cam1_1783221727.mp4` and `elapsed_ms` is `14000`
- **THEN** the system opens a centered overlay containing a `<video controls autoplay>` element whose source resolves to the backend stream route for `cam1_1783221727.mp4` and whose playback starts at 14 seconds

#### Scenario: Filename is parsed from an absolute video path

- **WHEN** a result's `video_path` is an absolute backend path such as `/app/videos/cam1_1783221727.mp4`
- **THEN** the system extracts only the filename (`cam1_1783221727.mp4`) and uses it to build the stream URL, discarding the leading directory segments

#### Scenario: User closes the playback overlay

- **WHEN** a user dismisses the overlay (close control, backdrop click, or Escape key)
- **THEN** the system closes the overlay and stops the video element from playing

### Requirement: Authenticated video stream URLs via query parameter

The system SHALL append the current session's access token as a `token` query parameter on the search-result video stream URL, since it is loaded via a native `<video>` element that cannot send an `Authorization` header.

#### Scenario: Playback overlay loads a search-result video stream

- **WHEN** the system opens the playback overlay for a result whose parsed filename is `cam1_1783221727.mp4`
- **THEN** the `<video>` element's `src` includes `?token={access_token}` appended to the stream URL

#### Scenario: No active session

- **WHEN** a request for a search-result media URL is constructed while there is no valid stored session
- **THEN** the system does not render the media element with a tokenless URL; the surrounding route-level authentication guard applies instead
