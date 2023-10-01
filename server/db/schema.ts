import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { AdapterAccount } from 'next-auth/adapters';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('user', {
  id: uuid('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull().default(''),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  roleId: uuid('role_id').references(() => roles.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

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

export const roles = pgTable('roles', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  name: varchar('name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const habits = pgTable('habits', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  title: varchar('title').notNull(),
  description: text('description'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

const insertUserSchema = createInsertSchema(habits);

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  responses: many(responses),
}));

/**
 * Not sure yet how the responses should look
 * @todo refine the response structure as the features become more developed
 */
export const responses = pgTable('responses', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  value: text('value').notNull(),
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habits.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const responsesRelations = relations(responses, ({ one, many }) => ({
  habit: one(habits, {
    fields: [responses.habitId],
    references: [habits.id],
  }),
}));
