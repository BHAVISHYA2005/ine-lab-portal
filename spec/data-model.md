# Data Model

The database is Cloudflare D1 (SQLite). Foreign keys are used for relationships between users, labs, and submissions.

## `users`

| Column | Type | Constraints |
| --- | --- | --- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `email` | TEXT | UNIQUE NOT NULL |
| `password_hash` | TEXT | NOT NULL |
| `role` | TEXT | DEFAULT `'student'` |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

## `labs`

| Column | Type | Constraints |
| --- | --- | --- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `title` | TEXT | NOT NULL |
| `category` | TEXT | NOT NULL; `linux` \| `docker` \| `networking` \| `security` |
| `difficulty` | TEXT | NOT NULL; `beginner` \| `intermediate` \| `advanced` |
| `description` | TEXT | NOT NULL |
| `starter_code` | TEXT | Nullable |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |
| `rubric` | TEXT | Nullable; optional grading context passed to the AI reviewer |

## `submissions`

| Column | Type | Constraints |
| --- | --- | --- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `user_id` | INTEGER | NOT NULL; REFERENCES `users(id)` |
| `lab_id` | INTEGER | NOT NULL; REFERENCES `labs(id)` |
| `solution` | TEXT | NOT NULL |
| `status` | TEXT | `approved` \| `rejected` \| `needs_review`; set automatically by the AI reviewer |
| `submitted_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |
| `ai_verdict` | TEXT | Same value as `status` at the time of review, kept for audit purposes |
| `ai_feedback` | TEXT | Nullable; written feedback from the AI reviewer |
| `ai_confidence` | REAL | Nullable; 0–1 confidence reported by the AI reviewer |
| `ai_reviewed_at` | TEXT | Nullable; timestamp of the AI review |

## Indexes

- `idx_submissions_user_id` on `submissions(user_id)`
- `idx_submissions_lab_id` on `submissions(lab_id)`
