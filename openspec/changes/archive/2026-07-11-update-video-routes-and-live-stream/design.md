## Context

The frontend already isolates recorded-video URL construction behind `buildMediaUrl`/`videoStreamUrl` in `src/lib/api/videos.ts` (and a duplicate `searchResultStreamUrl` in `src/lib/api/search.ts`), all appending the session's access token as a `?token=` query param since native `<img>`/`<video>` elements can't send an `Authorization` header. The Home screen (`src/routes/(authenticated)/home/+page.svelte`) is currently a static placeholder with no real content. The backend now exposes `GET /videos/{video_name}/playback` (renamed) and `GET /videos/live` (new), both authenticated the same way.

## Goals / Non-Goals

**Goals:**
- Update every call site building a recorded-video stream URL to the new `/playback` path, with the change centralized in the existing helper functions.
- Add a `liveStreamUrl(session)` helper reusing the existing token-append pattern.
- Replace the Home placeholder with a live camera player, including loading, live, and error/offline states, styled to match the app's existing dark theme tokens.

**Non-Goals:**
- No backend changes.
- No multi-camera selection UI — `GET /videos/live` takes no camera identifier, so this is a single default feed.
- No changes to archive or search result rendering beyond the stream URL path.
- No automatic reconnect/backoff loop for the live feed — manual retry only.

## Decisions

1. **Centralize the route rename in existing helpers.** Change `videoStreamUrl` (`src/lib/api/videos.ts`) and `searchResultStreamUrl` (`src/lib/api/search.ts`) to build `.../videos/{video_name}/playback`. Both already funnel through `buildMediaUrl` for token handling, so this is a one-line change per call site with no new abstraction needed. *Alternative considered*: inline the URL in each `+page.svelte` — rejected, would duplicate the route path and break the existing single-source-of-truth pattern.

2. **`liveStreamUrl(session)` reuses `buildMediaUrl`.** Add `export function liveStreamUrl(session: StoredSession) { return buildMediaUrl(`${PUBLIC_API_URL}/videos/live`, session); }` next to `videoStreamUrl` — identical token-query-param auth, per the proposal's requirement that live auth "work exactly like the other routes."

3. **Player markup: native `<img>`, not `<video>`.** Confirmed by probing the running backend that `GET /videos/live` responds with `Content-Type: multipart/x-mixed-replace; boundary=frame` (MJPEG-over-HTTP) — a format only `<img>` renders; `<video>` cannot play `multipart/x-mixed-replace` in any current browser. The player is therefore `<img src={liveStreamUrl(session)} alt="Live camera feed">`, with a small custom "LIVE" badge overlay instead of native video controls (irrelevant for `<img>` and meaningless for a feed with no timeline). *Alternative considered*: `<video autoplay muted playsinline>` — this was the original plan but is not viable for this content type; ruled out by direct testing, not by preference. *Alternative considered*: reuse `VideoPlaybackModal.svelte` as-is — rejected regardless of element choice, since that component is a dismissible overlay for a single archived clip (filename header, close button), while the live feed is inline, persistent Home content.

4. **New `LiveStreamPlayer.svelte` component, inline on Home (not a modal).** Mounts on Home, reads `getStoredSession()` once, renders the `<video>` element sourced from `liveStreamUrl(session)`. Route-level `(authenticated)` layout guard already ensures a session exists before Home renders, matching the pattern used by `archive`/`search` pages.

5. **Error handling: explicit error state with manual "Retry," no silent auto-retry loop.** `onerror` on the `<img>` element flips to an inline "feed unavailable" state with a retry action that remounts the element (`{#key}` block on a retry counter, forcing a fresh request). `<img>` has no `stalled` event equivalent to `<video>`, so a hung-but-open connection isn't independently detected — acceptable since automatic reconnection is a non-goal. A silent auto-retry loop would mask a camera being down; matches the existing `hasError` pattern in `VideoPlaybackModal.svelte`, extended with a retry control since this view has no "close" escape hatch.

6. **Visual design via the impeccable skill, using existing theme tokens only.** Loading, live, and error states for `LiveStreamPlayer` are built from the app's existing `bg`/`surface`/`border`/`ink`/`muted`/`accent`/`primary` CSS tokens (`src/routes/layout.css`) — no new colors or design tokens introduced, kept consistent with `VideoPlaybackModal` and the rest of the dark-only theme.

7. **8-second connect timeout, added after manual testing against the real backend.** While verifying this change against the running `pi-guard` backend, the USB camera occasionally failed to open server-side (`guard.infrastructure.drivers.usb_camera_driver: Error opening the camera`), and the backend responded `200` with correct MJPEG headers but then never sent frame data — a hung-open connection, not an HTTP error. `<img>` has no `stalled` event, so `onerror` alone never fires for this case, leaving the user stuck on "Connecting to camera…" indefinitely with no way to reach Retry. A `setTimeout` in the component (`CONNECT_TIMEOUT_MS = 8000`) now falls back to the error state if still loading after 8s, restarted on each retry via a `$effect` keyed on the retry counter.

## Risks / Trade-offs

- [Risk] No reconnect/backoff logic means a transient network blip leaves the feed stalled until the user notices → Mitigation: manual retry button covers the common case (reachable within 8s via the connect timeout, see Decision 7); automatic reconnection is explicitly out of scope for this change.
- [Risk] Access token appears in the stream URL query string (same as existing thumbnail/playback URLs) → Mitigation: consistent with the app's established auth pattern for media elements; not introduced by this change.
- [Risk] MJPEG-over-HTTP (`multipart/x-mixed-replace`) has no bitrate/resolution negotiation and holds one open connection per viewer → Mitigation: acceptable for a single-viewer, single-camera Home feed; out of scope to change the backend's streaming format for this change.

## Migration Plan

Frontend-only change, no data migration. Both changes ship together in one deploy. The route rename is breaking, but the backend already serves `/playback` (per the request), so no sequencing risk. Rollback is a plain revert; no persisted state involved.

## Open Questions

None — resolved during implementation: `GET /videos/live` was confirmed (by probing the running backend) to return `multipart/x-mixed-replace; boundary=frame`, so the player uses `<img>`, not `<video>` (see Decision 3).
