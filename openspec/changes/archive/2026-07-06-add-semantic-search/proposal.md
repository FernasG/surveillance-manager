## Why

Right now the only way to find a moment in recorded footage is to browse the Video Archive gallery by date and scrub through clips manually. Users need a faster way to answer "did anything like X happen, and when?" — a natural-language search that jumps straight to the matching frame and moment, using the backend's existing `POST /query` semantic search endpoint.

## What Changes

- Add a new "Semantic Search" section, reachable from the sidebar, with a centered natural-language search bar.
- Submitting a query calls `POST /query` (with `Authorization: Bearer <token>`) and renders matches as a grid of result cards, each showing the matched frame's thumbnail (from `frame_base64`), the generated description, the occurrence timestamp (`elapsed_ms` formatted as `MM:SS`), and the confidence score.
- Selecting a result card opens a centered playback overlay with an HTML5 `<video controls autoplay>` element that starts exactly at `elapsed_ms`, streamed from the backend's video route using the filename parsed out of the returned absolute `video_path`.
- Reuses the existing authenticated-media-URL convention (session token appended as a `?token=` query parameter) already established for Video Archive playback.

## Capabilities

### New Capabilities
- `semantic-search`: Natural-language search over recorded footage — query submission, result rendering (thumbnail, description, timestamp, confidence), and jump-to-moment video playback.

### Modified Capabilities
- `app-shell-navigation`: Sidebar navigation entries gain a "Semantic Search" entry alongside Home and Video Archive.

## Impact

- New route/section in the SvelteKit app (authenticated area) and a new sidebar entry.
- New API client function for `POST /query`, following the existing pattern in `src/lib/api/videos.ts` (auth header, typed result, error handling).
- Reuses `VideoPlaybackModal`-style overlay; playback needs a start-offset (`elapsed_ms`) not required by the existing Video Archive playback flow.
- Backend contract: `POST /query` request `{ text }`, response `{ results: [{ video_path, elapsed_ms, description, confidence_score, frame_base64 }] }`. The video filename must be parsed from `video_path` (absolute backend path) before building the stream URL.
