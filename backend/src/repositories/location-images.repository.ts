import { db } from '../db/client';
import { locationImages } from '../db/schema/location-images';
import { eq } from 'drizzle-orm';

export const locationImagesRepository = {
  async findAllByLocationId(locationId: string) {
    return db.select().from(locationImages).where(eq(locationImages.locationId, locationId));
  },

  async create(data: typeof locationImages.$inferInsert) {
    const result = await db.insert(locationImages).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<typeof locationImages.$inferInsert>) {
    const result = await db.update(locationImages).set(data).where(eq(locationImages.id, id)).returning();
    return result[0] ?? null;
  },

  async remove(id: string) {
    const result = await db.delete(locationImages).where(eq(locationImages.id, id)).returning();
    return result[0] ?? null;
  },

  // Unsets any existing cover for the same location, then sets this one —
  // wrapped in a transaction so the two writes succeed or fail together.
  async setCover(id: string) {
    return db.transaction(async (tx) => {
      const existing = await tx.select().from(locationImages).where(eq(locationImages.id, id));
      const image = existing[0];
      if (!image) {
        return null;
      }

      await tx
        .update(locationImages)
        .set({ isCover: false })
        .where(eq(locationImages.locationId, image.locationId));

      const result = await tx
        .update(locationImages)
        .set({ isCover: true })
        .where(eq(locationImages.id, id))
        .returning();

      return result[0] ?? null;
    });
  },
};
