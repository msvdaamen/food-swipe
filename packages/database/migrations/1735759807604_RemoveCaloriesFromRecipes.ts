import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('recipes').dropColumn('calories').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable('recipes').addColumn('calories', 'integer', (col) => col.notNull()).execute();
}
