import {type Kysely, sql} from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await sql`
        create table recipe_ingredients (
            recipe_id bigint references recipes(id) on delete cascade,
            ingredient_id bigint references ingredients(id) on delete cascade,
            measurement_id bigint references measurements(id) on delete cascade,
            amount integer not null,
            primary key (recipe_id, ingredient_id)
        )
    `.execute(db);
    await sql`create index recipe_ingredients_measurement_id_idx on recipe_ingredients (measurement_id)`.execute(db);
    await sql`create index recipe_ingredients_ingredient_id_idx on recipe_ingredients (ingredient_id)`.execute(db);
    await sql`create index recipe_ingredients_recipe_id_idx on recipe_ingredients (recipe_id)`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropIndex('recipe_ingredients_measurement_id_idx').execute();
    await db.schema.dropIndex('recipe_ingredients_ingredient_id_idx').execute();
    await db.schema.dropIndex('recipe_ingredients_recipe_id_idx').execute();
    await db.schema.dropTable('recipe_ingredients').execute();
}
