import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('products', (table) => {
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    });

    await knex.schema.table('users', (table) => {
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    });

    await knex.raw(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    `);

    await knex.raw(`
        CREATE TRIGGER update_products_updated_at
        BEFORE UPDATE ON products
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await knex.raw(`
        CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('products', (table) => {
        table.dropColumn('created_at');
        table.dropColumn('updated_at');
    });

    await knex.schema.table('users', (table) => {
        table.dropColumn('created_at');
        table.dropColumn('updated_at');
    });

    await knex.raw('DROP TRIGGER update_products_updated_at ON products');
    await knex.raw('DROP TRIGGER update_users_updated_at ON users');
    await knex.raw('DROP FUNCTION update_updated_at_column');
}

