import { Color, colors } from '@/lib/models/habit';
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
import { z } from 'zod';

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
 * @mark users
 */

export type Role = 'standard' | 'subscriber' | 'admin';

interface UserDefaults {
  days: string[],
  color: Color,
  journalResponseRequired: number,
  hideSidebarByDefault: number,
}

export const userDefaultsSchema = z.object({
  days: z.array(z.string()),
  color: z.enum(['red', 'green', 'blue', 'orange', 'purple']),
  journalResponseRequired: z.coerce.number(),
  hideSidebarByDefault: z.coerce.number(),
})

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

export const usersRelations = relations(users, ({ many }) => ({
  tags: many(habitsTags),
  responses: many(responses),
  selectedDays: many(selectedDays),
  journals: many(journals)
}));

/**
 * @mark habits
 */

export const habits = pgTable('habits', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  goal: integer('goal').notNull().default(1),
  goalCode: varchar('goal_code').notNull().default('Times'),
  color: varchar('color'),
  icon: varchar('icon'),
  notes: text('notes'),
  frequency: varchar('frequency').notNull(),
  totalResponseCount: integer('total_response_count').notNull().default(0),
  userId: uuid('user_id').notNull().references(() => users.id),
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
  tags: many(habitsTags),
  responses: many(responses),
  selectedDays: many(selectedDays),
  journals: many(journals)
}));

export const days = pgTable('days', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  abbrev: varchar('abbrev').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Day = typeof days.$inferSelect;
export type NewDay = typeof days.$inferInsert;

export const daysSchema = createSelectSchema(days);
export const newDaySchema = createInsertSchema(days);

export const selectedDays = pgTable('selected_days', {
  dayId: uuid('day_id').notNull().references(() => days.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  habitId: uuid('habit_id').notNull().references(() => habits.id),
}, (selection) => ({
  compoundKey: primaryKey(selection.dayId, selection.habitId, selection.userId),
}))

export const journals = pgTable('journals', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  habitId: uuid('habit_id').notNull().references(() => habits.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
})

export type Journal = typeof journals.$inferSelect;
export type NewJournal = typeof journals.$inferInsert;

export const journalsSchema = createSelectSchema(journals);
export const newJournalSchema = createInsertSchema(journals);

export const responses = pgTable('responses', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habits.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
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
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
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