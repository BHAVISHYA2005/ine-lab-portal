PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'student',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS labs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('linux', 'docker', 'networking', 'security')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  description TEXT NOT NULL,
  starter_code TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  lab_id INTEGER NOT NULL REFERENCES labs(id),
  solution TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_lab_id ON submissions(lab_id);

INSERT INTO labs (title, category, difficulty, description, starter_code)
SELECT 'Linux Permissions & Processes', 'linux', 'beginner',
  'Inspect running processes and apply least-privilege file permissions from the command line.',
  '# Start here\nps aux\n# Add your commands below'
WHERE NOT EXISTS (SELECT 1 FROM labs WHERE title = 'Linux Permissions & Processes');

INSERT INTO labs (title, category, difficulty, description, starter_code)
SELECT 'Containerize a Web Service', 'docker', 'intermediate',
  'Write a Dockerfile for a small web service and run it with a reproducible container configuration.',
  'FROM node:22-alpine\n# Add the service setup here'
WHERE NOT EXISTS (SELECT 1 FROM labs WHERE title = 'Containerize a Web Service');

INSERT INTO labs (title, category, difficulty, description, starter_code)
SELECT 'Trace a Network Request', 'networking', 'intermediate',
  'Use standard networking tools to trace a request, identify each hop, and explain the response path.',
  '# Capture your investigation notes here\ntraceroute example.com'
WHERE NOT EXISTS (SELECT 1 FROM labs WHERE title = 'Trace a Network Request');

INSERT INTO labs (title, category, difficulty, description, starter_code)
SELECT 'Detect Suspicious Authentication Logs', 'security', 'advanced',
  'Analyze authentication events and identify indicators of a brute-force attempt using a repeatable workflow.',
  '# Paste your detection query or script here'
WHERE NOT EXISTS (SELECT 1 FROM labs WHERE title = 'Detect Suspicious Authentication Logs');
