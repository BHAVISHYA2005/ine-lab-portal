import { AppError } from '../middleware/error.js';

export async function listLabs(db) {
  const { results } = await db.prepare('SELECT * FROM labs ORDER BY id ASC').all();
  return results;
}

export async function getLab(db, id) {
  const lab = await db.prepare('SELECT * FROM labs WHERE id = ?').bind(id).first();
  if (!lab) throw new AppError(404, 'Lab not found');
  return lab;
}
