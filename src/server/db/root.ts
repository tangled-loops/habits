import { neon, neonConfig } from '@neondatabase/serverless';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { drizzle as neonrizzl } from 'drizzle-orm/neon-http';
import { drizzle as lrizzl, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { registerService } from '../register-service';
import * as schema from './schema';

export type PostgresDatabase =
  | PostgresJsDatabase<typeof schema>
  | NeonHttpDatabase<typeof schema>;

let db: PostgresJsDatabase<typeof schema> | NeonHttpDatabase<typeof schema>;
if (
  process.env.NODE_ENV === 'production' ||
  process.env.USE_PROD_IN_DEV === 'yes'
) {
  neonConfig.fetchConnectionCache = true;
  db = neonrizzl(neon(process.env.PRODUCTION_DATABASE_URL!), { schema });
} else {
  db = registerService('db', () =>
    lrizzl(postgres(process.env.DATABASE_URL!), { logger: true, schema }),
  );
}

export { db };
