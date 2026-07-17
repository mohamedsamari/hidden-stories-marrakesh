CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_en" varchar(100) NOT NULL,
	"name_fr" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
