import { db } from '../db/client';
import { stories } from '../db/schema/stories';
import { eq, and, or, ilike, asc, desc, SQL } from 'drizzle-orm';

export interface StoryFilters {
  categoryId?: string;
  historicalPeriodId?: string;
  dynastyId?: string;
  century?: number;
  search?: string;
}

export interface SortOptions {
  sortBy?: 'titleEn' | 'createdAt' | 'century';
  order?: 'asc' | 'desc';
}

const sortableColumns = {
  titleEn: stories.titleEn,
  createdAt: stories.createdAt,
  century: stories.century,
};

export const storiesRepository = {
  async findAll(limit: number, offset: number, filters: StoryFilters,  sort: SortOptions) {
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


    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      const searchCondition = or(
        ilike(stories.titleEn, searchPattern),
        ilike(stories.titleFr, searchPattern),
        ilike(stories.shortDescriptionEn, searchPattern),
        ilike(stories.shortDescriptionFr, searchPattern),
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    const column = sortableColumns[sort.sortBy ?? 'createdAt'];
    const orderFn = sort.order === 'asc' ? asc : desc;

    return db
      .select()
      .from(stories)
      .where(and(...conditions))
      .orderBy(orderFn(column))
      .limit(limit)
      .offset(offset);
  },

  async findById(id: string) {
    const result = await db.select().from(stories).where(eq(stories.id, id));
    return result[0] ?? null;
  },
};