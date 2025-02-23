import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/ValidationError';
import { NotFoundError } from '../errors/NotFoundError';
import { ConflictError } from '../errors/ConflictError';

interface CustomError extends Error {
  status?: number;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);

  if (err instanceof ValidationError || err instanceof NotFoundError || err instanceof ConflictError) {
    res.status(err.status).json({ error: err.message });
  } else {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  }
}
