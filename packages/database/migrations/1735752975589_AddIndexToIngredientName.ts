import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createIndex('ingredients_name_idx').on('ingredients').column('name').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('ingredients_name_idx').execute();
}
