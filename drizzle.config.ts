import type { Config } from 'drizzle-kit';

const conn = 
  process.env.NODE_ENV === 'production' 
    ? process.env.PRODUCTION_DATABASE_URL
    : process.env.DATABASE_URL

console.log(conn)

export default {
  driver: 'pg',
  dbCredentials: {
    connectionString: `${conn}`,
  },
  schema: './src/server/db/schema.ts',
  out: './src/server/db/migrations/',
  verbose: true,
} satisfies Config;
