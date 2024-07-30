import {Migration, Blueprint, Schema} from 'migrationjs';


export default class CreateUserLikedRecipeTable extends Migration {

    async up(): Promise<void> {
        await Schema.create('user_liked_recipe', (table: Blueprint) => {
            table.integer('user_id');
            table.integer('recipe_id');

            table.primary(['user_id', 'recipe_id']);
            table.foreign('user_id').references('id').on('users').onDelete('cascade');
            table.foreign('recipe_id').references('id').on('recipes').onDelete('cascade');
        });
    }

    async down(): Promise<void> {
        await Schema.dropIfExists('user_liked_recipe');
    }

}
