import type { Request, Response} from "express"
import { SignUpSchema } from "../validation/index.js"
import { AppError } from "../error/AppError.js";
import { StatusCodes } from "http-status-codes";
import { email } from 'zod';
import { db } from "../config/db.js";
import { eq } from "drizzle-orm";
import { usersTable } from "../schema/index.js";

export const sighnUpController = async (req: Request, res: Response ) => {
    const schema = SignUpSchema.safeParse(req.body);

    if(!schema){
        throw new AppError(schema.error.message, StatusCodes.NOT_ACCEPTABLE)
    }

    const { name, email, password } = schema.data;

    const userExist = await 
    db.select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

    if(userExist){
        throw new AppError("User Already Exist", StatusCodes.CONFLICT)
    }
}