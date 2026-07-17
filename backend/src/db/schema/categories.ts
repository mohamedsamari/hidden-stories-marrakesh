import {pgTable, varchar, uuid, timestamp} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
    id:uuid("id").defaultRandom().primaryKey(),
    nameEn:varchar('name_en', {length : 100}).notNull(),
    nameFr: varchar("name_fr", {length : 100}).notNull(),
    createdAt:timestamp('created_at').defaultNow().notNull(),
})