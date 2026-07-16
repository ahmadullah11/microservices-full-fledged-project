import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { loginService, signUpService } from '../services/index.js';
import { validation } from '../utils/validation.js';
import { LoginSchema, SignUpSchema } from '../validation/index.js';

export const signUpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = await validation(SignUpSchema, req.body);

    const { user, token } = await signUpService(name, email, password);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User Created Successfully',
      token,
      data: {
        name: user?.name,
        email: user?.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = await validation(LoginSchema, req.body);

    const { user, token } = await loginService(email, password);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User Loggedin Successfully',
      token,
      data: {
        name: user?.name,
        email: user?.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
