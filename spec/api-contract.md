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

## Submissions

### `POST /api/submissions`

Protected. Creates a submission for the current user.

Request body:

```json
{
  "labId": 1,
  "solution": "solution content"
}
```

### `GET /api/submissions`

Protected. Returns submissions belonging to the current authenticated user.

### `GET /api/submissions/:id`

Protected. Returns one submission by ID when it belongs to the current authenticated user.
