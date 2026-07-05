## Why

The surveillance manager app has no way for a user to authenticate. The backend already exposes a login endpoint (`POST {API_URL}/login`), but the frontend has no screen to collect credentials and call it. We need a login screen so users can sign in before accessing the app.

## What Changes

- Add a `/login` route with a dark-themed screen containing username and password fields.
- Client-side validation: both fields required, minimum 3 characters each, matching the backend's constraint.
- On submit, send `{ username, password }` as JSON to `POST {API_URL}/login`.
- Display a clear error message when the backend rejects the credentials or the request fails (e.g. network/server error).
- On success, store the returned session/token and redirect the user into the app.
- Apply a single dark color scheme to the login screen (and shared layout) via Tailwind CSS — no light mode.

## Capabilities

### New Capabilities

- `user-login`: Login screen UI, client-side validation, calling the existing `POST /login` backend endpoint, handling success/error responses, and redirecting authenticated users.

### Modified Capabilities

(none — no existing specs)

## Impact

- Affected code: new `src/routes/login/+page.svelte` (and a form action or client fetch call), `src/routes/layout.css` (dark theme tokens applied app-wide), possibly `src/lib/` for an API client helper.
- Dependency: existing `API_URL` env var (already defined in `.env` / `.env.example`) used as the base URL for the login call.
- No changes to the backend — the `POST /login` endpoint already exists and is out of scope.
- No database or new auth backend is introduced in this change.
