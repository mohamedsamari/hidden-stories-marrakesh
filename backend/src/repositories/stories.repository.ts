import { db } from '../db/client';
import { stories } from '../db/schema/stories';
import { eq, and, SQL } from 'drizzle-orm';

interface StoryFilters {
  categoryId?: string;
  historicalPeriodId?: string;
  dynastyId?: string;
  century?: number;
}

export const storiesRepository = {
  async findAll(limit: number, offset: number, filters: StoryFilters) {
    const conditions: SQL[] = [eq(stories.isPublished, true)];

    if (filters.categoryId) {
      conditions.push(eq(stories.categoryId, filters.categoryId));
    }
    if (filters.historicalPeriodId) {
      conditions.push(eq(stories.historicalPeriodId, filters.historicalPeriodId));
    }
    if (filters.dynastyId) {
      conditions.push(eq(stories.dynastyId, filters.dynastyId));
    }
    if (filters.century) {
      conditions.push(eq(stories.century, filters.century));
    }

    return db
      .select()
      .from(stories)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);
  },

  async findById(id: string) {
    const result = await db.select().from(stories).where(eq(stories.id, id));
    return result[0] ?? null;
  },
};