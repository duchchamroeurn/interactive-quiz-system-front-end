export enum UserRole {
  ADMIN = 'ADMIN',
  PRESENTER = 'PRESENTER',
  AUDIENCE = 'AUDIENCE'
}

export interface User {
  userId: string;
  email: string;
  username: string;
  userRole: UserRole;
}
