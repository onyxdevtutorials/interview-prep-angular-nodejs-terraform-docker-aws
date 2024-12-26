import knex from 'knex';
import knexConfig from './knexFile.js';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms';

const ssmClient = new SSMClient({ region: 'us-east-1' });
const kmsClient = new KMSClient({ region: 'us-east-1' });

const getSSMParameter = async (name: string): Promise<string> => {
  const command = new GetParameterCommand({ Name: name, WithDecryption: true });
  const response = await ssmClient.send(command);
  return response.Parameter?.Value || '';
};

// const decryptPassword = async (password: string): Promise<string> => {
//     const command = new DecryptCommand({
//         CiphertextBlob: Buffer.from(password, 'base64')
//     });
//     const response = await kmsClient.send(command);
//     return Buffer.from(response.Plaintext as Uint8Array).toString('utf-8');
// };

export const runMigrations = async () => {
    try {
        const env = process.env.NODE_ENV || 'development';
        const config = knexConfig[env];
    
        config.connection = {
            host: await getSSMParameter(`/interview-prep/${env}/DB_HOST`),
            user: await getSSMParameter(`/interview-prep/${env}/DB_USERNAME`),
            password: await getSSMParameter(`/interview-prep/${env}/DB_PASSWORD`),
            database: await getSSMParameter(`/interview-prep/${env}/DB_NAME`),
            port: parseInt(await getSSMParameter(`/interview-prep/${env}/DB_PORT`), 10),
            ssl: { rejectUnauthorized: false },
        };

        console.log('Database configuration:', config);

        const db = knex(config);

        console.log('Running migrations...');

        await db.migrate.latest()
            .then(() => {
                console.log('Migrations ran successfully');
                process.exit(0);
            })
            .catch((err) => {
                console.error('Error running migrations:', err);
                process.exit(1);
            });
    } catch (err) {
        console.error('Error running migrations:', err);
        process.exit(1);
    }
};

