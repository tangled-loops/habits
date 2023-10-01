import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const client = postgres(`${process.env.DATABASE_URL}`);

// migrate(drizzle(client), { migrationsFolder: './server/db/migrations' })

export const db: PostgresJsDatabase = drizzle(client);
