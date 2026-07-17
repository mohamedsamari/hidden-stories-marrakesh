CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_en" varchar(100) NOT NULL,
	"name_fr" varchar(100) NOT NULL,
	"description_en" varchar(1000),
	"description_fr" varchar(1000),
	"address_en" varchar(200),
	"address_fr" varchar(200),
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"category_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;