import express from 'express';
import { z } from 'zod';
import { getDb, getEnv } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { validate } from '../middleware/validate.js';
import { generateQuizQuestion } from '../services/ai.service.js';
import { getLab, listLabs } from '../services/lab.service.js';

const idSchema = z.object({ id: z.coerce.number().int().positive() });
const router = express.Router();
router.use(requireAuth);

router.get('/', asyncHandler(async (req, res) => {
  res.json({ labs: await listLabs(getDb(req)) });
}));

router.get('/:id', validate(idSchema, 'params'), asyncHandler(async (req, res) => {
  res.json({ lab: await getLab(getDb(req), req.params.id) });
}));

router.get('/:id/question', validate(idSchema, 'params'), asyncHandler(async (req, res) => {
  const lab = await getLab(getDb(req), req.params.id);
  res.json(await generateQuizQuestion(getEnv(req), lab));
}));

export default router;
