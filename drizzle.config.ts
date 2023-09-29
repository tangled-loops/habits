import type { Config } from "drizzle-kit";
 
export default {
  driver: "pg",
  dbCredentials: {
    connectionString: `${process.env.DATABASE_URL}`,
  },
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  verbose: true,
} satisfies Config;