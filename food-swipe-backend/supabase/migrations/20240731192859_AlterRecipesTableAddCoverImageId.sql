alter table recipes add column cover_image_id bigint references files(id) on delete set null;

create index recipes_cover_image_id_idx on recipes (cover_image_id);