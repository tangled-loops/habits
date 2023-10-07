import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '~/db/schema';

const main = async () => {
  const client = postgres(`${process.env.DATABASE_URL}`);
  const db = drizzle(client, { schema });
  const data: Array<schema.NewTag> = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      name: faker.word.adjective(),
    });
  }

  console.log('Seed start');
  await db.insert(schema.tags).values(data);
  console.log('Seed done');
};

main();
