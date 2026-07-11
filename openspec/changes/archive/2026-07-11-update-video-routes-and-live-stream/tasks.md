## 1. Recorded-video playback route rename

- [x] 1.1 Update `videoStreamUrl` in `src/lib/api/videos.ts` to build `${PUBLIC_API_URL}/videos/${videoName}/playback`
- [x] 1.2 Update `searchResultStreamUrl` in `src/lib/api/search.ts` to build `${PUBLIC_API_URL}/videos/${videoName}/playback`
- [x] 1.3 Manually verify archive playback (`src/routes/(authenticated)/archive/+page.svelte`) still opens and plays a recorded video via `VideoPlaybackModal` — confirmed against the running backend: `206 Partial Content` from `.../playback`, video plays
- [x] 1.4 Manually verify search result playback (`src/routes/(authenticated)/search/+page.svelte`) still opens and plays a recorded video via `SearchResultPlaybackModal` — confirmed: query returns results, playback opens at the renamed `.../playback` route, seeked to the match's timestamp

## 2. Live stream API helper

- [x] 2.1 Add `liveStreamUrl(session: StoredSession)` to `src/lib/api/videos.ts`, building `${PUBLIC_API_URL}/videos/live` through the existing `buildMediaUrl` helper

## 3. Live stream player component

- [x] 3.1 Use the impeccable skill to design the `LiveStreamPlayer` component's visual states (loading, live/playing with a "LIVE" indicator, error/offline with retry) using the existing theme tokens in `src/routes/layout.css`
- [x] 3.2 Create `src/lib/components/LiveStreamPlayer.svelte`: reads the stored session, renders an `<img>` sourced from `liveStreamUrl(session)` (backend confirmed to serve MJPEG via `multipart/x-mixed-replace`, not a `<video>`-playable container)
- [x] 3.3 Implement the loading state (shown before the stream starts playing)
- [x] 3.4 Implement the error/offline state on `onerror`, with a "Retry" control that remounts/reloads the image element
- [x] 3.4a Add an 8s connect timeout that falls back to the error state — discovered during manual testing that a backend-side camera failure can return `200` with correct MJPEG headers but never send frame data, which `onerror` alone can't detect (no `stalled` event on `<img>`)
- [x] 3.5 Handle the no-session case by not rendering a tokenless player (defers to the route-level `(authenticated)` guard)

## 4. Home screen integration

- [x] 4.1 Replace the static placeholder in `src/routes/(authenticated)/home/+page.svelte` with `LiveStreamPlayer`
- [x] 4.2 Manually verify Home shows the live feed for an authenticated session, and shows the error/retry state when the stream is unavailable — confirmed both against the real backend (including an actual intermittent USB camera failure) and deterministically via request interception (loading → 8s timeout → error → Retry → live)

## 5. Verification

- [x] 5.1 Run typecheck/lint (`npm run check`, `npm run lint` or equivalent) and fix any issues
- [x] 5.2 Confirm no remaining references to the old `/videos/{video_name}` (without `/playback`) route in `src/`
