## Context

The current implementation (from `add-login-screen`) put the login form at `/login`, left the default SvelteKit welcome page at `/`, stored an unstructured `session: unknown` blob in `localStorage`, and used plain Tailwind utility classes with no real design system. Testing against the live backend confirmed the actual login response shape is `{ "access_token": "<jwt>", "token_type": "bearer" }`, not a generic session object. The project also ships a design-craft skill (`impeccable`) intended for exactly this kind of visual redesign pass.

## Goals / Non-Goals

**Goals:**
- Make `/` the login screen so it's unconditionally the first thing an unauthenticated visitor sees.
- Introduce `/home` as the authenticated landing page.
- Gate both routes client-side: no valid token → `/home` bounces to `/`; valid token → `/` bounces to `/home`.
- Parse the real `{ access_token, token_type }` response and store it so future authenticated requests can send `Authorization: <token_type> <access_token>`.
- Apply a real, cohesive visual design (colors, type, spacing, motion) to login + home via the `impeccable` skill instead of ad-hoc Tailwind defaults.

**Non-Goals:**
- Server-side/SSR auth guarding (e.g. `hooks.server.ts`, protecting arbitrary future routes) — this change only wires up `/` and `/home`; a general auth guard for all routes is a follow-up.
- Token refresh/expiry handling — out of scope; only initial login and storage.
- Building out real home page content (camera feeds, etc.) — `/home` is a redesigned placeholder authenticated shell for now.

## Decisions

- **Client-side redirect gating (in each page's `onMount`/load), not a server hook.** Both routes are prerendered/static-friendly SPA pages with no server session today; a `hooks.server.ts` guard would require server-side session awareness we don't have yet (token lives in browser `localStorage`). A `+page.ts` universal `load` function checking `localStorage` (browser-only) redirecting via `throw redirect(...)` is simplest and consistent with the existing client-only auth model. Alternative considered: SvelteKit server hooks with cookies — deferred until the app needs SSR-aware auth.
- **Store the full login payload shape explicitly** (`{ access_token: string, token_type: string }`) rather than the previous `session: unknown`, and expose a small `getAuthHeader()` helper (`` `${token_type} ${access_token}` ``) for future authenticated API calls. Alternative considered: keep `unknown` and let callers destructure ad hoc — rejected, now that the real shape is known, typing it removes guesswork.
- **`/login` is deleted, not redirected.** Since `/` fully replaces its role, keeping a redirect stub adds no value and the proposal marks this as a breaking change.
- **Visual redesign via the `impeccable` skill**, run as an explicit task during implementation (`craft`/general invocation against `/` and `/home`), rather than hand-rolling styles. This keeps design decisions (palette, type scale, motion) consistent with the project's established design workflow and quality bar (contrast, no AI-slop patterns, etc.) instead of ad hoc Tailwind classes.

## Risks / Trade-offs

- [Client-side-only gating means a user could briefly flash the wrong screen before the redirect runs, or bypass it by disabling JS] → Acceptable for now given there's no sensitive data rendered before the check; revisit with server-side guarding when the app has real protected content.
- [Deleting `/login` outright is a breaking change for anyone with that URL bookmarked/linked] → Acceptable since the app has no external users yet; flagged as **BREAKING** in the proposal.
- [`impeccable`-driven redesign could touch a large surface area of styling in one pass] → Scope it explicitly to the login (`/`) and home (`/home`) screens plus shared layout tokens; don't let it sprawl into unrelated future routes.

## Open Questions

- None blocking; token refresh and broader route protection are explicitly deferred (see Non-Goals).
