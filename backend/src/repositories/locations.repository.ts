import { db } from '../db/client';
import { locations } from '../db/schema/locations';
import { eq } from 'drizzle-orm';

export const locationsRepository = {
  async findAll() {
    return db.select().from(locations);
  },

  async create(data: typeof locations.$inferInsert) {
    const result = await db.insert(locations).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<typeof locations.$inferInsert>) {
    const result = await db.update(locations).set(data).where(eq(locations.id, id)).returning();
    return result[0] ?? null;
  },

  async remove(id: string) {
    const result = await db.delete(locations).where(eq(locations.id, id)).returning();
    return result[0] ?? null;
  },
};