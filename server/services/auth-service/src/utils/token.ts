import jwt from "jsonwebtoken"
import type { StringValue } from "ms";
import { env } from "../config/env.js";
import type { UserType } from "../types/index.js";

export const generateToken = (user: UserType) => {
      const token = jwt.sign(
          {
            id: user?.id, // undefined
            name: user?.name,
            email: user ?.email,
          },
          env.JWT_SECRET!,
          {
            expiresIn: env.JWT_EXPIRES as StringValue,
          },
        );

        return token;
}