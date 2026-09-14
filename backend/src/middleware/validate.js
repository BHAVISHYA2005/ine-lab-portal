import { AppError } from './error.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(new AppError(422, 'Validation failed', result.error.flatten()));
    }
    req[source] = result.data;
    next();
  };
}
