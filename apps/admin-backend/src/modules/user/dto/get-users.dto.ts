import { z } from "zod";

export const getUsersDto = z.object({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().min(1).max(100).default(20)
  ),
  sort: z.enum(["createdAt", "id"]).optional(),
});

export type GetUsersDto = z.infer<typeof getUsersDto>;
