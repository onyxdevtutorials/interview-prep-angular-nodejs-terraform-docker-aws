import knex from 'knex';
import knexConfig from './knexFile.js';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const ssmClient = new SSMClient({ region: 'us-east-1' });

const getSSMParameter = async (name: string): Promise<string> => {
  const command = new GetParameterCommand({ Name: name });
  const response = await ssmClient.send(command);
  return response.Parameter?.Value || '';
};

export const runMigrations = async () => {
    const env = process.env.NODE_ENV || 'development';
    const config = knexConfig[env];
  
    config.connection = {
        host: await getSSMParameter(`/interview-prep/${env}/DB_HOST`),
        user: await getSSMParameter(`/interview-prep/${env}/DB_USERNAME`),
        password: await getSSMParameter(`/interview-prep/${env}/DB_PASSWORD`),
        database: await getSSMParameter(`/interview-prep/${env}/DB_NAME`),
        port: parseInt(await getSSMParameter(`/interview-prep/${env}/DB_PORT`), 10),
    };

    const db = knex(config);

    db.migrate.latest()
        .then(() => {
            console.log('Migrations ran successfully');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Error running migrations:', err);
            process.exit(1);
        });
};
