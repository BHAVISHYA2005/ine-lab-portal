# AI-Assisted Development

## Model and environment

- **Model:** GPT-5.6 Luna
- **Editor:** Zed
- **Role:** Pair-programming assistant for architecture, implementation, debugging, testing, deployment, and documentation

## Representative prompts used

1. Scaffold the INE Lab Submission Portal in phases with a Cloudflare Workers, D1, React, and Vite architecture.
2. Create the Phase 1 architecture, data model, API contract, UI specification, and progress tracker.
3. Implement an Express-compatible Worker with JWT authentication, bcrypt password hashing, Zod validation, lab routes, submission routes, and D1 access.
4. Build the React frontend with protected routes, Axios JWT interceptors, lazy loading, a Bento lab dashboard, lab detail submission flow, and accessible dark-mode UI.
5. Inspect the repeated `/api/labs/:id` requests and diagnose the frontend flicker, then add a regression-safe hook fix and validation.

## AI-generated work

AI generated the initial project structure and most of the implementation, including:

- Skill context files and project specifications
- Worker adapter, Express routes, middleware, services, and D1 schema
- React pages, components, hooks, authentication context, API client, and styling
- Wrangler and Pages deployment configuration
- Vitest tests and this documentation

## Manually changed or verified work

The implementation was reviewed and adjusted during development to match the actual runtime:

- Added the local `.dev.vars` setup manually without committing secrets.
- Supplied the real Cloudflare D1 database ID during deployment.
- Configured the production `JWT_SECRET` through Wrangler rather than source control.
- Confirmed the Cloudflare Worker and Pages deployment settings in the Cloudflare account.
- Verified live health checks and local/remote D1 schema execution.
- Reviewed the final UI and submission flow in the browser.

## Bug introduced by AI and how it was caught

The first `useLab` implementation passed an inline callback into a data-fetching hook:

```js
useRequest(() => getLab(id), null)
```

Because the callback identity changed on every render, the hook recreated its reload function, retriggered its effect, and caused an endless loop of `GET /api/labs/:id` requests. The browser visibly flickered, and Wrangler logs showed repeated requests and `304 Not Modified` responses.

The issue was caught by inspecting the backend terminal logs. The callback was memoized with `useCallback`, which stopped the loop. A production frontend build and backend syntax/health checks passed after the fix.

## Validation

The output was validated through:

- `git diff --check`
- JavaScript syntax checks with `node --check`
- Vite production builds
- Local Worker `/health` smoke tests
- Local and remote D1 schema execution
- Backend Vitest tests for auth and labs
- Frontend Testing Library coverage for `LabCard`
- Wrangler Worker dry runs and live deployment
- Live Worker health check at `/health`
- Manual browser verification of signup, login, lab browsing, solution submission, and submission history
