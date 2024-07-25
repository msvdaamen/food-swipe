import {Migration, Blueprint, Schema} from 'migrationjs';


export default class CreateUsersTable extends Migration {

    async up(): Promise<void> {
        await Schema.create('users', (table: Blueprint) => {
            table.bigIncrements('id');
            table.string('email').unique();
            table.string('username').unique();
            table.string('password');
            table.string('first_name');
            table.string('last_name');
            table.boolean('is_admin').default(false);
            table.timestamps();
        });
    }

    async down(): Promise<void> {
        await Schema.dropIfExists('users');
    }
}
