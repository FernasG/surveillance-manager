## 1. Dark theme foundation

- [x] 1.1 Add dark color tokens/utility classes to `src/routes/layout.css` (background, surface, text, border, accent colors) so the whole app renders dark by default
- [x] 1.2 Apply the dark background/text classes at the root layout (`src/routes/+layout.svelte`) so every route inherits the dark theme

## 2. API client helper

- [x] 2.1 Add a small client helper (e.g. `src/lib/api/auth.ts`) that POSTs `{ username, password }` as JSON to `${API_URL}/login` and returns a typed result (success with session data, or error with a reason)
- [x] 2.2 Expose `API_URL` to the client via SvelteKit's `$env/static/public` or `$env/dynamic/public` (rename/mirror the env var as `PUBLIC_API_URL` if it must be read in browser code) and update `.env` / `.env.example` accordingly

## 3. Login screen UI

- [x] 3.1 Create `src/routes/login/+page.svelte` with username and password inputs, a submit button, and dark-themed styling via Tailwind
- [x] 3.2 Add client-side validation: both fields required and at least 3 characters; show inline validation error and block submission when invalid
- [x] 3.3 Wire form submission to the auth helper from 2.1; show a loading state while the request is in flight

## 4. Handle login responses

- [x] 4.1 On success, persist the returned session/token (e.g. `localStorage`) and redirect to the app's home page (`/`)
- [x] 4.2 On invalid-credentials response, show an "invalid username or password" message and keep the user on `/login`
- [x] 4.3 On network failure or unexpected server error, show a "couldn't reach the server" message and keep the user on `/login`

## 5. Verification

- [x] 5.1 Manually verify: correct credentials log in and redirect; wrong credentials show an error; sub-3-character input is blocked client-side; screen renders in dark mode
- [x] 5.2 Run `npm run check` and `npm run lint` and fix any issues
