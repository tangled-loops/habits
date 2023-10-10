// import postgres from 'postgres';
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from './schema';

const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});
 
// const client = postgres(`${process.env.DATABASE_URL}`, { max: 80, debug: true });
await client.connect();
export const db = drizzle(client, { logger: true, schema });
