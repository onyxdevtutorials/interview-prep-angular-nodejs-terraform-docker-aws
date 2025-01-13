import { Knex } from 'knex';
import { ProductStatus } from '@onyxdevtutorials/interview-prep-shared';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('products');
  if (!exists) {
    return knex.schema.createTable('products', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('description').notNullable();
      table.integer('price').notNullable();
      table
        .enum('status', [
          ProductStatus.AVAILABLE,
          ProductStatus.OUT_OF_STOCK,
          ProductStatus.DISCONTINUED,
          ProductStatus.PENDING,
        ])
        .notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('products');
}
