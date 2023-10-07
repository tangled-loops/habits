import type { Config } from 'drizzle-kit';

export default {
  driver: 'pg',
  dbCredentials: {
    connectionString: `${process.env.DATABASE_URL}`,
  },
  schema: './src/server/db/schema.ts',
  out: './src/server/db/migrations',
  verbose: true,
} satisfies Config;
