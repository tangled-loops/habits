import { relations } from 'drizzle-orm';
import {
  integer,
  json,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { AdapterAccount } from 'next-auth/adapters';

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

export type Role = 'standard' | 'admin';

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

/**
 * @mark Habits
 */

export type HabitJournalEntry = {
  notes: string;
  createdAt: Date;
}

export type HabitJournal = {
  entries: Array<HabitJournalEntry>;
}

export const habits = pgTable('habits', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  notes: text('notes'),
  journal: json('journal').$type<HabitJournal>(),
  selectedDays: json('selected_days').$type<Array<string>>(),
  frequency: varchar('frequency').notNull(),
  goal: integer('goal').notNull().default(1),
  color: varchar('color'),
  icon: varchar('icon'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  responses: many(responses),
  tags: many(habitsTags),
}));

/**
 * This is going to be extremely basic, each record represents a response.
 * I think it makes sense to have this as a table though since it will be
 * easier to do statistics this way. They will be non-editable and each one
 * represents a unique response to a habit being tracked, this also will 
 * allow me to expand the feature set if I want to down the line.
 */
export const responses = pgTable('responses', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habits.id)
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;

export const responseSchema = createSelectSchema(responses);
export const newResponseSchema = createInsertSchema(responses);

export const responsesRelations = relations(responses, ({ one }) => ({
  habit: one(habits, {
    fields: [responses.habitId],
    references: [habits.id],
  }),
}));

export const tags = pgTable('tags', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull()
    .defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export const tagSchema = typeof tags.$inferSelect;
export const newTagSchema = typeof tags.$inferInsert;

export const habitsTags = pgTable('habits_tags', {
  tagId: uuid('tag_id').notNull().references(() => tags.id),
  habitId: uuid('habit_id').notNull().references(() => habits.id)
}, (habitTag) => ({
  compoundKey: primaryKey(habitTag.tagId, habitTag.habitId),
}))