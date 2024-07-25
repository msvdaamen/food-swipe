import { Migration, type Blueprint, Schema } from 'migrationjs';

export default class CreateAuthRefreshTokensTable extends Migration {
  async up(): Promise<void> {
    await Schema.create('auth_refresh_tokens', (table: Blueprint) => {
      table.uuid('id').primary();
      table.bigInteger('user_id');
      table.timestamp('expires_at');

      table.index('expires_at');
      table.foreign('user_id').references('id').on('users').onDelete('cascade');
    });
  }

  async down(): Promise<void> {
    await Schema.dropIfExists('auth_refresh_tokens');
  }
}

