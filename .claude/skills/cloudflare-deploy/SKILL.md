# Cloudflare Deployment

Deploy the full stack using Cloudflare-native services.

- Deploy the backend to Cloudflare Workers, not Render or Railway.
- Deploy the frontend to Cloudflare Pages.
- Use Cloudflare D1 (SQLite-based, serverless) for the database.
- Use the Wrangler CLI for deployment: `npx wrangler deploy`.
- Store environment secrets with `wrangler secret put`; never commit `.env` or `.dev.vars` files.
- Use `wrangler.jsonc` for new Cloudflare configurations because Cloudflare recommends it over `wrangler.toml` as of Wrangler v3.91+.
- Keep database IDs and deployment-specific values out of source control when they are not safe to publish.
