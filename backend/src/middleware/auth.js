import { jwtVerify } from 'jose';
import { getEnv } from '../db.js';
import { AppError } from './error.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.get('authorization') ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new AppError(401, 'Authentication required');

    const secret = getEnv(req).JWT_SECRET;
    if (!secret) throw new AppError(500, 'JWT secret is not configured');
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    req.user = { id: Number(payload.sub), email: payload.email, role: payload.role };
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(401, 'Invalid or expired token'));
  }
}
