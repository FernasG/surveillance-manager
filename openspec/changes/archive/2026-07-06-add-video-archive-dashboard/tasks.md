## 1. Video API client

- [x] 1.1 Create `src/lib/api/videos.ts` with a `Video` type (`video_name`, `thumbnail_url`), a `VideosPage` type (`videos`, `page`, `size`, `total_items`, `total_pages`), and a `listVideos({ page, size, startDate, endDate })` function that calls `GET /videos` with `Authorization` header via `getAuthHeader()`, omitting `start_date`/`end_date` params when not provided.
- [x] 1.2 Add a `buildMediaUrl(url: string, session: StoredSession): string` helper in the same file that appends `?token={accessToken}` (handling URLs that may already have query params).
- [x] 1.3 Add a `videoStreamUrl(videoName: string, session: StoredSession): string` helper that builds the `GET /videos/{video_name}` stream URL (base URL configurable, matching the `http://localhost:8000` host used for media vs. the `PUBLIC_API_URL` used for JSON endpoints).

## 2. Sidebar shell

- [x] 2.1 Create a small collapse-state store (`src/lib/stores/sidebar.svelte.ts`) using a Svelte 5 rune, reading/writing a `localStorage` key, defaulting to expanded.
- [x] 2.2 Create `src/lib/components/Sidebar.svelte`: fixed-width expanded state, icon-only collapsed state, a corner toggle button, and a flat list of nav entries (Home, Video Archive) with an active-entry indicator, styled per `DESIGN.md` tokens (dark surface, border, restrained accent/primary use).
- [x] 2.3 Update `src/routes/+layout.svelte` (or introduce an authenticated layout) to render `Sidebar.svelte` alongside `{@render children()}` for authenticated routes, preserving the existing sign-out control.
- [x] 2.4 Add `prefers-reduced-motion` fallback and 150–250ms ease-out transition for the expand/collapse animation.

## 3. Video Archive gallery

- [x] 3.1 Create `src/routes/home/archive/+page.svelte` (or equivalent route reachable via the sidebar's "Video Archive" entry) guarded by the same session check pattern used on `/home`.
- [x] 3.2 Add date filter controls (two `<input type="date">` fields, optional) above the gallery; on apply, reset to page 1 and refetch with `listVideos`.
- [x] 3.3 Render the thumbnail grid: each tile's `<img>` `src` built via `buildMediaUrl(video.thumbnail_url, session)`, plus a human-readable label derived from `video_name`.
- [x] 3.4 Implement loading, empty (`total_items === 0`), and error states for the gallery fetch.
- [x] 3.5 Implement the "Load More" control using `page`/`total_pages` from the last response, appending results and preserving active date filters; hide the control when `page >= total_pages`.

## 4. Playback modal

- [x] 4.1 Create `src/lib/components/VideoPlaybackModal.svelte`: centered overlay + backdrop, closes on backdrop click, close-button click, or Escape key, and pauses/unloads the `<video>` element on close.
- [x] 4.2 Wire thumbnail click in the gallery to open the modal with `<video controls autoplay src={videoStreamUrl(...)}>`.
- [x] 4.3 Handle the `<video>` element's `error` event with an inline fallback message (e.g. session expired / stream unavailable) inside the modal.

## 5. Update app-home spec compliance

- [x] 5.1 Update `src/routes/home/+page.svelte` to render within the new sidebar shell instead of its standalone centered layout, keeping the existing "all systems normal" status content.
- [x] 5.2 Confirm the unauthenticated-redirect behavior for `/home` (and the new archive route) is unchanged.

## 6. Verification

- [x] 6.1 Run the Svelte MCP `svelte-autofixer` tool against all new/modified `.svelte` files and resolve any reported issues.
- [x] 6.2 Manually verify: sidebar collapse/expand + persistence, date filter round-trip (network tab shows `YYYY-MM-DD` params), Load More pagination, thumbnail click → playback modal → close, and that thumbnail/video URLs carry `?token=`.
- [x] 6.3 Run `npm run check` (or project's type-check/lint script) and fix any errors.
