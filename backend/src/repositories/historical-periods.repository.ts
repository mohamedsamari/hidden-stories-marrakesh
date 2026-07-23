import { db } from '../db/client';
import { historicalPeriods } from '../db/schema/historical-periods';
import { eq } from 'drizzle-orm';

type HistoricalPeriod = typeof historicalPeriods.$inferSelect;

export const historicalPeriodsRepository = {
  async findAll() {
    return db.select().from(historicalPeriods);
  },

  async create(data: typeof historicalPeriods.$inferInsert) {
    const result = await db.insert(historicalPeriods).values(data).returning();
    return result[0];
  },

  async update(
    id: string,
    data: Partial<typeof historicalPeriods.$inferInsert>,
  ): Promise<HistoricalPeriod | null> {
    const result = await db
      .update(historicalPeriods)
      .set(data)
      .where(eq(historicalPeriods.id, id))
      .returning();
    return result[0] ?? null;
  },

  async remove(id: string): Promise<HistoricalPeriod | null> {
    const result = await db.delete(historicalPeriods).where(eq(historicalPeriods.id, id)).returning();
    return result[0] ?? null;
  },
};