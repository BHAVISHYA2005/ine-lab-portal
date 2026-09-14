import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { AppError } from '../middleware/error.js';

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  created_at: user.created_at,
});

export async function createToken(user, secret) {
  return new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(secret));
}

export async function signup(db, secret, email, password) {
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) throw new AppError(409, 'An account with that email already exists');
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await db.prepare(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)'
  ).bind(email, passwordHash).run();
  const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(result.meta.last_row_id).first();
  return { token: await createToken(user, secret), user: publicUser(user) };
}

export async function login(db, secret, email, password) {
  const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError(401, 'Invalid email or password');
  }
  return { token: await createToken(user, secret), user: publicUser(user) };
}

export async function getCurrentUser(db, userId) {
  const user = await db.prepare('SELECT id, email, role, created_at FROM users WHERE id = ?').bind(userId).first();
  if (!user) throw new AppError(404, 'User not found');
  return user;
}
