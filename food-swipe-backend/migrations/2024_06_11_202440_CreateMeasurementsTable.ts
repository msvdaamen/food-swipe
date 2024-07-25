import {Migration, Blueprint, Schema} from 'migrationjs';


export default class CreateMeasurementsTable extends Migration {

    async up(): Promise<void> {
        await Schema.create('measurements', (table: Blueprint) => {
            table.id();
            table.string('name');
            table.string('abbreviation');
        });
    }

    async down(): Promise<void> {
        await Schema.dropIfExists('measurements');
    }
}
