import { UserStatus } from './userStatus';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}
