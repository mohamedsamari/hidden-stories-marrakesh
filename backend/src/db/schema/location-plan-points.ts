import { pgTable, uuid, varchar, doublePrecision, integer, timestamp } from 'drizzle-orm/pg-core';
import { locations } from './locations';

export const locationPlanPoints = pgTable('location_plan_points', {
  id: uuid('id').defaultRandom().primaryKey(),
  locationId: uuid('location_id')
    .references(() => locations.id, { onDelete: 'cascade' })
    .notNull(),
  // Position on the plan image, as a percentage (0-100) of its width/height —
  // resolution-independent, so the same point works at any display size.
  xPercent: doublePrecision('x_percent').notNull(),
  yPercent: doublePrecision('y_percent').notNull(),
  labelEn: varchar('label_en', { length: 100 }).notNull(),
  labelFr: varchar('label_fr', { length: 100 }).notNull(),
  descriptionEn: varchar('description_en', { length: 500 }),
  descriptionFr: varchar('description_fr', { length: 500 }),
  position: integer('position').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
