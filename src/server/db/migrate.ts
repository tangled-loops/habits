import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { conn } from '../../../drizzle.config';

const main = async () => {
  const client = postgres(`${conn}`);
  console.log('Migrate start');
  await migrate(drizzle(client), {
    migrationsFolder: './src/server/db/migrations',
  });
  console.log('Migrate done');
  process.exit(0)
};

main();
