import { StatusCodes } from "http-status-codes";
import { AppError } from "../error/AppError.js";

export const validation = (validationSchema: any, data: any) => {
  const result = validationSchema.safeParse(data);

  if (!result.success) {
    throw new AppError(result.error.message, StatusCodes.BAD_REQUEST);
  }

  return result.data;
};