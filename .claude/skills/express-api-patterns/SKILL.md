# Express API Patterns

Structure the backend as a production-oriented Express API running inside Cloudflare Workers.

## Architecture

- Keep a clear Router → Controller → Service → Data layer separation.
- Centralize error handling in middleware; never call `res.status(500).send(e)` directly from routes.
- Validate request bodies and parameters with Zod or Joi.
- Authenticate with JWT middleware that attaches `req.user`.
- Provide a `/health` endpoint for Cloudflare monitoring.

## Cloudflare runtime

- Use a `wrangler.toml` with `compatibility_date = "2026-09-01"` when that format is required by an existing setup.
- Cloudflare compatibility dates from 2026-08-04 onward enable `nodejs_compat` and `nodejs_compat_v2` by default; do not add those flags manually because they can cause deployment errors.
- Prefer the project’s specified Cloudflare configuration format and keep D1 access through bindings.
