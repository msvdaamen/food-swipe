import {type Kysely, sql} from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await sql`alter table recipes add column cover_image_id bigint references files(id) on delete set null`.execute(db);
    await sql`create index recipes_cover_image_id_idx on recipes (cover_image_id)`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropIndex('recipes_cover_image_id_idx').execute();
    await sql`alter table recipes drop column cover_image_id`.execute(db);
}
