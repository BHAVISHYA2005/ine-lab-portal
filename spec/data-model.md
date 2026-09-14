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

## `submissions`

| Column | Type | Constraints |
| --- | --- | --- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `user_id` | INTEGER | NOT NULL; REFERENCES `users(id)` |
| `lab_id` | INTEGER | NOT NULL; REFERENCES `labs(id)` |
| `solution` | TEXT | NOT NULL |
| `status` | TEXT | DEFAULT `'pending'` |
| `submitted_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

## Indexes

- `idx_submissions_user_id` on `submissions(user_id)`
- `idx_submissions_lab_id` on `submissions(lab_id)`
