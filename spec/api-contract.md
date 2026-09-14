# API Contract

All API responses use JSON. Protected endpoints require an `Authorization: Bearer <token>` header. Authentication failures return HTTP `401`; malformed input returns HTTP `400` or `422` according to validation behavior; missing resources return HTTP `404`.

## Health

### `GET /health`

Public health check for Cloudflare monitoring.

Response:

```json
{
  "status": "ok",
  "timestamp": "2026-09-01T00:00:00.000Z"
}
```

## Authentication

### `POST /api/auth/signup`

Creates a student account.

Request body:

```json
{
  "email": "student@example.com",
  "password": "secure-password"
}
```

Returns a JWT and the authenticated user.

### `POST /api/auth/login`

Authenticates an existing account.

Request body:

```json
{
  "email": "student@example.com",
  "password": "secure-password"
}
```

Returns a JWT and the authenticated user.

### `GET /api/auth/me`

Protected. Returns the current authenticated user.

## Labs

### `GET /api/labs`

Protected. Returns all available labs.

### `GET /api/labs/:id`

Protected. Returns one lab by numeric ID. Returns `404` when the lab does not exist.

### `GET /api/labs/:id/question`

Protected. Generates a fresh AI practice question for the lab on every request (no caching). Returns `{ "question": string | null }`; `question` is `null` when the AI service is unavailable or times out, and the frontend hides the panel in that case.

## Submissions

### `POST /api/submissions`

Protected. Creates a submission for the current user and automatically grades it with the AI reviewer before saving. `status` is set directly from the AI verdict (`approved`, `rejected`, or `needs_review`); there is no separate human review step.

Request body:

```json
{
  "labId": 1,
  "solution": "solution content"
}
```

Response includes the AI review fields alongside the stored submission:

```json
{
  "submission": {
    "id": 1,
    "status": "approved",
    "ai_verdict": "approved",
    "ai_feedback": "...",
    "ai_confidence": 0.95,
    "ai_reviewed_at": "2026-09-14T00:00:00.000Z"
  }
}
```

If the AI service fails or times out, the submission still saves with `status: "needs_review"` and null feedback/confidence rather than failing the request.

### `GET /api/submissions`

Protected. Returns submissions belonging to the current authenticated user, including AI review fields.

### `GET /api/submissions/:id`

Protected. Returns one submission by ID when it belongs to the current authenticated user, including AI review fields.
