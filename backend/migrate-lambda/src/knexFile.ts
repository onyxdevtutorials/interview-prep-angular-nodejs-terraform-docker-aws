import { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'pg',
        connection: {},
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
    }
};

export default config;