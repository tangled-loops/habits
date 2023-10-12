import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { registerService } from '../register-service';
// import { Pool } from "pg";
import * as schema from './schema';

// const client = new Client({
//   connectionString: process.env.DATABASE_URL!,
// });

export const db = registerService('db', () =>
  drizzle(postgres(process.env.DATABASE_URL!), { logger: true, schema })
);
