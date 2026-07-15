import { env } from "./env.js"
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(env.DATABASE_URL!)