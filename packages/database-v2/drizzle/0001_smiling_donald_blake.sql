CREATE TABLE "recipe_books" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recipe_books_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"image_id" integer,
	"title" text NOT NULL,
	"is_liked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_books_to_recipes" (
	"recipe_book_id" integer NOT NULL,
	"recipe_id" integer NOT NULL,
	CONSTRAINT "recipe_books_to_recipes_recipe_book_id_recipe_id_pk" PRIMARY KEY("recipe_book_id","recipe_id")
);
--> statement-breakpoint
ALTER TABLE "recipe_books" ADD CONSTRAINT "recipe_books_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_books" ADD CONSTRAINT "recipe_books_image_id_files_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_books_to_recipes" ADD CONSTRAINT "recipe_books_to_recipes_recipe_book_id_recipe_books_id_fk" FOREIGN KEY ("recipe_book_id") REFERENCES "public"."recipe_books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_books_to_recipes" ADD CONSTRAINT "recipe_books_to_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recipe_books_user_id_index" ON "recipe_books" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "recipe_books_image_id_index" ON "recipe_books" USING btree ("image_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recipe_books_user_id_is_liked_index" ON "recipe_books" USING btree ("user_id") WHERE "recipe_books"."is_liked" = TRUE;--> statement-breakpoint
CREATE INDEX "recipe_books_to_recipes_recipe_book_id_index" ON "recipe_books_to_recipes" USING btree ("recipe_book_id");--> statement-breakpoint
CREATE INDEX "recipe_books_to_recipes_recipe_id_index" ON "recipe_books_to_recipes" USING btree ("recipe_id");--> statement-breakpoint
INSERT INTO "recipe_books" ("user_id", "title", "is_liked") select "id", 'Liked Recipes', TRUE from "users";