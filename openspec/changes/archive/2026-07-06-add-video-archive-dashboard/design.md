## Context

The app currently has two authenticated-adjacent screens: `/` (login) and `/home` (a bare header + centered "all clear" status, no navigation). `src/lib/api/auth.ts` already establishes the session pattern: a `StoredSession { accessToken, tokenType }` in `localStorage`, with `getAuthHeader()` for `Authorization` headers on JSON requests. `DESIGN.md` and `PRODUCT.md` establish a dark, restrained, technical visual language (OKLCH tokens, IBM Plex Sans/Mono, flexbox-first layout, 150–250ms ease-out transitions) that this change must extend, not deviate from.

This change introduces the first real navigation surface (a sidebar) and the first content-heavy feature (a paginated, filterable, playable video gallery), plus a non-standard auth mechanism for media tags: the backend accepts the JWT as a `?token=` query parameter specifically so `<img>`/`<video>` elements — which cannot attach an `Authorization` header — can load media natively (streaming, Range requests, browser caching all keep working).

## Goals / Non-Goals

**Goals:**
- A retractable sidebar shell that hosts navigation and becomes the persistent frame for authenticated screens (starting with Home and Video Archive).
- A Video Archive gallery: optional date-range filter, thumbnail grid, "Load More" pagination driven by the API's `page`/`total_pages`.
- Click-to-play: a centered modal with a native `<video controls autoplay>` streaming the clip.
- Correct, centralized construction of token-bearing media URLs, isolated to one helper so the pattern isn't duplicated ad hoc.

**Non-Goals:**
- No video upload/delete/management — archive is read-only in this change.
- No infinite scroll — "Load More" only (see Decisions).
- No multi-level nested navigation — sidebar has a flat list of entries.
- No change to the JSON API auth mechanism (`Authorization` header via `getAuthHeader()`) — the query-param token is *only* for `<img src>`/`<video src>`.
- No backend changes — the query-param token contract is a given constraint, not something this change designs.

## Decisions

**Sidebar: collapsible panel with corner toggle, not an overlay drawer.**
A fixed-width (e.g. `16rem`) sidebar collapses to an icon-only rail (e.g. `4rem`), toggled by a button anchored in the sidebar's top corner. Collapse state lives in a small Svelte 5 rune-based store (`$state` in a `.svelte.ts` module) and is persisted to `localStorage` so the choice survives reloads. Alternative considered: an overlay drawer that slides over content — rejected because this is a desktop-first, low-frequency "check-in" tool (per `PRODUCT.md`) where a persistent rail reads calmer and more "console-like" than an overlay that must be reopened every visit.

**Gallery layout: CSS grid of thumbnail tiles, scoped exception to "no card grids."**
`DESIGN.md` says "no card grids" for dashboard summary tiles (avoiding generic SaaS stat-card templating). A media gallery is different: grids are the native, expected layout for image/video thumbnails and not a templated "feature card" pattern. Tiles are plain (thumbnail + filename/timestamp label, no icon+heading+text card chrome) to stay consistent with the anti-reference.

**Pagination: "Load More" button, not infinite scroll.**
Chosen because it keeps scroll position stable and predictable, needs no `IntersectionObserver` plumbing, and matches the "quick, low-friction check-in" usage pattern rather than continuous-scroll browsing. Uses the response's `page`/`total_pages` to know when to hide the button (`page >= total_pages`).

**Date filters: native `<input type="date">`.**
The native date input's value is already `YYYY-MM-DD`, which is exactly the format the API requires — no parsing/formatting library needed. Both fields are optional; omit a query param entirely when its input is empty rather than sending an empty string.

**Playback: centered modal, not a side drawer.**
The proposal allowed either; a centered modal is chosen for focus (surveillance clip review is the sole task while open) and reuses the same overlay/backdrop/focus-trap primitive the app already implies via its centered login card. `<video controls autoplay>` is used as specified; autoplay is initiated from a user click (the thumbnail), which browsers' autoplay-with-sound policies generally allow since it's a direct user gesture.

**Media auth: one `buildMediaUrl(url, session)` helper, used only for `<img>`/`<video>` src attributes.**
All other API calls (`GET /videos`) continue using `Authorization: <tokenType> <accessToken>` via the existing `getAuthHeader()`. Only the two media-serving endpoints get the token appended as a query parameter, and only at the point of constructing the `src` attribute — never stored or logged separately. This keeps the header-based pattern as the default and the query-param pattern as a narrowly-scoped, clearly-named exception.

## Risks / Trade-offs

- **[Risk] Tokens in media URLs can leak** via browser history, `Referer` headers (if the video/thumbnail page ever links out), proxy access logs, or shared-screen situations. → **Mitigation**: scope the query-param token to only the two media endpoints (never the JSON API); do not log these URLs client-side; document the constraint in the proposal so it's visible to whoever owns the backend token lifecycle (short-lived, scoped tokens would reduce blast radius, but that's a backend decision outside this change).
- **[Risk] Access token expiry mid-playback** — if a token expires while a video is loading/streaming, the browser will show a broken media element with no app-level error UI. → **Mitigation**: show a inline fallback message in the modal if the `<video>` fires an `error` event, prompting re-login; out of scope to implement token refresh in this change.
- **[Trade-off] "Load More" instead of infinite scroll** is a small UX cost (an extra click) for simplicity and predictability — acceptable given the low-frequency usage pattern in `PRODUCT.md`.
- **[Risk] Sidebar collapse state in localStorage** could get out of sync across tabs — low severity (visual-only preference, no functional impact); not mitigated further.

## Open Questions

- Should filenames/timestamps parsed from `video_name` (e.g. `cam1_1783291071.mp4`) be shown in the gallery for readability? Design assumes yes (parse the trailing unix timestamp for a human-readable label) but this isn't specified by the API contract — flagged for confirmation during implementation.

## Amendment: video stream host (resolved during implementation)

The original proposal's example used a separate host for the video stream (`http://localhost:8000/videos/{video_name}`) versus the JSON API/thumbnail host (`PUBLIC_API_URL`, `http://localhost:3000`). Verifying against the actual running backend (`pi-guard`) showed `GET /videos/{video_name}` is served from the **same** host/port as the rest of the API — port 8000 on the dev machine is occupied by an unrelated `chromadb` container. `videoStreamUrl()` now builds from `PUBLIC_API_URL` and the dedicated `PUBLIC_VIDEO_STREAM_URL` env var was removed. The list endpoint is also called at `/videos/` (trailing slash), matching the backend's OpenAPI schema and avoiding an extra 307 redirect hop.
