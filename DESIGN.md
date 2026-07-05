# Design

## Register

product

## Mood

A security console at 2am: dim ambient dark, one steady pilot light glowing when everything's fine. Precise, technical, no decoration — the interface disappears into the task of "check status, move on."

## Color Strategy

Restrained (product default). A single near-black surface carries the app; the crimson primary is reserved for actions and the "attention" state, a teal accent for the "all clear / online" state. Neither color tints the background — the mood lives in the accents and type, not the surface.

## Palette (OKLCH)

```css
--bg: oklch(0.09 0 0); /* near-black, chroma 0 */
--surface: oklch(0.16 0 0); /* panels, cards, inputs */
--surface-hover: oklch(0.2 0 0);
--border: oklch(0.28 0 0);
--ink: oklch(0.95 0.003 17.6); /* body text, ~7:1+ on bg */
--muted: oklch(0.62 0.01 17.6); /* secondary text, ~3.5:1+ on bg */
--primary: oklch(0.5 0.19 18); /* crimson — actions, "attention" state */
--primary-hover: oklch(0.54 0.19 18);
--accent: oklch(0.62 0.14 165); /* teal — "online / all clear" state */
--danger: var(--primary);
--success: var(--accent);
```

Text on `--primary` and `--accent` fills is always near-white (`--ink`) — both sit in the saturated mid-luminance band (Helmholtz-Kohlrausch), so dark text would read muddy.

## Typography

Single family for UI text (product default): **IBM Plex Sans** for headings, labels, body. **IBM Plex Mono** for technical/data values only (timestamps, camera IDs, tokens) — a deliberate pairing, not decoration, and a deliberate move away from the Inter/system-sans SaaS default.

- Fixed rem scale (not fluid/clamp) — this is a product surface, viewed at consistent DPI.
- Scale ratio ~1.15: `0.8125rem / 0.875rem / 1rem / 1.125rem / 1.375rem / 1.75rem / 2.25rem`.
- Body line length capped at 65–75ch where prose appears.

## Layout

- Flexbox-first; no card grids. The login screen is a single centered form, not a card grid.
- Structural responsiveness (stack on narrow viewports), not fluid type.

## Motion

- 150–250ms transitions on interactive state changes only (hover, focus, loading, error reveal).
- `ease-out` curves, no bounce/elastic.
- Every animation has a `prefers-reduced-motion: reduce` fallback (instant/crossfade).

## Components

- Inputs, buttons: default / hover / focus / active / disabled / loading / error states defined once and reused.
- Status is communicated with the accent/primary dot + label pairing (e.g. a small solid dot + text), not badges with gradients or icons alone.
