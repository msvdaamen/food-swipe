create table recipe_ingredients (
    recipe_id bigint references recipes(id) on delete cascade,
    ingredient_id bigint references ingredients(id) on delete cascade,
    measurement_id bigint references measurements(id) on delete cascade,
    amount integer not null,
    primary key (recipe_id, ingredient_id)
);

create index recipe_ingredients_measurement_id_idx on recipe_ingredients (measurement_id);
create index recipe_ingredients_ingredient_id_idx on recipe_ingredients (ingredient_id);
create index recipe_ingredients_recipe_id_idx on recipe_ingredients (recipe_id);