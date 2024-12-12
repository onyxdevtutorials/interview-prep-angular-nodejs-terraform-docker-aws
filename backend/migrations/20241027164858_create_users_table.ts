import { Knex } from 'knex';
import { UserStatus } from '@onyxdevtutorials/interview-prep-shared';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('users');
  if (!exists) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').notNullable();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table
        .enum('status', [
          UserStatus.ACTIVE,
          UserStatus.INACTIVE,
          UserStatus.PENDING,
        ])
        .notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
