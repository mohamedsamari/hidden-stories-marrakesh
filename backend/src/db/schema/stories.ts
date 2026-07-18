import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { locations } from './locations';
import { historicalPeriods } from './historical-periods';
import { dynasties } from './dynasties';

export const stories = pgTable('stories', {
  id: uuid('id').defaultRandom().primaryKey(),

  titleEn: varchar('title_en', { length: 200 }).notNull(),
  titleFr: varchar('title_fr', { length: 200 }).notNull(),

  shortDescriptionEn: varchar('short_description_en', { length: 300 }).notNull(),
  shortDescriptionFr: varchar('short_description_fr', { length: 300 }).notNull(),

  fullStoryEn: text('full_story_en').notNull(),
  fullStoryFr: text('full_story_fr').notNull(),

  coverImageUrl: varchar('cover_image_url', { length: 500 }).notNull(),

  audioUrlEn: varchar('audio_url_en', { length: 500 }),
  audioUrlFr: varchar('audio_url_fr', { length: 500 }),

  century: integer('century'),

  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  locationId: uuid('location_id').references(() => locations.id).notNull(),
  historicalPeriodId: uuid('historical_period_id').references(() => historicalPeriods.id),
  dynastyId: uuid('dynasty_id').references(() => dynasties.id),

  isPublished: boolean('is_published').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});