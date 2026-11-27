# AGENTS.md

Frontend of [strom.sk](https://strom.sk), the website of the STROM, Matik and Malynár math seminars
(problem sets, solution uploads, results, events, archive) plus the admin used by the organisers.
The Django backend lives in [webstrom-backend](https://github.com/ZdruzenieSTROM/webstrom-backend).

Stack: Next.js (Pages Router) + React + TypeScript, MUI, TanStack Query + axios, react-admin, vitest +
Testing Library, yarn 4 (`.yarn/releases`), Node ≥ 22.

Longer docs in `docs/`: `DEPLOYMENT.md` (deploy pipeline), `trailing-slash.md` (why backend URLs keep a
trailing slash and page URLs don't), `screeny.md` (what each participant-facing page shows).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

| Task                          | Command                                             |
| ----------------------------- | --------------------------------------------------- |
| Install                       | `yarn`                                              |
| Dev server (`localhost:3000`) | `yarn dev`                                          |
| Typecheck                     | `yarn tsc`                                          |
| Lint (ESLint + Prettier)      | `yarn lint` (autofix: `yarn lint:fix`)              |
| Tests                         | `yarn test --run` (`yarn test` stays in watch mode) |
| Production build              | `yarn build`                                        |

CI (`branch-test` in `.github/workflows/test.yml`) runs `yarn tsc`, `yarn lint`, `yarn test`, `yarn build`
on every PR; run the same four before pushing.

### Which backend the dev server talks to

- The committed `.env` sets `BE_PROTOCOL` / `BE_HOSTNAME` / `BE_PORT`; later uncommented lines win, and by
  default that is the deployed test backend, `https://test.strom.sk`. No local backend is needed for FE work.
- Shortcuts that override `.env`: `yarn dev:local` (`localhost:8000`), `yarn dev:test`, `yarn dev:prod`.
- `DEBUG_SERVER=true` logs every server-side API call.
- The browser calls relative `/api`, `/media`, `/django-admin` and `/static`. Locally `src/proxy.ts`
  rewrites them to the backend; on deployed servers nginx does it. The Next server calls the backend URL
  directly. Backend URLs keep their trailing slash; page URLs have it stripped by a 308 redirect.

## Architecture

### API layer — `src/api`

- Every backend call is an entry in `createApiOptions` in `src/api/api.ts`, nested by URL path
  (`apiOptions.competition.semester.byId(id)` → `/competition/semester/{id}`).
- A query returns `{queryKey, queryFn, enabled?}`; the key mirrors the path segments plus params. Guard
  optional ids with `enabled: id != null` (the backend sometimes sends `null` where types say `undefined`).
- A mutation is wrapped in `mutationOptions({mutationFn})`.
- Components consume them directly: `useQuery(apiOptions.x.y(...))`, `useMutation(apiOptions.x.y())`, or
  spread to add callbacks: `useMutation({...apiOptions.x.y(), onSuccess})`. Don't call axios from components.
- `apiOptions` uses the browser axios instance; `createSSRApiOptions(req)` builds the same tree on an
  instance that forwards the request's auth cookie and CSRF header. Auth is the Django `sessionid` cookie
  plus `X-CSRFToken`, set up in `src/api/apiAxios.ts`.

### Pages: SSR prefetch + hydration

- Routes live under `src/pages/{strom,matik,malynar}/…`. The `strom` file is the implementation; the
  `matik` and `malynar` files re-export its page and `getServerSideProps`. The seminar comes from the
  URL via `useSeminarInfo` / `getSeminarInfoFromPathname`.
- A page's `getServerSideProps` creates a `QueryClient`, awaits `commonQueries(...)` (menu, footer, logo)
  plus `prefetchQuery(createSSRApiOptions(req)....)` for its own data, and returns
  `props: {dehydratedState: dehydrate(queryClient)}`. `_app.tsx` wraps pages in a `HydrationBoundary`, so
  components using the same `apiOptions` entry render with data on first paint.
- Use the same `apiOptions` entry on server and client — the query keys must match for hydration.
- Format dates with the helpers in `src/utils` (`formatDate.ts`) so server and browser render the same.

### Admin

- `/admin` is react-admin (`src/components/Admin`), rendered client-side only (`dynamic(..., {ssr: false})`).
  Resources are in `Admin/resources`, the data provider in `dataProvider.ts`, Slovak UI strings in
  `Admin/translations/sk_SK.ts`.
- `/{seminar}/admin/*` (grading, problem correction) are ordinary Next pages with the SSR pattern above.

### Where code goes

- Shared hooks and helpers: `src/utils`. Shared API types: `src/types/api`. Theme: `src/theme`.
- Put a helper any part of the app could use in `src/utils`, not next to its first consumer.
- Imports use the `@/` alias for `src/`; import order is enforced by `simple-import-sort`.

## Tests

- vitest + jsdom + Testing Library; test files sit next to the code as `*.test.ts(x)`.
- `vitest.setup.ts` mocks globally: `next/router` (use `mockRouter` from `next-router-mock`),
  `next/font`, `useHasPermissions` (permitted by default), and `@/api/apiAxios` (`get` / `post` / `patch`
  are `vi.fn()`; stub per test with `vi.mocked(apiAxios.get).mockImplementation(...)`).
- Render with `renderWithProviders` from `src/utils/testUtils.tsx` (QueryClient with no retries, alert
  provider, MUI theme); fixtures such as `makeSolution` live there too.

## Deploys

- Merging to `master` deploys nothing. Test (test.strom.sk) and prod (strom.sk) are deployed manually by
  maintainers through the `deploy-test.yml` / `deploy-prod.yml` workflows; see `docs/DEPLOYMENT.md`.
- Check a merged change on test before it goes to prod.

## Conventions

- **Slovak copy written in the frontend uses tykanie** — 2nd person singular, informal: "Skontroluj",
  never "Skontrolujte". This includes `Admin/translations/sk_SK.ts`. Messages that come from the backend
  are shown as they are.
- Commits and PR titles: short imperative English sentence ("Prefetch archive events during SSR"); prefix
  with the issue number when there is one (`852: Fix tiny checkboxes in RA on Firefox`).
- A PR that fixes an issue links it with `Closes #N`.
- Show in the PR how the change was tested: before/after screenshots for UI changes, and what you ran or
  clicked through (commands, URLs, which backend) for the rest.
- `master` needs a green `branch-test` and one approving review.
