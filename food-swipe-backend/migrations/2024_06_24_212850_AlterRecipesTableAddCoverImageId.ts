import {Migration, Blueprint, Schema} from 'migrationjs';


export default class AlterRecipesTableAddCoverImageId extends Migration {

    async up(): Promise<void> {
        await Schema.table('recipes', (table: Blueprint) => {
            table.bigInteger('cover_image_id').nullable();

            table.foreign('cover_image_id').references('id').on('files').onDelete('set null');
        });
    }

    async down(): Promise<void> {
        await await Schema.table('recipes', (table: Blueprint) => {
            table.dropForeign('cover_image_id');

            table.dropColumn('cover_image_id');
        });
    }
}
