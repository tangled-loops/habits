import { days, selectedDays } from "@/server/db/schema";
import { HasDB } from ".";
import { eq } from "drizzle-orm";

export async function selectedDaysFor({ db, habitId }: HasDB & { habitId: string }) {
  return (
    await db
      .select({ name: days.name })
      .from(days)
      .innerJoin(selectedDays, eq(days.id, selectedDays.dayId))
      .where(eq(selectedDays.habitId, habitId))
  ).map((day) => day.name)
}

export async function selectedDaysByHabit({ db }: HasDB) {
  const result = await db
    .select({ name: days.name, habitId: selectedDays.habitId })
    .from(days)
    .innerJoin(selectedDays, eq(days.id, selectedDays.dayId))
    .groupBy(days.name, selectedDays.habitId)
  return result.reduce((n: Record<string, string[]>, p) => {
    if (n[p.habitId]) {
      n[p.habitId].push(p.name)
      return n
    }
    n[p.habitId] = [p.name]
    return n
  }, {})
}