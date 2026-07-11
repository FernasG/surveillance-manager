## Context

Search result cards (`src/routes/(authenticated)/search/+page.svelte`) already render `confidenceScore` (a 0–1 float from `POST /query`) as `{Math.round(result.confidenceScore * 100)}%` in a `font-mono text-xs text-muted` span, in a flex row next to the timestamp. The app's design system (`DESIGN.md`) is deliberately Restrained: near-black surfaces, a single crimson `--primary` for actions/attention, a single teal `--accent` for "online/all clear," and status communicated via a small solid dot + text label pairing rather than badges or gradients. Introducing four confidence tiers means introducing color range the current restrained palette doesn't have — a bounded exception the product register explicitly allows for state-rich semantic vocabulary (hover/focus/error/success/etc.), not a general loosening of the palette.

## Goals / Non-Goals

**Goals:**
- Map `confidenceScore` to one of four named tiers (Excellent/Good/Low/Irrelevant) using the thresholds given: ≥0.85, ≥0.70, ≥0.50, else below.
- Reuse the existing dot + label status vocabulary (already used for "All systems normal" and the live "LIVE" badge) instead of inventing a new pill/badge component.
- Keep the numeric percentage visible — color is a reinforcing signal, not the sole one (WCAG "use of color" + colorblind users).
- Verify text/dot contrast against the card background meets WCAG AA for the given text size.

**Non-Goals:**
- No change to card layout, thumbnails, descriptions, playback, or the query flow.
- No new component/badge system beyond this one score indicator.
- No backend changes — `confidence_score` is already returned.

## Decisions

1. **Reuse existing tokens where semantically apt; add only what's missing.** "Excellent" reuses the existing `--accent` teal (already the app's "positive/all-clear" signal — a 165° hue is squarely emerald/teal-green, matching the requested "Emerald Green" tier without adding a near-duplicate color). "Irrelevant" reuses the existing `--muted` gray (already the app's de-emphasized-metadata color, matching "neutral gray" and naturally receding for low-value results). Two new tokens are added for "Good" (amber) and "Low" (orange), since the palette has no existing amber/orange. This keeps the addition to 2 new colors instead of 4. *Alternative considered*: four entirely new tier-specific tokens — rejected, unnecessarily duplicates colors the palette already has for the same semantic meaning (good/positive, low-value/neutral).

2. **Exact OKLCH values and contrast verification happen via the impeccable skill during implementation**, matching the existing tokens' lightness/chroma band (`--accent` is `oklch(0.62 0.14 165)`) so the two new colors read as siblings, not a different design system. Every tier's text/dot color must be checked against `--surface` (the card background) for ≥4.5:1 contrast (the score text is `text-xs`, i.e. small text, so the higher AA threshold applies), not just against `--bg`.

3. **Visual treatment: colored dot + colored percentage text, replacing the current plain `text-muted` span — not a filled badge/pill.** This matches the app's established "dot + label" status pattern (Home's "All systems normal," the live feed's "LIVE" indicator) instead of introducing a new heavier badge vocabulary, and keeps the footer visually light per the request to not overwhelm the card. *Alternative considered*: a filled colored pill/chip around the percentage — rejected as heavier than the rest of the UI's status indicators and more likely to visually dominate the card footer, which the request explicitly warned against.

4. **Tier mapping colocated with the existing search API types**, e.g. a `confidenceTier(score: number)` helper in `src/lib/api/search.ts` next to `SearchResult`, returning a tier id (`'excellent' | 'good' | 'low' | 'irrelevant'`) that the page maps to a token/label. Keeps the boundary logic in one testable place rather than inline in the template.

## Risks / Trade-offs

- [Risk] Adding amber/orange slightly loosens the Restrained palette → Mitigation: scoped to exactly one UI element (the confidence indicator), reusing existing tokens for 2 of the 4 tiers; not a general palette expansion.
- [Risk] Four-color-coded scores across a dense grid could read as visually noisy → Mitigation: dot + text treatment (not filled backgrounds), same visual weight as the existing timestamp text, verified via the impeccable skill's review before shipping.
- [Risk] Small mono text at low contrast is a common accessibility miss → Mitigation: explicit contrast check (≥4.5:1 against `--surface`) is a stated decision, not left to visual judgment alone.

## Migration Plan

Frontend-only, no data migration. Ships as a single deploy. Rollback is a plain revert; no persisted state involved.
