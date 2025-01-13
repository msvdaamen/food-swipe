import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema.createTable('recipe_nutritions')
    .addColumn('id', 'integer', (col) => col.generatedByDefaultAsIdentity().primaryKey())
    .addColumn('recipe_id', 'integer', (col) => col.references('recipes.id').onDelete('cascade'))
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('unit', 'text', (col) => col.notNull())
    .addColumn('value', 'integer', (col) => col.notNull())
    .addUniqueConstraint('recipe_id_name_unit', ['recipe_id', 'name'])
    .execute();

  await db.schema.createIndex('recipe_nutritions_recipe_id_idx').on('recipe_nutritions').column('recipe_id').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('recipe_nutritions').execute();
}
