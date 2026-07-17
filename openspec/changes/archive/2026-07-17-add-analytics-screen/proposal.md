## Why

Operators currently have no way to see aggregate activity trends across the surveillance system — how many events occurred, when activity peaks during the day, and what kinds of objects are being detected most often. This makes it hard to spot unusual patterns or justify camera placement decisions. The backend already exposes this data via `GET /metrics/overall`; the frontend needs a dedicated screen to surface it.

## What Changes

- Add an "Analytics" entry to the sidebar navigation, alongside Home, Video Archive, and Semantic Search.
- Add a new Analytics dashboard screen that calls `GET /metrics/overall` (using the same authenticated API client / token handling as other protected routes) and renders:
  - A KPI summary card showing `total_events_overall`.
  - An hourly trend chart (bar or line) plotting the `heatmap` array, with hour-of-day on the X-axis and event count on the Y-axis, to visualize peak activity periods.
  - An object distribution view (pie/doughnut chart or ranked horizontal list) showing detected-entity counts from `object_distribution`.
- Handle loading, empty, and error states for the metrics request consistently with other authenticated screens.

## Capabilities

### New Capabilities

- `analytics-dashboard`: An authenticated screen that fetches overall system metrics and presents them as a KPI summary, an hourly activity trend, and an object-distribution breakdown.

### Modified Capabilities

- `app-shell-navigation`: Sidebar navigation entries expand to include "Analytics", and users can navigate to/from it within the same shell like the existing Home, Video Archive, and Semantic Search entries.

## Impact

- **Frontend routes**: New route/screen for Analytics under the authenticated app shell.
- **Sidebar component**: Add a new nav entry (icon + label + route) and active-state handling for Analytics.
- **API layer**: New request to `GET /metrics/overall` using the existing authenticated fetch/API client pattern (same auth token header as other protected routes).
- **New UI components**: KPI/summary card, hourly trend chart, object-distribution chart or ranked list — built to match the existing dashboard visual style (per the project's `impeccable` design skill and `dataviz` charting conventions).
- **No backend changes** — this proposal only consumes an existing endpoint.
