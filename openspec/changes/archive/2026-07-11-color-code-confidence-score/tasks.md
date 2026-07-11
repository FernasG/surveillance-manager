## 1. Confidence tier mapping

- [x] 1.1 Add a `confidenceTier(score: number)` helper to `src/lib/api/search.ts` returning `'excellent' | 'good' | 'low' | 'irrelevant'` for the boundaries `>=0.85`, `>=0.70`, `>=0.50`, else below

## 2. Visual design

- [x] 2.1 Use the impeccable skill to design the four-tier color indicator (exact OKLCH values for the two new tokens, dot + text treatment, contrast-checked against `--surface`), reusing `--accent` for "Excellent" and `--muted` for "Irrelevant" per design.md — computed `--color-confidence-good: oklch(0.68 0.14 85)` (6.66:1) and `--color-confidence-low: oklch(0.68 0.15 50)` (6.40:1) against `--surface`
- [x] 2.2 Add the two new color tokens (amber "Good", orange "Low") to `src/routes/layout.css`'s `@theme` block, matching the existing tokens' lightness/chroma band

## 3. Result card integration

- [x] 3.1 Update the confidence score rendering in `src/routes/(authenticated)/search/+page.svelte` to show a colored dot + colored percentage text per tier, replacing the current plain `text-muted` span
- [x] 3.2 Verify the timestamp/confidence footer row layout still holds at all grid breakpoints (`sm`/`lg`/`xl` columns) with no overflow or misalignment — screenshotted at 390px (1 col), 700px (2 col), 1100px (3 col), 1500px (4 col); no wrapping or overflow at any width

## 4. Verification

- [x] 4.1 Manually verify all four tiers render with correct colors against real or representative search results (spanning 0–49%, 50–69%, 70–84%, 85–100%) — verified in-browser via intercepted results covering all 4 tiers plus the 85%/50% tier boundaries; computed colors matched the expected token exactly for each case
- [x] 4.2 Confirm each tier's text/dot color meets WCAG AA contrast (≥4.5:1) against the card background — computed: excellent/accent 5.77:1, good/confidence-good 6.66:1, low/confidence-low 6.40:1, irrelevant/muted 5.30:1, all against `--surface`
- [x] 4.3 Run typecheck/lint (`npm run check`, `npm run lint`) and fix any issues — 0 typecheck errors; both touched files pass Prettier (pre-existing formatting debt in `search.ts` predates this change, unrelated line)
