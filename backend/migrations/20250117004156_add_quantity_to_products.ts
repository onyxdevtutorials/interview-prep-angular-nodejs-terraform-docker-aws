import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('products', (table) => {
        table.integer('quantity').notNullable().defaultTo(0);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('products', (table) => {
        table.dropColumn('quantity');
    });
}
