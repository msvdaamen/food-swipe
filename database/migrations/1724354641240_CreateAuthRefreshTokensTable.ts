import {type Kysely, sql} from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await sql`
        create table auth_refresh_tokens (
             id uuid primary key,
             user_id bigint references users(id) on delete cascade,
             expires_at timestamp with time zone not null
        )
    `.execute(db)
    await db.schema.createIndex('refresh_tokens_expires_at_idx')
        .on('auth_refresh_tokens')
        .column('expires_at')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('auth_refresh_tokens').execute();
}
