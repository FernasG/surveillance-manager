# Surveillance Manager

Surveillance Manager is the web dashboard for an **offline, edge-computing video surveillance system**. It runs entirely on local hardware — no cloud dependency — and gives homeowners and small-business owners a fast, low-friction way to check in on their cameras: confirm everything is fine, browse recorded footage, and find a specific moment across hours of video using **natural-language, multimodal semantic search** instead of manually scrubbing through clips.

This repository contains **only the frontend**. It is a SvelteKit single-page application that talks to a separate backend API responsible for authentication, video storage/streaming, and the AI-driven retrieval pipeline (vision-language frame captioning + vector search) that powers semantic search.

> **Backend repository:** [https://github.com/FernasG/surveillance-system](https://github.com/FernasG/surveillance-system)
> This frontend expects that API to be running and reachable at the URL configured in `PUBLIC_API_URL` (see [Configuration](#configuration)).

## How it works

1. **Sign in** — the user logs in with a username/password against the backend's `/login` endpoint. On success, an access token is stored in the browser (`localStorage`) and attached as a `Bearer` token to subsequent API calls.
2. **Home** — a status-first landing screen answering "is everything okay right now?" at a glance.
3. **Video Archive** — a paginated gallery of recorded clips, each represented by a thumbnail the backend generates on demand. Selecting a clip opens a playback overlay that streams the file efficiently using **HTTP Range Requests** rather than downloading the whole video up front.
4. **Semantic Search** — the user types a plain-English description of what they're looking for (e.g. *"person wearing a red shirt"*). The backend's retrieval pipeline searches embeddings of previously captioned frames and returns the best-matching moments. Each result is rendered as a card with the matched frame (returned inline as base64, no extra image request), an AI-generated description, the timestamp within the clip, and a confidence score. Clicking a result opens the same clip, seeked to the **exact millisecond** the match occurred.

Because native `<img>`/`<video>` elements can't send custom `Authorization` headers, authenticated media (thumbnails, video streams) is loaded by appending the session's access token as a `?token=` query parameter directly on the media URL — the `Authorization` header is only used for standard JSON API calls (`/login`, `/videos`, `/query`).

## Key Features

- **Dark-mode-native interface** — a technical, low-glare console built for brief, occasional check-ins rather than a generic bright SaaS dashboard. Full keyboard navigation and WCAG AA contrast throughout.
- **Video Archive gallery** — date-range filtering, paginated "Load more" browsing, and **on-demand thumbnail generation** (thumbnails are rendered by the backend per video rather than pre-baked static assets).
- **Efficient video streaming** — playback uses **HTTP 206 Partial Content (Range Requests)**, so the browser streams and seeks through footage without pulling the entire file into memory.
- **Intelligent Semantic Search**:
  - Natural-language query bar — search footage by describing what happened, not by timestamp.
  - Result cards showing the matched **base64-encoded frame**, an AI-generated description, a `MM:SS` timestamp, and a confidence score.
  - One click jumps straight into playback at the **precise moment** the match occurred (via a computed start offset), instead of playing the clip from the beginning.
  - Graceful "Preview unavailable" / "Description unavailable" fallback when the backend couldn't extract a given frame.
- **Session-aware routing** — authenticated routes are guarded and redirect to the login screen without a valid session; an already-authenticated visitor is redirected away from the login screen.

## Tech Stack

- [SvelteKit](https://svelte.dev/docs/kit) 2 + [Svelte](https://svelte.dev) 5 (runes) — TypeScript throughout
- [Tailwind CSS](https://tailwindcss.com) 4 for styling, using a fixed OKLCH dark-mode design system (see `DESIGN.md`)
- [Vite](https://vite.dev) for dev server and bundling
- [Prettier](https://prettier.io) for formatting
- Docker / Docker Compose for local development and builds

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (recommended path — see below), **or** Node.js 24+ and npm if running outside Docker
- A running instance of the [backend API](https://github.com/FernasG/surveillance-system), reachable from wherever this app runs

## Configuration

Copy `.env.example` to `.env` and set the backend URL:

```sh
cp .env.example .env
```

```env
PUBLIC_API_URL=http://localhost:3000
```

`PUBLIC_API_URL` must point at the backend from [surveillance-system](https://github.com/FernasG/surveillance-system). All authentication, video, and search requests are made against this URL.

## Running with Docker (recommended)

The project ships with a `Makefile` that wraps the Docker Compose workflow defined in `docker-compose.yml` / `Dockerfile`.

1. **Configure the environment** (see [Configuration](#configuration) above) — make sure `.env` exists before building.

2. **Build the image:**

   ```sh
   make build
   ```

3. **Start the app:**

   ```sh
   make up
   ```

   This starts the `surveillance-manager` container running the Vite dev server, bind-mounted to the repository so local file changes are picked up live. The dashboard is served at **http://localhost:5173**.

   To build and start in one detached step instead:

   ```sh
   make up-build
   ```

4. **View logs:**

   ```sh
   make logs
   ```

5. **Open a shell inside the running container** (useful for debugging or running one-off commands):

   ```sh
   make sh
   ```

6. **Stop the app:**

   ```sh
   make down
   ```

Once running, open **http://localhost:5173** in your browser and sign in with credentials issued by the backend.

## Running without Docker

```sh
npm install
npm run dev            # starts the dev server on http://localhost:5173
npm run dev -- --open  # same, and opens a browser tab automatically
```

Other useful scripts:

| Command          | Purpose                                         |
| ----------------- | ------------------------------------------------ |
| `npm run build`   | Produce a production build                        |
| `npm run preview` | Preview the production build locally              |
| `npm run check`   | Type-check the project with `svelte-check`         |
| `npm run lint`    | Check formatting with Prettier                    |
| `npm run format`  | Auto-format the project with Prettier              |

## Project Structure

```
src/
├── routes/
│   ├── +page.svelte                    # Login screen ("/")
│   └── (authenticated)/                # Routes requiring a valid session
│       ├── +layout.svelte              # App shell: sidebar + header
│       ├── +layout.ts                  # Session guard/redirect
│       ├── home/+page.svelte           # Home / status screen
│       ├── archive/+page.svelte        # Video Archive gallery
│       └── search/+page.svelte         # Semantic Search
├── lib/
│   ├── api/
│   │   ├── auth.ts                     # Login, session storage, auth headers
│   │   ├── videos.ts                   # Video Archive listing + media URLs
│   │   └── search.ts                   # POST /query + result parsing
│   ├── components/
│   │   ├── Sidebar.svelte              # Collapsible nav (Home / Archive / Search)
│   │   ├── VideoPlaybackModal.svelte   # Archive playback overlay
│   │   └── SearchResultPlaybackModal.svelte # Search playback overlay (seeks to match)
│   └── stores/
│       └── sidebar.svelte.ts           # Sidebar collapsed/expanded state
├── app.html
└── app.d.ts
```

Product intent and visual/UX design decisions are documented separately in `PRODUCT.md` and `DESIGN.md`.

## Related Project

This frontend is a companion to the **Pi Guard** backend:

- **Backend repository:** [https://github.com/FernasG/surveillance-system](https://github.com/FernasG/surveillance-system) — authentication, video storage & streaming (Range Requests), and the retrieval-augmented semantic search pipeline this app queries.

## License
This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
