## 1. Auth payload update

- [x] 1.1 Update `src/lib/api/auth.ts` to type the success result as `{ ok: true, accessToken: string, tokenType: string }` and parse `{ access_token, token_type }` from the backend response
- [x] 1.2 Add a small helper (e.g. `getAuthHeader()` / `getStoredSession()`) in `src/lib/api/auth.ts` to read the persisted token from `localStorage` and build an `Authorization: <token_type> <access_token>` value, plus a `hasValidSession()` check for route guards

## 2. Move login to `/`

- [x] 2.1 Move the login form markup/logic from `src/routes/login/+page.svelte` to `src/routes/+page.svelte`, updating the redirect target on success to `/home`
- [x] 2.2 Delete the old `src/routes/login/` route directory

## 3. Authenticated `/home` route

- [x] 3.1 Create `src/routes/home/+page.svelte` as the authenticated landing page (placeholder content acceptable, but styled consistently with the redesign)

## 4. Route gating

- [x] 4.1 Add a `+page.ts` (or equivalent client-side check) for `/` that redirects to `/home` if `hasValidSession()` is true
- [x] 4.2 Add a `+page.ts` (or equivalent client-side check) for `/home` that redirects to `/` if `hasValidSession()` is false

## 5. Visual redesign

- [x] 5.1 Run the `impeccable` skill (setup + register read) against the app, scoped to the login (`/`) and home (`/home`) screens plus shared layout tokens in `src/routes/layout.css` / `src/routes/+layout.svelte`
- [x] 5.2 Apply the resulting design system (palette, typography, spacing, motion) to both screens, replacing the current plain Tailwind defaults
- [x] 5.3 Verify contrast, responsiveness, and reduced-motion handling per the skill's design guidance

## 6. Verification

- [x] 6.1 Manually verify: `/` shows login when logged out; submitting valid credentials stores `access_token`/`token_type` and redirects to `/home`; `/home` redirects to `/` when logged out; `/` redirects to `/home` when already logged in
- [x] 6.2 Run `npm run check` and `npm run lint` and fix any issues
