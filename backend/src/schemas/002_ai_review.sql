ALTER TABLE labs ADD COLUMN rubric TEXT;
ALTER TABLE submissions ADD COLUMN ai_verdict TEXT;
ALTER TABLE submissions ADD COLUMN ai_feedback TEXT;
ALTER TABLE submissions ADD COLUMN ai_confidence REAL;
ALTER TABLE submissions ADD COLUMN ai_reviewed_at TEXT;
