import {type Kysely, sql} from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await sql`
        create table ingredients (
             id integer generated by default as identity primary key,
             name text not null
        )
    `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('ingredients').execute();
}
