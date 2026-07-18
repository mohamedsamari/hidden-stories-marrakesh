import { pgTable, uuid, varchar, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { locations } from './locations';

export const locationImages = pgTable('location_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  locationId: uuid('location_id')
    .references(() => locations.id, { onDelete: 'cascade' })
    .notNull(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  altTextEn: varchar('alt_text_en', { length: 200 }),
  altTextFr: varchar('alt_text_fr', { length: 200 }),
  isCover: boolean('is_cover').default(false).notNull(),
  position: integer('position').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});