import {Migration, Blueprint, Schema} from 'migrationjs';


export default class CreateIngredientsTable extends Migration {

    async up(): Promise<void> {
        await Schema.create('ingredients', (table: Blueprint) => {
            table.id();
            table.string('name');
        });
    }

    async down(): Promise<void> {
        await Schema.dropIfExists('ingredients');
    }
}
