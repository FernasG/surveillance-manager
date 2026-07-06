## Why

The home screen currently only shows a live "all systems normal" status with no way to review past recordings. Users who notice something worth checking (a delivery, a visitor, an alert) need a way to browse and play back recorded clips without leaving the app. This adds a Video Archive so users can filter by date and play back any recorded clip on demand.

## What Changes

- Add a retractable left sidebar to the authenticated app shell, replacing the current bare header-only layout on `/home`.
- Add a "Video Archive" navigation entry in the sidebar that reveals a gallery of recorded videos.
- Add optional `start_date` / `end_date` filters above the gallery, submitted to the API in `YYYY-MM-DD` format.
- Add paginated fetching of `GET /videos` with a "Load More" control that appends older videos using the response's pagination metadata (`page`, `total_pages`).
- Add a video playback modal/drawer: clicking a thumbnail opens a centered overlay with an HTML5 `<video controls autoplay>` element streaming from `GET /videos/{video_name}`.
- Add authenticated media URL construction: thumbnail and video URLs get the stored access token appended as a `?token=` query parameter, since the backend accepts JWT auth via query string for `<img>`/`<video>` tags (which cannot send `Authorization` headers).

## Capabilities

### New Capabilities

- `video-archive`: Browsing, date-filtering, paginating, and playing back recorded surveillance videos.
- `app-shell-navigation`: The retractable sidebar navigation shell that hosts the Video Archive (and future sections).

### Modified Capabilities

- `app-home`: The home screen now renders inside the new sidebar shell instead of a standalone centered layout.

## Impact

- **Affected code**: `src/routes/+layout.svelte` and `src/routes/home/+page.svelte` (adopt the new shell), new `src/lib/api/videos.ts` client, new sidebar/gallery/modal components under `src/lib/components/`.
- **Affected APIs**: New consumption of `GET /videos`, `GET /videos/{video_name}/thumbnail`, `GET /videos/{video_name}`.
- **Security note**: Access tokens will appear in media URLs (query string), which is a backend-mandated constraint for native browser streaming/caching. This is a known tradeoff (tokens can leak via browser history, referrer headers, or proxy/server logs) that is accepted here because it's required by the existing backend contract; it's called out explicitly in design.md.
- **Dependencies**: No new npm packages required (native `<input type="date">`, native `<video>`; Tailwind + existing design tokens only).
