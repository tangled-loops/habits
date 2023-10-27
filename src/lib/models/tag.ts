import { eq } from 'drizzle-orm';

import { HasDB } from '.';

import { habitsTags, tags } from '@/server/db/schema';

export async function tagsFor({ db, habitId }: HasDB & { habitId: string }) {
  return await db
    .select({ id: tags.id, name: tags.name, habitId: habitsTags.habitId })
    .from(tags)
    .innerJoin(habitsTags, eq(tags.id, habitsTags.tagId))
    .where(eq(habitsTags.habitId, habitId))
    .groupBy(tags.id, habitsTags.habitId);
}

export async function tagNamesFor({
  db,
  habitId,
}: HasDB & { habitId: string }) {
  const tags = await tagsFor({ db, habitId });
  return tags.map((t) => t.name);
}

export async function tagsForHabits({ db }: HasDB) {
  const tagsResult = await db
    .select({ name: tags.name, habitId: habitsTags.habitId })
    .from(tags)
    .innerJoin(habitsTags, eq(tags.id, habitsTags.tagId))
    .groupBy(tags.id, habitsTags.habitId);

  return tagsResult.reduce((prv: Record<string, string[]>, nxt) => {
    if (prv[nxt.habitId]) {
      prv[nxt.habitId].push(nxt.name);
    } else {
      prv[nxt.habitId] = [nxt.name];
    }
    return prv;
  }, {});
}
