import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { usersTable } from '../schema/index.js';

export const findEmail = async (email: string) => {
  return await db.select().from(usersTable).where(eq(usersTable.email, email));
};

// SELECT * FROM table_name WHERE id = xyz // row []
