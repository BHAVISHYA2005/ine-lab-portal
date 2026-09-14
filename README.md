# INE Lab Submission Portal

A practical lab submission portal for INE-style technical training. Students browse Linux, Docker, Networking, and Security labs, submit solutions, and track their work. The project uses React, an Express-compatible Cloudflare Worker, and Cloudflare D1.

## Live URLs

- Frontend: https://ine-lab-portal.pages.dev
- Backend: https://ine-lab-portal-api.handballaggarwal.workers.dev
- Health check: https://ine-lab-portal-api.handballaggarwal.workers.dev/health

## Tech stack

- React 19, Vite, React Router v7, Tailwind CSS
- Axios with JWT request and response interceptors
- Express 5-compatible application running on Cloudflare Workers
- Zod validation, `jose` JWT signing, and `bcryptjs` password hashing
- Cloudflare D1 (SQLite) for users, labs, and submissions
- Vitest, Testing Library, and Wrangler

## Architecture

```text
+---------------------------+
| Cloudflare Pages          |
| React + Vite frontend     |
+-------------+-------------+
              | HTTPS / JSON + JWT
              v
+---------------------------+
| Cloudflare Workers        |
| Express-compatible API    |
| Auth, labs, submissions   |
+-------------+-------------+
              | DB binding
              v
+---------------------------+
| Cloudflare D1             |
| users / labs / submissions|
+---------------------------+
```

The frontend is deployed to Pages. The backend Worker validates requests, authenticates protected routes, and accesses D1 through the `DB` binding. JWTs are signed with the `JWT_SECRET` Worker secret; passwords are stored only as bcrypt hashes.

## Local setup

Requirements: Node.js 22+, npm, and Wrangler 4.

### Backend

```fish
cd backend
npm install
cp .dev.vars.example .dev.vars
```

Set a local value in `backend/.dev.vars`:

```env
JWT_SECRET=replace-with-a-local-secret
```

Initialize the local D1 database and start the Worker:

```fish
npm run db:migrate:local
npm run dev
```

The API is available at `http://localhost:8787`. Verify it with:

```fish
curl http://localhost:8787/health
```

### Frontend

In a second terminal:

```fish
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL=http://localhost:8787` in `frontend/.env` for local development. The frontend is then available at the Vite URL, normally `http://localhost:5173`.

## API overview

Public:

- `GET /health`
- `POST /api/auth/signup`
- `POST /api/auth/login`

Protected with `Authorization: Bearer <token>`:

- `GET /api/auth/me`
- `GET /api/labs`
- `GET /api/labs/:id`
- `POST /api/submissions`
- `GET /api/submissions`
- `GET /api/submissions/:id`

## Tests

Run backend tests:

```fish
cd backend
npm test
```

Run frontend tests:

```fish
cd frontend
npm test
```

The test suite covers auth service behavior, lab retrieval behavior, and lab card rendering.

## Deployment

### Worker and D1

Authenticate Wrangler, then create or identify the D1 database:

```fish
cd backend
npx wrangler login
npx wrangler d1 create ine-lab-portal-db
```

Put the real database ID in `backend/wrangler.jsonc`, apply the remote schema, configure the JWT secret, and deploy:

```fish
npx wrangler d1 execute ine-lab-portal-db --remote --file=src/schemas/schema.sql
npx wrangler secret put JWT_SECRET
npm run deploy
```

### Pages

Set `frontend/.env` to the deployed Worker URL:

```env
VITE_API_URL=https://ine-lab-portal-api.<your-account>.workers.dev
```

Create the Pages project once, then deploy:

```fish
cd frontend
npx wrangler pages project create ine-lab-portal --production-branch main
npm run deploy
```

The frontend deployment script builds `dist/` and publishes it to Cloudflare Pages. Local `.env`, `.dev.vars`, Wrangler state, and build output are ignored by Git.

## AI-assisted development

This project was developed with GPT-5.6 Luna through Zed. The development record is documented in [`docs/AI_USAGE.md`](docs/AI_USAGE.md).

## Project specifications

- [`idea.md`](idea.md)
- [`spec/architecture.md`](spec/architecture.md)
- [`spec/data-model.md`](spec/data-model.md)
- [`spec/api-contract.md`](spec/api-contract.md)
- [`spec/ui-spec.md`](spec/ui-spec.md)
