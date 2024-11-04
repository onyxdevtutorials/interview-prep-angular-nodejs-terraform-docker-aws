import { Knex } from 'knex';
import { User, UserStatus } from '@onyxdevtutorials/interview-prep-shared';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');

  const users: User[] = [
    {
      id: 1,
      email: 'user1@xyz.com',
      first_name: 'User',
      last_name: 'One',
      status: UserStatus.ACTIVE,
    },
    {
      id: 2,
      email: 'user2@xyz.com',
      first_name: 'User',
      last_name: 'Two',
      status: UserStatus.ACTIVE,
    },
    {
      id: 3,
      email: 'user3@xyz.com',
      first_name: 'User',
      last_name: 'Three',
      status: UserStatus.ACTIVE,
    },
  ];

  await knex('users').insert(users);
}
