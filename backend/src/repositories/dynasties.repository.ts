import { db } from '../db/client';
import { dynasties } from '../db/schema/dynasties';
import { eq } from 'drizzle-orm';

export const dynastiesRepository = {
  async findAll() {
    return db.select().from(dynasties);
  },

  async create(data: typeof dynasties.$inferInsert) {
    const result = await db.insert(dynasties).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<typeof dynasties.$inferInsert>) {
    const result = await db.update(dynasties).set(data).where(eq(dynasties.id, id)).returning();
    return result[0] ?? null;
  },

  async remove(id: string) {
    const result = await db.delete(dynasties).where(eq(dynasties.id, id)).returning();
    return result[0] ?? null;
  },
};