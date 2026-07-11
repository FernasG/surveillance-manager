## MODIFIED Requirements

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
