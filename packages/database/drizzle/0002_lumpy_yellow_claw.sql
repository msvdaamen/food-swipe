DROP TABLE "user_liked_recipe" CASCADE;--> statement-breakpoint
ALTER TABLE "recipe_books_to_recipes" RENAME TO "recipes_to_recipe_books";--> statement-breakpoint
ALTER TABLE "recipes_to_recipe_books" DROP CONSTRAINT "recipe_books_to_recipes_recipe_book_id_recipe_books_id_fk";
--> statement-breakpoint
ALTER TABLE "recipes_to_recipe_books" DROP CONSTRAINT "recipe_books_to_recipes_recipe_id_recipes_id_fk";
--> statement-breakpoint
DROP INDEX "recipe_books_to_recipes_recipe_book_id_index";--> statement-breakpoint
DROP INDEX "recipe_books_to_recipes_recipe_id_index";--> statement-breakpoint
ALTER TABLE "recipes_to_recipe_books" DROP CONSTRAINT "recipe_books_to_recipes_recipe_book_id_recipe_id_pk";--> statement-breakpoint
ALTER TABLE "recipes_to_recipe_books" ADD CONSTRAINT "recipes_to_recipe_books_recipe_book_id_recipe_id_pk" PRIMARY KEY("recipe_book_id","recipe_id");--> statement-breakpoint
ALTER TABLE "recipes_to_recipe_books" ADD CONSTRAINT "recipes_to_recipe_books_recipe_book_id_recipe_books_id_fk" FOREIGN KEY ("recipe_book_id") REFERENCES "public"."recipe_books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes_to_recipe_books" ADD CONSTRAINT "recipes_to_recipe_books_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recipes_to_recipe_books_recipe_book_id_index" ON "recipes_to_recipe_books" USING btree ("recipe_book_id");--> statement-breakpoint
CREATE INDEX "recipes_to_recipe_books_recipe_id_index" ON "recipes_to_recipe_books" USING btree ("recipe_id");