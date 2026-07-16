import type { NextFunction, Request, Response } from 'express';
import { LoginSchema, SignUpSchema } from '../validation/index.js';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../error/AppError.js';
import { db } from '../config/db.js';
import { usersTable } from '../schema/index.js';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js';
import type { StringValue } from 'ms';
import { email } from 'zod';
import { validation } from '../utils/validation.js';
import { findEmail } from '../repository/index.js';

const signUpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = validation(SignUpSchema, req.body)

    const userExists = findEmail(email)

    if (userExists) {
      throw new AppError('User Already Exists', StatusCodes.CONFLICT);
    }

    const hashedPassword = await argon2.hash(password);

    const user: typeof usersTable.$inferInsert = {
      name,
      email,
      password: hashedPassword,
    };

    const [newUser] = await db.insert(usersTable).values(user).returning({
      id: usersTable.id,
      name: usersTable.id,
      email: usersTable.email,
    });

    // Access Tokens
    // Refresh Tokens

    const token = jwt.sign(
      {
        id: newUser?.id, // undefined
        name: newUser?.name,
        email: newUser?.email,
      },
      env.JWT_SECRET!,
      {
        expiresIn: env.JWT_EXPIRES as StringValue,
      },
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User Created Successfully',
      token,
      data: {
        name: newUser?.name,
        email: newUser?.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = await validation(LoginSchema, req.body);

    const [userExists] = await findEmail(email)

    if (!userExists) {
      throw new AppError('Invalid Credentials', StatusCodes.UNAUTHORIZED);
    }

    const isPasswordCompared = await argon2.verify(userExists.password, password);

    if (!isPasswordCompared) {
      throw new AppError('Invalid Credentials', StatusCodes.UNAUTHORIZED);
    }

    // Access Tokens
    // Refresh Tokens

    const token = jwt.sign(
      {
        id: userExists?.id, // undefined
        name: userExists?.name,
        email: userExists?.email,
      },
      env.JWT_SECRET!,
      {
        expiresIn: env.JWT_EXPIRES as StringValue,
      },
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User Loggedin Successfully',
      token,
      data: {
        name: userExists?.name,
        email: userExists?.email,
      },
    });
  } catch (error) {
    next(error);
  }
};