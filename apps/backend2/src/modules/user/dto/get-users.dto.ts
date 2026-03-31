import { type } from "arktype";

export const getUsersDto = type({
  page: type("string | number").pipe((val) => {
    const num = typeof val === "string" ? Number(val) : val;
    return isNaN(num) || num < 1 ? 1 : num;
  }),
  amount: type("string | number").pipe((val) => {
    const num = typeof val === "string" ? Number(val) : val;
    if (isNaN(num) || num < 1) return 20;
    if (num > 100) return 100;
    return num;
  }),
  "sort?": "'createdAt' | 'id'",
});

export type GetUsersDto = typeof getUsersDto.infer;
