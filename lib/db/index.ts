import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

// for migrations
const migrationClient = postgres("postgres://habits:password@0.0.0.0:5432/habits_dev", { max: 1 });
// migrate(drizzle(migrationClient), ...)
 
// for query purposes
const queryClient = postgres("postgres://habits:password@0.0.0.0:5432/habits_dev");
export const db: PostgresJsDatabase = drizzle(queryClient);
// await db.select().from(...)...