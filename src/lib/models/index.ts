import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import * as schema from '~/db/schema';

export type DB = PostgresJsDatabase<typeof schema>;

export interface HasDB {
  db: DB;
}
