# Architecture

The INE Lab Submission Portal uses a three-tier architecture with a React frontend, an Express-compatible API running on Cloudflare Workers, and Cloudflare D1 for persistence.

## Tiers

### Frontend

- React 19 with Vite
- Tailwind CSS for styling
- React Router for client-side navigation
- Deployed to Cloudflare Pages
- Communicates with the backend through the documented HTTP API

### Backend

- Express.js application adapted for the Cloudflare Workers runtime
- Deployed through Wrangler to Cloudflare Workers
- Handles authentication, lab browsing, and submission workflows
- Uses JWT authentication with bcrypt password hashing
- Uses environment bindings and secrets supplied by Cloudflare

### Database

- Cloudflare D1, a serverless SQLite database
- Accessed through the Workers `DB` D1 binding
- Stores users, labs, and submissions
- Schema and seed data are maintained in the backend schema directory

## Request flow

1. A user accesses the React application from Cloudflare Pages.
2. The frontend sends API requests to the Cloudflare Worker.
3. The Worker validates input, authenticates protected requests, and invokes service logic.
4. Services read from or write to D1 through the `DB` binding.
5. The API returns JSON responses to the frontend.
