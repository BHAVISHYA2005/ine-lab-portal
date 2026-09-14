export function getDb(req) {
  const db = req.env?.DB ?? req.app?.locals?.env?.DB;
  if (!db) {
    throw new Error('D1 database binding is not configured');
  }
  return db;
}

export function getEnv(req) {
  return req.env ?? req.app?.locals?.env ?? {};
}
