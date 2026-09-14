import express from 'express';
import { z } from 'zod';
import { getDb, getEnv } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { validate } from '../middleware/validate.js';
import { getCurrentUser, login, signup } from '../services/auth.service.js';

const credentialsSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

const router = express.Router();

router.post('/signup', validate(credentialsSchema), asyncHandler(async (req, res) => {
  const env = getEnv(req);
  const result = await signup(getDb(req), env.JWT_SECRET, req.body.email, req.body.password);
  res.status(201).json(result);
}));

router.post('/login', validate(credentialsSchema), asyncHandler(async (req, res) => {
  const env = getEnv(req);
  const result = await login(getDb(req), env.JWT_SECRET, req.body.email, req.body.password);
  res.json(result);
}));

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  res.json({ user: await getCurrentUser(getDb(req), req.user.id) });
}));

export default router;
