import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const dynasties = pgTable('dynasties', {
  id: uuid('id').defaultRandom().primaryKey(),
  nameEn: varchar('name_en', { length: 100 }).notNull(),
  nameFr: varchar('name_fr', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});