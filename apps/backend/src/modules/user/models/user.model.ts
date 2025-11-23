import type { UserEntity } from "@food-swipe/database";

export type UserModel = Omit<UserEntity, "password">;
