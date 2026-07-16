import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/AppError.js';
import { findEmail } from '../repository/index.js';
import { hashPassword, verifyPassword } from '../utils/password-helpers.js';
import { usersTable } from '../schema/index.js';
import { db } from '../config/db.js';
import { generateToken } from '../utils/token.js';

export const signUpService = async (name: string, email: string, password: string) => {
  const userExists = await findEmail(email);

  if (userExists) {
    throw new AppError('User Already Exists', StatusCodes.CONFLICT);
  }

  const hashedPassword = await hashPassword(password);

  const user: typeof usersTable.$inferInsert = {
    name,
    email,
    password: hashedPassword,
  };

  const [newUser] = await db.insert(usersTable).values(user).returning({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
  });

  // Access Tokens
  // Refresh Tokens

  if (!newUser) {
    throw new AppError('Failed to Create The User', StatusCodes.BAD_REQUEST);
  }

  const token = generateToken(newUser);

  return {
    user: newUser,
    token,
  };
};

// +++++++++++++++++++++++++++++++++---------  (loginService) 


export const loginService = async (email: string, password: string) => {
  const [userExists] = await findEmail(email);

  if (!userExists) {
    throw new AppError('Invalid Credentials', StatusCodes.UNAUTHORIZED);
  }

  const isPasswordCompared = await verifyPassword(userExists.password, password);

  if (!isPasswordCompared) {
    throw new AppError('Invalid Credentials', StatusCodes.UNAUTHORIZED);
  }

  // Access Tokens
  // Refresh Tokens

  const token = generateToken(userExists);

  return {
    user: userExists,
    token,
  };
};
