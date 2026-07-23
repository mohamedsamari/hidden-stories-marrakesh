import { db } from '../db/client';
import { stories } from '../db/schema/stories';
import { eq, and, or, ilike, asc, desc, SQL } from 'drizzle-orm';

export interface StoryFilters {
  categoryId?: string;
  historicalPeriodId?: string;
  dynastyId?: string;
  century?: number;
  search?: string;
  isPublished?: boolean;
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

type Story = typeof stories.$inferSelect;

function buildFilterConditions(filters: StoryFilters): SQL[] {
  const conditions: SQL[] = [];

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

  return conditions;
}

export const storiesRepository = {
  async findAll(limit: number, offset: number, filters: StoryFilters, sort: SortOptions) {
    const conditions = [eq(stories.isPublished, true), ...buildFilterConditions(filters)];

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

  // Same as findAll but without the forced isPublished=true filter, so admins
  // can see drafts. isPublished can still be passed explicitly to narrow down.
  async findAllAdmin(limit: number, offset: number, filters: StoryFilters, sort: SortOptions) {
    const conditions = buildFilterConditions(filters);
    if (filters.isPublished !== undefined) {
      conditions.push(eq(stories.isPublished, filters.isPublished));
    }

    const column = sortableColumns[sort.sortBy ?? 'createdAt'];
    const orderFn = sort.order === 'asc' ? asc : desc;

    const query = db.select().from(stories);
    const filteredQuery = conditions.length ? query.where(and(...conditions)) : query;

    return filteredQuery.orderBy(orderFn(column)).limit(limit).offset(offset);
  },

  async findById(id: string): Promise<Story | null> {
    const result = await db.select().from(stories).where(eq(stories.id, id));
    return result[0] ?? null;
  },

  async create(data: typeof stories.$inferInsert) {
    const result = await db.insert(stories).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<typeof stories.$inferInsert>): Promise<Story | null> {
    const result = await db
      .update(stories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(stories.id, id))
      .returning();
    return result[0] ?? null;
  },

  async remove(id: string): Promise<Story | null> {
    const result = await db.delete(stories).where(eq(stories.id, id)).returning();
    return result[0] ?? null;
  },

  async setPublished(id: string, isPublished: boolean): Promise<Story | null> {
    const result = await db
      .update(stories)
      .set({ isPublished, updatedAt: new Date() })
      .where(eq(stories.id, id))
      .returning();
    return result[0] ?? null;
  },
};