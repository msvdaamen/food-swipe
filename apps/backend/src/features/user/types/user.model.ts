import { UserEntity } from "../../../schema";

export type UserModel = UserEntity & {
  imageUrl: string | null;
};
