/** Row shape returned by `GET /v1/users` (admin list). */
export type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  createdAt: Date;
};
