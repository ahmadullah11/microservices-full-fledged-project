import type { Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';

export const errorHandler = (err: Error, req: Request, res: Response) => {
  const error = err;

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Internal server error',
  });
};
