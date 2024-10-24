import { of } from 'rxjs';
import { User, UserStatus } from '@onyxdevtutorials/interview-prep-shared';
import { mockUsers } from './mock-users';

export class MockUsersService {
  createUser(user: Omit<User, 'id'>) {
    return of({
      id: Math.max(...mockUsers.map((u) => u.id)) + 1,
      ...user,
      status: UserStatus.ACTIVE,
    });
  }
}
