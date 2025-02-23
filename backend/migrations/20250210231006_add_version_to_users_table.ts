import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('users', (table) => {
        table.integer('version').defaultTo(1).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('users', (table) => {
        table.dropColumn('version');
    });
}

