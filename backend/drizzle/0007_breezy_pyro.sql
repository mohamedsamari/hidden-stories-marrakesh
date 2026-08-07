CREATE TABLE "location_plan_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location_id" uuid NOT NULL,
	"x_percent" double precision NOT NULL,
	"y_percent" double precision NOT NULL,
	"label_en" varchar(100) NOT NULL,
	"label_fr" varchar(100) NOT NULL,
	"description_en" varchar(500),
	"description_fr" varchar(500),
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "opening_hours" jsonb;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "is_free_entry" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "entry_price_label" varchar(50);--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "plan_image_url" varchar(500);--> statement-breakpoint
ALTER TABLE "location_plan_points" ADD CONSTRAINT "location_plan_points_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;