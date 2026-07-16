import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/AppError.js';

// Generics
// Utility Types

export const validation = (validationSchema: any, data: any) => {
  const schema = validationSchema.safeParse(data);

  if (!schema.success) {
    throw new AppError(schema.error.message, StatusCodes.BAD_REQUEST);
  }

  return schema.data;
};
