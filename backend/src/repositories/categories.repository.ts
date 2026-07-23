import { db } from '../db/client';
import { categories } from '../db/schema/categories';
import { eq } from 'drizzle-orm';

type Category = typeof categories.$inferSelect;

export const categoriesRepository = {
  async findAll() {
    return db.select().from(categories);
  },

  async create(data: typeof categories.$inferInsert) {
    const result = await db.insert(categories).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<typeof categories.$inferInsert>): Promise<Category | null> {
    const result = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return result[0] ?? null;
  },

  async remove(id: string): Promise<Category | null> {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result[0] ?? null;
  },
};