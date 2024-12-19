import { Handler } from 'aws-lambda';
import { runMigrations } from './migrate.js';

export const handler: Handler = async (event, context) => {
    try {
        await runMigrations();
        return {
            statusCode: 200,
            body: JSON.stringify('Migrations ran successfully'),
        }
    } catch (err) {
        if (err instanceof Error) {
            return {
                statusCode: 500,
                body: JSON.stringify({message: `Error running migrations: ${err}`, error: err.message}),
            }
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Error running migrations', error: 'Unknown error'}),
            }
        }
    }
};