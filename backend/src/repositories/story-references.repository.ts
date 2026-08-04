import { db } from '../db/client';
import { storyReferences } from '../db/schema/story-references';
import { eq } from 'drizzle-orm';

export const storyReferencesRepository = {
  async findAllByStoryId(storyId: string) {
    return db.select().from(storyReferences).where(eq(storyReferences.storyId, storyId));
  },
};
