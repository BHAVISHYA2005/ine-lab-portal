import express from 'express';
import authRoutes from './routes/auth.js';
import labRoutes from './routes/labs.js';
import submissionRoutes from './routes/submissions.js';
import { errorHandler } from './middleware/error.js';

const app = express();

app.use((req, res, next) => {
  const origin = req.get('origin');
  const allowed = origin === 'http://localhost:5173' || origin === 'http://127.0.0.1:5173' || /^https:\/\/[^/]+\.pages\.dev$/.test(origin ?? '');
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

// Worker requests arrive with a parsed body; regular Node requests use Express's parser.
app.use((req, res, next) => {
  if (req.body !== undefined) return next();
  return express.json({ limit: '128kb' })(req, res, next);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/submissions', submissionRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

export default app;
export { app };
