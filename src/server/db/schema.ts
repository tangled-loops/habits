import { relations } from 'drizzle-orm';
import {
  boolean,
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

interface UserDefaults {
  days: string[],

}

export const users = pgTable('user', {
  id: uuid('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull().default(''),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: varchar('role').$type<Role>(),
  defaults: json('defaults').$type<UserDefaults>(),
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
  goal: integer('goal').notNull().default(1),
  color: varchar('color'),
  icon: varchar('icon'),
  notes: text('notes'),
  journal: json('journal').$type<HabitJournal>(),
  frequency: varchar('frequency').notNull(),
  selectedDays: json('selected_days').$type<Array<string>>(),
  responseCount: integer('response_count').notNull().default(0),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  deleted: boolean('deleted').default(false),
  archived: boolean('archived').default(false),
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