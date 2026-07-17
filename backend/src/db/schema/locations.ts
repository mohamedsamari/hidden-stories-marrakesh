import {pgTable, uuid, varchar, timestamp, doublePrecision} from "drizzle-orm/pg-core";
import {categories} from "./categories";

export const locations = pgTable("locations",{
    id:uuid("id").primaryKey().defaultRandom(),
    nameEn:varchar("name_en", {length : 100}).notNull(),
    nameFr:varchar("name_fr", {length : 100}).notNull(),
    descriptionEn:varchar("description_en", {length : 1000}),
    descriptionFr:varchar("description_fr", {length : 1000}),
    adressEn:varchar("address_en", {length : 200}),
    adressFr:varchar("address_fr", {length : 200}),
    latitude:doublePrecision("latitude").notNull(),
    longitude:doublePrecision("longitude").notNull(),
    categoryId: uuid("category_id").references(() => categories.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})