/** Shape of `GET /v1/me` (authenticated user profile). */
export type MeUser = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  image: string | null;
  imageUrl: string | null;
};
