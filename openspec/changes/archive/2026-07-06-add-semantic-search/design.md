## Context

The app already has one authenticated media flow to build on: Video Archive (`src/routes/(authenticated)/archive/+page.svelte`, `src/lib/api/videos.ts`, `VideoPlaybackModal.svelte`). It establishes two conventions this change reuses:

- Native `<img>`/`<video>` elements can't send an `Authorization` header, so authenticated media URLs append the session's access token as a `?token=` query parameter (`buildMediaUrl` in `src/lib/api/videos.ts`).
- Playback happens in a centered modal overlay (`VideoPlaybackModal.svelte`) triggered by selecting a thumbnail.

Semantic Search introduces a new backend endpoint (`POST /query`, JSON body, `Authorization: Bearer` header — not a query param, since it's a normal fetch) and a new response shape that mixes inline data (`frame_base64`, `description`, `confidence_score`) with a reference to a video file that must be derived into a playable stream URL, plus a mid-clip start offset (`elapsed_ms`) that the existing playback modal doesn't support (Video Archive always starts at 0).

## Goals / Non-Goals

**Goals:**
- Let a user type a natural-language query and see matching moments as result cards (thumbnail, description, timestamp, confidence).
- Selecting a card opens playback that starts at the exact matched moment.
- Reuse existing auth, theming, and modal conventions rather than inventing new ones.

**Non-Goals:**
- No query history, saved searches, or result pagination in this pass (backend returns a single results array, no pagination metadata in the contract).
- No client-side confidence filtering/sorting UI — results render in the order the API returns them.
- No thumbnail caching/optimization beyond rendering the provided base64 inline.

## Decisions

**New `search.ts` API module, mirroring `videos.ts`.** `postQuery(text)` sends `POST {PUBLIC_API_URL}/query` with `Authorization` header via `getAuthHeader()` (same helper Video Archive uses) and a JSON body `{ text }`. Returns a discriminated `{ ok: true; data } | { ok: false; reason }` result, matching `ListVideosResult`'s shape for consistency.

**Filename parsing lives in the API layer, not the component.** `video_path` (e.g. `/app/videos/cam1_1783221727.mp4`) is split on `/` and the last segment taken, exposed as a `videoName` field on the parsed result alongside the raw fields. Keeping this in `search.ts` (next to where the response is parsed) matches how `videos.ts` already owns URL-building (`videoStreamUrl`, `buildMediaUrl`) rather than pushing path logic into `.svelte` files.

**Thumbnails render directly from `frame_base64`.** No network request, no object URL: `src="data:image/jpeg;base64,{frame_base64}"` directly in the `<img>` tag, per the API contract. No new API surface needed for this.

**Playback overlay is a new `SearchResultPlaybackModal.svelte`, not a reuse of `VideoPlaybackModal`.** `VideoPlaybackModal` has no concept of a start offset and its prop shape (`videoName`, `src`, `onClose`) doesn't carry `elapsed_ms`. Rather than overload the existing component with an optional start-time prop it doesn't need for its current caller, add a sibling component that copies its structure (backdrop, Escape-to-close, error state) and adds the seek behavior. This keeps `VideoPlaybackModal` unchanged and avoids coupling Video Archive's playback to Semantic Search's needs.
  - Seeking: append `#t={elapsed_seconds}` as a URL fragment on the stream `src` (works across browsers for native `<video>` without needing JS timing hacks around `loadedmetadata`), where `elapsed_seconds = elapsed_ms / 1000`.

**Timestamp formatting (`MM:SS`) is a small pure function in the component/module**, not a shared util (only one call site today).

**Sidebar entry**: add a third `navItems` entry (`Semantic Search`, path `/search`) in `Sidebar.svelte`, following the existing `home`/`archive` icon pattern — a new inline SVG icon (magnifying glass) alongside the existing two.

**Route**: `src/routes/(authenticated)/search/+page.svelte`, alongside the existing `archive` route, so it inherits the authenticated layout guard for free.

## Risks / Trade-offs

- **Token in query string for video streaming** → Same trade-off already accepted for Video Archive (native `<video>` can't set headers); no new exposure introduced by this change.
- **Large inline base64 thumbnails** → Result grids with many matches could mean a heavy initial payload (no separate thumbnail fetch/caching). Mitigation: none needed yet since the API contract has no pagination; revisit if result counts grow large in practice.
- **URL fragment seeking (`#t=`) is not guaranteed by spec, only by convention** → Acceptable given it's the same mechanism named in the proposal's tech constraints; fallback is setting `.currentTime` on `loadedmetadata` if a target browser doesn't honor the fragment (not implemented now — treat as a follow-up if observed).
- **No results / query failure states** → Handled explicitly as empty-state and inline-error states, matching Video Archive's existing pattern, so the section doesn't silently show a blank screen.
