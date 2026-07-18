import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { stories } from './stories';

export const storyReferences = pgTable('story_references', {
  id: uuid('id').defaultRandom().primaryKey(),
  storyId: uuid('story_id')
    .references(() => stories.id, { onDelete: 'cascade' })
    .notNull(),
  label: varchar('label', { length: 300 }).notNull(),
  url: varchar('url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});