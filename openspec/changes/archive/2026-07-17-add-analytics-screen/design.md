## Context

The app is a SvelteKit 2 / Svelte 5 project (Tailwind v4, no component library, dark-only theme). All authenticated screens live under `src/routes/(authenticated)/`, wrapped by a shared layout that renders `Sidebar.svelte` and guards access via `hasValidSession()`. There is no shared fetch wrapper: each `src/lib/api/<domain>.ts` module independently calls `getAuthHeader()` from `src/lib/api/auth.ts` and attaches `Authorization: <tokenType> <accessToken>` to requests, returning a `{ ok: true; data } | { ok: false; reason: 'server_error' }` union (see `src/lib/api/search.ts`). There is no charting library in `package.json`, and no dedicated KPI/stat-card component yet — dashboard-style surfaces are hand-rolled Tailwind (`rounded border border-border bg-surface`, `text-ink`/`text-muted` text).

## Goals / Non-Goals

**Goals:**

- Add an "Analytics" sidebar entry and an authenticated `/analytics` screen, following the exact structural, auth, and styling conventions already used by Home/Video Archive/Semantic Search.
- Fetch `GET /metrics/overall` with the standard `Authorization` header and render summary, hourly trend, and object-distribution data.
- Keep the visual design consistent with the existing dark, oklch-token-based theme (per the `impeccable` and `dataviz` conventions), without introducing a new design language.

**Non-Goals:**

- No backend changes; `GET /metrics/overall` is assumed to already exist and match the given response shape.
- No new global state management, caching layer, or polling/real-time updates — a single fetch on page load is sufficient for v1.
- No date-range filtering, drill-down, or export — this is a first read-only overview screen.

## Decisions

- **No new charting dependency.** The codebase has zero charting libraries and no component library; every visual (icons, status pills) is hand-rolled inline SVG/Tailwind. Adding `layerchart`/`d3`/`chart.js` for two small, well-defined charts (a ~24-bar hourly histogram and a short ranked distribution) is disproportionate. Build both as lightweight custom Svelte components using SVG/CSS (a bar chart via scaled `<rect>`s or flex bars, and the object distribution as a ranked horizontal bar list). This matches the project's existing "no external UI/vis dependency" pattern and keeps bundle size and review surface small. If future analytics screens need line/area charts with axes, tooltips, and zoom, revisit introducing `layerchart` then.
- **New `src/lib/api/analytics.ts` module**, following the exact pattern in `search.ts`/`videos.ts`: co-located types (`OverallMetrics`, `HeatmapPoint`, `ObjectDistributionEntry`), a `getOverallMetrics()` function using `getAuthHeader()` and the `{ ok, data } | { ok: false, reason }` union, snake_case→camelCase field mapping done in this module (not in the component), matching how `search.ts` maps `video_path` → `videoName`.
- **Route**: `src/routes/(authenticated)/analytics/+page.svelte`, no `+page.ts` — data is fetched client-side in the component's `<script>` on mount, same as `archive`/`search` pages, so it inherits the existing session-guard behavior from `(authenticated)/+layout.ts` for free.
- **Sidebar**: extend `navItems` in `Sidebar.svelte` with `{ label: 'Analytics', path: '/analytics', icon: 'analytics' }`, extend the `isActive` path union, and add one more `{:else if item.icon === 'analytics'}` SVG branch (a simple bar-chart glyph) alongside the existing `home`/`archive`/`search` branches — no structural change to the sidebar component itself.
- **KPI card**: a small reusable `StatCard.svelte` (label, value, icon) using the existing `rounded border border-border bg-surface` container convention, since this is the first of what will likely become more KPI cards.

## Risks / Trade-offs

- [Hand-rolled SVG charts are less feature-rich than a library (no built-in tooltips/animation)] → Acceptable for a v1 overview; interactions can be added incrementally without a rewrite since the chart components are isolated.
- [`GET /metrics/overall` shape is asserted from the proposal's example, not a live contract] → `analytics.ts` validates/coerces the response defensively (same `.catch(() => null)` + type-checks pattern as other API modules) and returns `reason: 'server_error'` on any mismatch, so a shape drift fails safely into the existing error state rather than crashing the page.
- [Empty `heatmap`/`object_distribution` arrays] → Both chart components render an explicit empty state rather than an empty/broken chart.

## Open Questions

- None blocking — endpoint shape and auth pattern are already established by the proposal and existing codebase conventions.
