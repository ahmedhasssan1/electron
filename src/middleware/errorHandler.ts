import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }

  // TypeORM errors
  if (err.name === 'QueryFailedError') {
    res.status(409).json({
      message: 'Database operation failed',
    });
    return;
  }

  if (err.name === 'EntityNotFoundError') {
    res.status(404).json({
      message: 'Resource not found',
    });
    return;
  }

  // Fallback
  console.error('Unexpected error:', err);
  res.status(500).json({
    message: 'Internal server error',
  });
};
