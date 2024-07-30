import {Migration, Blueprint, Schema} from 'migrationjs';


export default class CreateRecipesTable extends Migration {

    async up(): Promise<void> {
        await Schema.create('recipes', (table: Blueprint) => {
            table.id();
            table.string('title').unique();
            table.text('description').nullable();
            table.integer('prep_time').nullable();
            table.integer('servings').nullable();
            table.integer('calories').nullable();
            table.boolean('is_published').default(false);
            table.timestamps();

            table.index('is_published');
        });
    }

    async down(): Promise<void> {
        await Schema.dropIfExists('recipes');
    }
}
