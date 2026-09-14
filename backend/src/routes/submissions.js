import express from 'express';
import { z } from 'zod';
import { getDb, getEnv } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { validate } from '../middleware/validate.js';
import { reviewSubmission } from '../services/ai.service.js';
import { getLab } from '../services/lab.service.js';
import { createSubmission, getSubmission, listSubmissions } from '../services/submission.service.js';

const createSchema = z.object({
  labId: z.coerce.number().int().positive(),
  solution: z.string().trim().min(1).max(100_000),
});
const idSchema = z.object({ id: z.coerce.number().int().positive() });
const router = express.Router();
router.use(requireAuth);

router.post('/', validate(createSchema), asyncHandler(async (req, res) => {
  const db = getDb(req);
  const lab = await getLab(db, req.body.labId);
  const aiResult = await reviewSubmission(getEnv(req), { lab, solution: req.body.solution });
  const submission = await createSubmission(db, req.user.id, lab.id, req.body.solution, aiResult);
  res.status(201).json({ submission });
}));

router.get('/', asyncHandler(async (req, res) => {
  res.json({ submissions: await listSubmissions(getDb(req), req.user.id) });
}));

router.get('/:id', validate(idSchema, 'params'), asyncHandler(async (req, res) => {
  res.json({ submission: await getSubmission(getDb(req), req.user.id, req.params.id) });
}));

export default router;
