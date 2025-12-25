import type { UserEntity } from "../../../schema";

export type UserModel = Omit<UserEntity, "password">;
