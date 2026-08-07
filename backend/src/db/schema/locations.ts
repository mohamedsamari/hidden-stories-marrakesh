import {pgTable, uuid, varchar, timestamp, doublePrecision, boolean, jsonb} from "drizzle-orm/pg-core";
import {categories} from "./categories";

// One entry per day of the week; `null` means closed that day.
export type DaySchedule = { open: string; close: string } | null;
export type OpeningHours = {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
};

export const locations = pgTable("locations",{
    id:uuid("id").primaryKey().defaultRandom(),
    nameEn:varchar("name_en", {length : 100}).notNull(),
    nameFr:varchar("name_fr", {length : 100}).notNull(),
    descriptionEn:varchar("description_en", {length : 1000}),
    descriptionFr:varchar("description_fr", {length : 1000}),
    addressEn:varchar("address_en", {length : 200}),
    addressFr:varchar("address_fr", {length : 200}),
    latitude:doublePrecision("latitude").notNull(),
    longitude:doublePrecision("longitude").notNull(),
    categoryId: uuid("category_id").references(() => categories.id),
    openingHours: jsonb("opening_hours").$type<OpeningHours>(),
    isFreeEntry: boolean("is_free_entry").default(false).notNull(),
    entryPriceLabel: varchar("entry_price_label", {length: 50}),
    planImageUrl: varchar("plan_image_url", {length: 500}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})