import {type Kysely, sql} from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await sql`
        create table measurements (
          id smallint generated by default as identity primary key,
          name varchar(255) not null,
          abbreviation varchar(255) not null
        )
    `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('measurements').execute();
}
