import {Migration, Blueprint, Schema} from 'migrationjs';


export default class CreateRecipeIngredientsTable extends Migration {

    async up(): Promise<void> {
        await Schema.create('recipe_ingredients', (table: Blueprint) => {
            table.integer('recipe_id');
            table.integer('ingredient_id');
            table.integer('measurement_id').nullable();
            table.integer('amount');

            table.primary(['recipe_id', 'ingredient_id']);

            table.foreign('recipe_id').references('id').on('recipes').onDelete('cascade');
            table.foreign('ingredient_id').references('id').on('ingredients').onDelete('cascade');
            table.foreign('measurement_id').references('id').on('measurements').onDelete('cascade');
        });
    }

    async down(): Promise<void> {
        await Schema.dropIfExists('recipe_ingredients');
    }
}
