import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { stories } from './stories';

export const storyImages = pgTable('story_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  storyId: uuid('story_id')
    .references(() => stories.id, { onDelete: 'cascade' })
    .notNull(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  altTextEn: varchar('alt_text_en', { length: 200 }),
  altTextFr: varchar('alt_text_fr', { length: 200 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});