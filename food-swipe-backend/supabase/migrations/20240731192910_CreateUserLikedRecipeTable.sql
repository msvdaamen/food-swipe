create table user_liked_recipe (
    user_id bigint references users(id) on delete cascade,
    recipe_id bigint references recipes(id) on delete cascade,
    primary key (user_id, recipe_id)
);

create index user_liked_recipe_recipe_id_idx on user_liked_recipe (recipe_id);
create index user_liked_recipe_user_id_idx on user_liked_recipe (user_id);