## Why

Semantic Search results currently show the raw confidence score as plain muted text (e.g. "85%"), giving it no more visual weight than the timestamp next to it. Users have to read and mentally bucket each number to judge whether a result is worth opening, which slows down scanning a results grid. Color-coding the score into named confidence tiers lets a user triage results at a glance.

## What Changes

- Search result cards color-code the confidence score badge into four tiers instead of rendering it as plain muted text:
  - 85–100%: Excellent — emerald green
  - 70–84%: Good — amber/yellow
  - 50–69%: Low — orange
  - 0–49%: Irrelevant — neutral gray
- The numeric percentage remains visible alongside the color (color is a reinforcing signal, not the only one, for accessibility/colorblind users).
- Visual integration (exact colors, contrast, badge treatment) is designed via the impeccable skill against the existing dark, restrained design system — this is the only capability affected; no new screens, routes, or API calls.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `semantic-search`: the "Search result cards" requirement changes — the confidence score must be rendered with a color/tier treatment based on the four thresholds above, in addition to the existing numeric percentage.

## Impact

- `src/routes/(authenticated)/search/+page.svelte`: confidence score rendering in the result card footer.
- Possibly a small new helper (e.g. a `confidenceTier(score)` function) colocated with the search page or in `src/lib/api/search.ts`.
- No backend/API changes — `confidence_score` is already returned by `POST /query`.
- No changes to result card layout structure, thumbnails, descriptions, or playback behavior.
