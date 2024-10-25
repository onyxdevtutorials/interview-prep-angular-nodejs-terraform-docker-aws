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

  getUsers() {
    return of(mockUsers);
  }

  getUser(id: number) {
    return of(mockUsers.find((u) => u.id === id));
  }

  updateUser(id: string, user: Omit<User, 'id'>) {
    const index = mockUsers.findIndex((u) => u.id.toString() === id);
    if (index !== -1) {
      mockUsers[index] = {
        id: parseInt(id, 10),
        ...user,
      };
      return of(mockUsers[index]);
    } else {
      return of(null);
    }
  }
}
