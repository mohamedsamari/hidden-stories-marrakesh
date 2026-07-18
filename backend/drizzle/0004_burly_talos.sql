CREATE TABLE "stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_fr" varchar(200) NOT NULL,
	"short_description_en" varchar(300) NOT NULL,
	"short_description_fr" varchar(300) NOT NULL,
	"full_story_en" text NOT NULL,
	"full_story_fr" text NOT NULL,
	"cover_image_url" varchar(500) NOT NULL,
	"audio_url_en" varchar(500),
	"audio_url_fr" varchar(500),
	"century" integer,
	"category_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"historical_period_id" uuid,
	"dynasty_id" uuid,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_historical_period_id_historical_periods_id_fk" FOREIGN KEY ("historical_period_id") REFERENCES "public"."historical_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_dynasty_id_dynasties_id_fk" FOREIGN KEY ("dynasty_id") REFERENCES "public"."dynasties"("id") ON DELETE no action ON UPDATE no action;