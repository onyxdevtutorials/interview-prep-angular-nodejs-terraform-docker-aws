import { UserStatus } from './userStatus';

export interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  status: UserStatus;
  created_at?: Date;
  updated_at?: Date;
  age?: number;
  street_address?: string;
  city?: string;
  favorite_song?: string;
  favorite_color?: string;
  version?: number;
}
