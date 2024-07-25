import {Migration, Blueprint, Schema} from 'migrationjs';


export default class CreateRecipeStepTable extends Migration {

    async up(): Promise<void> {
        await Schema.create('recipe_steps', (table: Blueprint) => {
            table.id();
            table.integer('recipe_id');
            table.integer('step_number');
            table.text('description');
            table.timestamps();

            table.foreign('recipe_id').references('id').on('recipes').onDelete('cascade');
        });
    }

    async down(): Promise<void> {
        await Schema.dropIfExists('recipe_steps');
    }
}
