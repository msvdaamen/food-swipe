export interface AuthUser {
    id: number
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: string | Date,
    scopes: Set<string>
  };
  