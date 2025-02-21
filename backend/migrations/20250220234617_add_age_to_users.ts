import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('users', (table) => {
        table.integer('age').notNullable().defaultTo(0);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('users', (table) => {
        table.dropColumn('age');
    });
}

