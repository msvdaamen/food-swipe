import {type Kysely, sql} from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await sql`
        create table user_liked_recipe (
           user_id bigint references users(id) on delete cascade,
           recipe_id integer references recipes(id) on delete cascade,
           primary key (user_id, recipe_id)
        )
    `.execute(db);
    await sql`create index user_liked_recipe_recipe_id_idx on user_liked_recipe (recipe_id)`.execute(db);
    await sql`create index user_liked_recipe_user_id_idx on user_liked_recipe (user_id)`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex('user_liked_recipe_recipe_id_idx').execute();
    await db.schema.dropIndex('user_liked_recipe_user_id_idx').execute();
    await db.schema.dropTable('user_liked_recipe').execute();
}
