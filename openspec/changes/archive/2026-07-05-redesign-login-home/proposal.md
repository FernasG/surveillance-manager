## Why

The login screen currently lives at `/login`, but the unauthenticated app root (`/`) still shows the default SvelteKit welcome page — meaning login isn't the first thing a visitor sees, which is a poor security/UX default for an app that must be gated. Additionally, the real backend response shape (`{ access_token, token_type }`) differs from the placeholder `session: unknown` the login helper currently assumes, and the front-end still uses default, undesigned styling.

## What Changes

- **BREAKING**: Move the login screen from `/login` to `/`. The `/login` route is removed.
- Add a new `/home` route as the authenticated landing page (replacing the current placeholder welcome content at root).
- Add routing so `/` acts as a gate: unauthenticated visitors see the login form; visitors who already hold a valid session are redirected straight to `/home`. Visiting `/home` without a session redirects back to `/`.
- Update the login API client to parse the real backend payload `{ "access_token": string, "token_type": string }`, and persist it so it can be used to authorize future requests (e.g. `Authorization: Bearer <access_token>`).
- On successful login, redirect to `/home` instead of `/`.
- Redesign the front-end (login screen and new home screen) for production-grade visual craft using the project's `impeccable` design skill/workflow, replacing the current minimal utility styling.

## Capabilities

### New Capabilities
- `app-home`: An authenticated `/home` landing route that requires a valid session and redirects unauthenticated visitors to `/`.

### Modified Capabilities
- `user-login`: Login screen moves from `/login` to `/`; login response parsing changes to the real `{ access_token, token_type }` shape; successful login redirects to `/home` instead of `/`; already-authenticated visitors to `/` are redirected to `/home` instead of seeing the login form again.

## Impact

- Affected code: `src/routes/login/+page.svelte` moves/merges into `src/routes/+page.svelte`; new `src/routes/home/+page.svelte`; `src/lib/api/auth.ts` (response typing/parsing); shared layout/design tokens in `src/routes/layout.css` and `src/routes/+layout.svelte`.
- No backend changes — the `POST {PUBLIC_API_URL}/login` endpoint contract is unchanged, only how the response is parsed on the client.
- Visual/design system: this change introduces the app's first real design pass (colors, typography, spacing) via the `impeccable` skill, superseding the plain Tailwind defaults used previously.
