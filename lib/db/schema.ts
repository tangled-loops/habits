import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
 
// declaring enum in database
export const popularityEnum = pgEnum('popularity', ['unknown', 'known', 'popular']);
 
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  first_name: varchar('first_name'),
  last_name: varchar('last_name'),
  email: varchar('email'),

}, (countries) => {
  return {
    nameIndex: uniqueIndex('name_idx').on(countries.name),
  }
});
 