import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '~/db/schema';
import { days } from '~/db/schema';
import { conn } from '../../../drizzle.config';

const main = async () => {
  const client = postgres(`${conn}`);
  const db = drizzle(client, { schema });
  await db.delete(days)
  const data: schema.NewDay[] = []
  const dayHash: Record<number, { n: string, a: string }> = {
    0: { n: 'Monday', a: 'M' },
    1: { n: 'Tuesday', a: 'T' },
    2: { n: 'Wednsday', a: 'W' },
    3: { n: 'Thursday', a: 'Th' },
    4: { n: 'Friday', a: 'F' },
    5: { n: 'Saturday', a: 'S' },
    6: { n: 'Sunday', a: 'Su' },
  }
  for (let i = 0; i < 7; i++) {
    data.push({
      day: i, 
      name: dayHash[i].n!,
      abbrev: dayHash[i].a!,
    });
  }
  console.log(data)
  console.log('Seed start');
  await db.insert(days).values(data)
  console.log('Seed done');
};

main();
