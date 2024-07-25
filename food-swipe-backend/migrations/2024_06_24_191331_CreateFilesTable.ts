import { Migration, type Blueprint, Schema } from 'migrationjs';


export default class CreateFilesTable extends Migration {
  async up(): Promise<void> {
    await Schema.create('files', (table: Blueprint) => {
      table.bigIncrements('id');
      table.unsignedBigInteger('user_id');
      table.string('filename').unique();
      table.string('type');
      table.boolean('is_public').default(false);
      table.timestamps();

      table.index(['filename', 'is_public']);

      table.foreign('user_id').references('id').on('users').onDelete('restrict');
    });
  }

  async down(): Promise<void> {
    await Schema.dropIfExists('files');
  }
}
