## Why

The backend has renamed the recorded-video playback route and added a new live camera stream endpoint. The frontend must follow the route rename to keep archive/search playback working, and should surface the new live feed on the Home screen so operators can see what a camera sees right now, not just recorded clips.

## What Changes

- **BREAKING**: Recorded-video playback requests move from `GET /videos/{video_name}` to `GET /videos/{video_name}/playback`. Update `videoStreamUrl` in `src/lib/api/videos.ts` and `searchResultStreamUrl` in `src/lib/api/search.ts` (both build on `buildMediaUrl`) to target the new path. Thumbnail URLs (`/videos/{video_name}/thumbnail`) and the video listing route (`GET /videos`) are unaffected.
- Add a live camera stream player to the Home screen (`src/routes/(authenticated)/home/+page.svelte`), replacing the current static placeholder, sourced from `GET /videos/live` with the session's access token appended as a `token` query parameter (same auth pattern used for recorded media).
- New `liveStreamUrl(session)` helper alongside the existing `videoStreamUrl`/`buildMediaUrl` helpers in `src/lib/api/videos.ts`.
- `GET /videos/live` is an MJPEG-over-HTTP stream (`multipart/x-mixed-replace`), confirmed against the running backend; the player renders it via `<img>`, not `<video>` (see design.md).
- Visual/interaction design for the new live player component follows the impeccable skill's review (loading, error/offline, and no-active-session states; consistent with the app's dark theme tokens and existing modal/player styling).

## Capabilities

### New Capabilities

- `live-camera-stream`: Home-screen live video feed from `GET /videos/live`, including loading, streaming, and error/offline states, authenticated via the `token` query parameter.

### Modified Capabilities

- `video-archive`: The "Video playback on thumbnail selection" and "Authenticated media URLs via query parameter" requirements reference the recorded-video stream route, which changes from `GET /videos/{video_name}` to `GET /videos/{video_name}/playback`.

## Impact

- `src/lib/api/videos.ts`: update `videoStreamUrl`, add `liveStreamUrl`.
- `src/lib/api/search.ts`: update `searchResultStreamUrl` (shares `buildMediaUrl`/route base with videos.ts).
- `src/routes/(authenticated)/home/+page.svelte`: replace placeholder with live stream player.
- New component (e.g. `src/lib/components/LiveStreamPlayer.svelte`), modeled on the existing `VideoPlaybackModal.svelte` pattern but inline (not a modal).
- No backend changes required; no changes to video listing, thumbnails, search results rendering, or the archive gallery beyond the stream URL path.
