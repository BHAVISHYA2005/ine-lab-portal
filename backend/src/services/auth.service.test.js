import { describe, expect, it } from 'vitest';
import { jwtVerify } from 'jose';
import { login, signup } from './auth.service.js';

function createFakeDb() {
  const users = [];
  return {
    users,
    prepare(query) {
      return {
        bind(...values) {
          return {
            async first() {
              if (query.includes('SELECT id FROM users')) return users.find((user) => user.email === values[0]) ?? null;
              if (query.includes('WHERE id = ?')) return users.find((user) => user.id === values[0]) ?? null;
              if (query.includes('WHERE email = ?')) return users.find((user) => user.email === values[0]) ?? null;
              return null;
            },
            async run() {
              const user = { id: users.length + 1, email: values[0], password_hash: values[1], role: 'student', created_at: 'now' };
              users.push(user);
              return { meta: { last_row_id: user.id } };
            },
          };
        },
      };
    },
  };
}

describe('auth service', () => {
  it('creates a hashed-password user and verifiable JWT', async () => {
    const db = createFakeDb();
    const result = await signup(db, 'test-secret', 'Student@Example.com', 'password-123');
    const { payload } = await jwtVerify(result.token, new TextEncoder().encode('test-secret'));

    expect(result.user).toMatchObject({ id: 1, email: 'Student@Example.com', role: 'student' });
    expect(db.users[0].password_hash).not.toBe('password-123');
    expect(payload.sub).toBe('1');
  });

  it('rejects invalid credentials', async () => {
    const db = createFakeDb();
    await signup(db, 'test-secret', 'student@example.com', 'password-123');
    await expect(login(db, 'test-secret', 'student@example.com', 'wrong-password')).rejects.toMatchObject({ status: 401 });
  });
});
