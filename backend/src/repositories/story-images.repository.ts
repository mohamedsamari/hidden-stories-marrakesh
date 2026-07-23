import { db } from '../db/client';
import { storyImages } from '../db/schema/story_images';
import { eq } from 'drizzle-orm';

export const storyImagesRepository = {
  async findAllByStoryId(storyId: string) {
    return db.select().from(storyImages).where(eq(storyImages.storyId, storyId));
  },

  async create(data: typeof storyImages.$inferInsert) {
    const result = await db.insert(storyImages).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<typeof storyImages.$inferInsert>) {
    const result = await db.update(storyImages).set(data).where(eq(storyImages.id, id)).returning();
    return result[0] ?? null;
  },

  async remove(id: string) {
    const result = await db.delete(storyImages).where(eq(storyImages.id, id)).returning();
    return result[0] ?? null;
  },
};
