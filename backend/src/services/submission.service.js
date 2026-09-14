import { AppError } from '../middleware/error.js';

export async function createSubmission(db, userId, labId, solution, aiResult) {
  const result = await db.prepare(
    'INSERT INTO submissions (user_id, lab_id, solution, status, ai_verdict, ai_feedback, ai_confidence, ai_reviewed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    userId,
    labId,
    solution,
    aiResult.verdict,
    aiResult.verdict,
    aiResult.feedback,
    aiResult.confidence,
    new Date().toISOString(),
  ).run();
  return db.prepare('SELECT * FROM submissions WHERE id = ?').bind(result.meta.last_row_id).first();
}

export async function listSubmissions(db, userId) {
  const { results } = await db.prepare(
    'SELECT submissions.*, labs.title AS lab_title FROM submissions JOIN labs ON labs.id = submissions.lab_id WHERE submissions.user_id = ? ORDER BY submitted_at DESC'
  ).bind(userId).all();
  return results;
}

export async function getSubmission(db, userId, id) {
  const submission = await db.prepare(
    'SELECT submissions.*, labs.title AS lab_title FROM submissions JOIN labs ON labs.id = submissions.lab_id WHERE submissions.id = ? AND submissions.user_id = ?'
  ).bind(id, userId).first();
  if (!submission) throw new AppError(404, 'Submission not found');
  return submission;
}
