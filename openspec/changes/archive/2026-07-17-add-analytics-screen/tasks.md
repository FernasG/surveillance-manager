## 1. API layer

- [x] 1.1 Create `src/lib/api/analytics.ts` with co-located types (`OverallMetrics`, `HeatmapPoint`, `ObjectDistributionEntry`) and a `getOverallMetrics()` function that calls `GET ${PUBLIC_API_URL}/metrics/overall` with the `Authorization` header from `getAuthHeader()`, following the `{ ok: true; data } | { ok: false; reason: 'server_error' }` union pattern used in `src/lib/api/search.ts`
- [x] 1.2 Map the raw response (`summary.total_events_overall`, `heatmap[].hour`/`count`, `object_distribution[].entity`/`count`) into camelCase types in `analytics.ts`, with defensive validation that returns `{ ok: false, reason: 'server_error' }` on an unexpected shape

## 2. Shared UI components

- [x] 2.1 Build `src/lib/components/StatCard.svelte` (label, value, icon slot) using the existing `rounded border border-border bg-surface` card convention
- [x] 2.2 Build `src/lib/components/analytics/HourlyTrendChart.svelte`: a hand-rolled SVG/CSS bar (or line) chart rendering `HeatmapPoint[]`, hour-of-day on the X-axis (formatted as `HH:00`) and count on the Y-axis, with an explicit empty state when the array is empty
- [x] 2.3 Build `src/lib/components/analytics/ObjectDistribution.svelte`: a ranked horizontal bar list (or donut) rendering `ObjectDistributionEntry[]` sorted by count descending, with an explicit empty state when the array is empty

## 3. Analytics route

- [x] 3.1 Create `src/routes/(authenticated)/analytics/+page.svelte` that calls `getOverallMetrics()` on mount, tracks loading/error/data state, and renders `StatCard`, `HourlyTrendChart`, and `ObjectDistribution` from the result
- [x] 3.2 Add loading and error UI states to the Analytics page consistent with existing authenticated pages (e.g. `archive`/`search`)

## 4. Sidebar navigation

- [x] 4.1 Add `{ label: 'Analytics', path: '/analytics', icon: 'analytics' }` to `navItems` in `src/lib/components/Sidebar.svelte` and extend the `isActive` path union type to include `/analytics`
- [x] 4.2 Add an `{:else if item.icon === 'analytics'}` SVG branch (bar-chart glyph) to the icon block in `Sidebar.svelte`, matching the existing `home`/`archive`/`search` icon styling

## 5. Polish and verification

- [x] 5.1 Run the Impeccable design pass on the Analytics screen (visual hierarchy, spacing, color use against the existing oklch theme tokens, responsive behavior)
- [x] 5.2 Verify `svelte-check`/`npm run check` and `npm run lint` pass
- [x] 5.3 Manually verify the golden path (Analytics loads real metrics) and edge cases (empty heatmap, empty object distribution, request failure, unauthenticated redirect) in the running app
