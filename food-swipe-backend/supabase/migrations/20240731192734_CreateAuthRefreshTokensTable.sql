create table auth_refresh_tokens (
    id uuid primary key,
    user_id bigint references users(id) on delete cascade,
    expires_at timestamp with time zone not null
);

create index refresh_tokens_expires_at_idx on auth_refresh_tokens (expires_at);