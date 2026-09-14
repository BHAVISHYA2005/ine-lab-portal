export class AppError extends Error {
  constructor(status, message, details = undefined) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.details = details;
  }
}

export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = Number.isInteger(error.status) ? error.status : 500;
  const payload = { error: status === 500 ? 'Internal server error' : error.message };
  if (error.details) payload.details = error.details;
  if (status === 500) console.error(error);
  res.status(status).json(payload);
}
