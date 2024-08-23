import {type Kysely, sql} from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await sql`
        create table users (
           id bigint generated by default as identity primary key,
           email varchar(255) unique not null,
           username varchar(255)  unique not null,
           password varchar(255)  not null,
           first_name varchar(255) not null,
           last_name varchar(255) not null,
           is_admin boolean default false not null,
           created_at timestamp with time zone default now(),
           updated_at timestamp with time zone default now()
        )
    `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
	 await db.schema.dropTable('users').execute();
}
