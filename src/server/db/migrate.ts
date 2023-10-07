import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const main = async () => {
  const client = postgres(`${process.env.DATABASE_URL}`);
  console.log('Migrate start');
  await migrate(drizzle(client), {
    migrationsFolder: './server/db/migrations',
  });
  console.log('Migrate done');
};

main();
