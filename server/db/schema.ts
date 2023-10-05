import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { AdapterAccount } from 'next-auth/adapters';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

/**
 * @mark NextAuth Tables
 */

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (token) => ({
    compoundKey: primaryKey(token.identifier, token.token),
  }),
);

/**
 * @mark Users
 */

export type Role = 'standard' | 'paid' | 'admin' | 'superadmin'

export const users = pgTable('user', {
  id: uuid('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull().default(''),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: varchar('role').$type<Role>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

// export const usersRelations = relations(users, ({ one, many }) => ({
//   role: one(roles, {
//     fields: [users.roleId],
//     references: [roles.id],
//   }),
// }));

/**
 * @mark Habits
 */

export const habits = pgTable('habits', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  title: varchar('title').notNull(),
  description: text('description'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;

export const habitSchema = createSelectSchema(habits);
export const newHabitSchema = createInsertSchema(habits);

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  responses: many(responses),
}));


export type ResponseType = 'completion' | 'diary' | 'scale'

/**
 * Not sure yet how the responses should look
 * @todo refine the response structure as the features become more developed
 */
export const responses = pgTable('responses', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  value: text('value').notNull(),
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habits.id).notNull(),
  responseType: varchar('response_type').$type<ResponseType>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;

export const responseSchema = createSelectSchema(responses);
export const newResponseSchema = createInsertSchema(responses);

export const responsesRelations = relations(responses, ({ one, many }) => ({
  habit: one(habits, {
    fields: [responses.habitId],
    references: [habits.id],
  }),
}));

export const tags = pgTable('tags', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  userId: uuid('user_id').references(() => users.id).notNull().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export const tagSchema = typeof tags.$inferSelect;
export const newTagSchema = typeof tags.$inferInsert;