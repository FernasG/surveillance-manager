## 1. API layer

- [x] 1.1 Create `src/lib/api/search.ts` with a `SearchResult` type (`videoName`, `elapsedMs`, `description`, `confidenceScore`, `frameBase64`) and a `QueryResult` discriminated result type (`{ ok: true; data: SearchResult[] } | { ok: false; reason: 'server_error' }`), mirroring `videos.ts`'s conventions.
- [x] 1.2 Implement `postQuery(text: string)`: `POST {PUBLIC_API_URL}/query` with `Authorization` header from `getAuthHeader()` and JSON body `{ text }`; parse the response's `results` array.
- [x] 1.3 Parse each result's `video_path` (e.g. `/app/videos/cam1_1783221727.mp4`) down to just the filename, and expose it as `videoName` on the parsed `SearchResult`.
- [x] 1.4 Add a `searchResultStreamUrl(videoName, session)` helper that builds the authenticated stream URL (reusing `buildMediaUrl` from `videos.ts` against the same `/videos/{videoName}` backend route), appending the session token as a `token` query parameter.

## 2. Search result playback overlay

- [x] 2.1 Create `src/lib/components/SearchResultPlaybackModal.svelte`, based on `VideoPlaybackModal.svelte`'s structure (backdrop click, Escape-to-close, error state), accepting `videoName`, `src`, `elapsedMs`, and `onClose` props.
- [x] 2.2 Set the `<video controls autoplay>` element's playback start position from `elapsedMs` by appending `#t={elapsedMs / 1000}` to the `src` URL.
- [x] 2.3 Reuse the existing error-state copy/style for a failed video load (expired session messaging).

## 3. Semantic Search route and page

- [x] 3.1 Create `src/routes/(authenticated)/search/+page.svelte` under the authenticated layout group.
- [x] 3.2 Build a centered search bar (natural-language text input + submit) at the top of the page, following `DESIGN.md`'s flexbox-first, dark-mode token conventions (`--bg`, `--surface`, `--border`, `--ink`, `--muted`, `--primary`).
- [x] 3.3 On submit, call `postQuery`, track `loading`/`errored` state, and store results in a `$state` array (mirroring the archive page's `fetchVideos`/`applyFilters` pattern).
- [x] 3.4 Render results as a responsive grid of cards (thumbnail, description, `MM:SS` timestamp, confidence score), matching the archive gallery's grid breakpoints.
- [x] 3.5 Implement a small `formatTimestamp(elapsedMs)` function that converts milliseconds to `MM:SS`.
- [x] 3.6 Render each card's thumbnail directly from `data:image/jpeg;base64,{frameBase64}` — no network request.
- [x] 3.7 Add empty-state copy for zero results and inline error copy for a failed query, matching the archive page's existing empty/error state patterns.
- [x] 3.8 Wire card selection to open `SearchResultPlaybackModal` with the selected result's parsed `videoName`, stream `src` (via `searchResultStreamUrl`), and `elapsedMs`.

## 4. Navigation

- [x] 4.1 Add a "Semantic Search" entry to `navItems` in `Sidebar.svelte` (path `/search`), with a new inline SVG icon (magnifying glass) following the existing `home`/`archive` icon pattern.
- [x] 4.2 Verify the sidebar highlights "Semantic Search" as active when on `/search`, and collapses/expands correctly with the existing sidebar toggle.

## 5. Verification

- [x] 5.1 Run the Svelte autofixer on all new/modified `.svelte` files and resolve any reported issues.
- [x] 5.2 Manually verify: submitting a query renders result cards with correct thumbnail, description, `MM:SS` timestamp, and confidence score.
- [x] 5.3 Manually verify: selecting a result card opens the overlay and playback starts at the expected offset (not from 0:00).
- [x] 5.4 Manually verify empty-results and query-failure states render correctly instead of a blank/broken grid.
