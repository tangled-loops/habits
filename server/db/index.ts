import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema'

const client = postgres(`${process.env.DATABASE_URL}`);

export const db: PostgresJsDatabase = drizzle(client, { schema });

/**
 * @todo research into when to run migrations if at all, seems weird to 
 *  run it every time this file is called
 */
// import { migrate } from 'drizzle-orm/postgres-js/migrator';
// migrate(drizzle(client), { migrationsFolder: './server/db/migrations' })
