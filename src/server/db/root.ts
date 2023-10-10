// import postgres from 'postgres';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from './schema';

// const client = new Client({
//   connectionString: process.env.DATABASE_URL!,
// });

const pool = new Pool({
  max: 50,
  connectionString: process.env.DATABASE_URL!
})
const client = await pool.connect();
export const db = drizzle(client, { logger: true, schema });
