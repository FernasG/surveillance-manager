## Context

The app is a fresh SvelteKit 5 + Tailwind v4 project (no routes beyond the default welcome page). A backend already exists and exposes `POST {API_URL}/login`, accepting a JSON body `{ username, password }` and enforcing a minimum length of 3 characters on both fields. `API_URL` is already defined via `.env` / `.env.example` and injected through `docker-compose.yml`. There is no session/auth handling anywhere in the app yet.

## Goals / Non-Goals

**Goals:**

- Provide a `/login` screen matching the app's dark-only visual style.
- Validate username/password client-side (both required, min 3 chars) before calling the backend, mirroring the backend's own constraint.
- Call the existing `POST {API_URL}/login` endpoint and handle both success and error responses.
- Persist whatever the backend returns on success (assumed to be a token) so subsequent requests can be authenticated, and redirect to the app's home page.
- Show a clear, generic error message on invalid credentials or request failure.

**Non-Goals:**

- Building or modifying the backend login endpoint — it already exists and is out of scope.
- Implementing full route protection/guards for other pages (redirect-after-login only; broader route-guarding can be a follow-up change).
- Supporting a light theme or theme toggle — dark mode only, per requirements.
- Password reset, registration, or remember-me flows.

## Decisions

- **Call the backend directly from the client (fetch in the browser) rather than a SvelteKit form action/server route.** The backend already lives at a separate `API_URL` (e.g. `http://localhost:3000`) and returns its own response; proxying through a SvelteKit server action would add an extra hop with no current benefit since there's no server-side session to manage yet. Alternative considered: a SvelteKit form action that proxies to the backend — rejected for now as unnecessary indirection, but noted as an option if we later need to keep tokens httpOnly.
- **Store the session token in `localStorage`.** Simplest mechanism given no SvelteKit server-side session exists yet. Alternative considered: cookie-based session — deferred since the backend endpoint contract for cookies isn't specified.
- **Client-side validation mirrors backend rules (required, min 3 chars)** to give immediate feedback, but the backend remains the source of truth — client validation is a UX convenience, not a security boundary.
- **Dark theme via Tailwind CSS custom properties/utility classes applied at the layout level**, so the login screen and any future screens share the same look without a toggle.

## Risks / Trade-offs

- [Storing token in `localStorage` is vulnerable to XSS exfiltration] → Acceptable for this iteration since the app has no other user-generated content/XSS surface yet; revisit with httpOnly cookies if that changes.
- [No route guard yet means other pages remain accessible without login after this change] → Out of scope; flagged as a fast follow-up.
- [Backend error responses aren't fully known] → Design treats any non-2xx response as a generic "invalid username or password" error to avoid leaking backend details; network/parse failures show a separate "couldn't reach the server" message.

## Open Questions

- Exact shape of the backend's success/error response body (e.g. does it return `{ token }`, and what status codes/error bodies does it use for bad credentials vs. server error?) — implementation should confirm against the running backend and adjust parsing accordingly.
