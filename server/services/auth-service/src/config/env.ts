import 'dotenv/config';

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
};
