import { z } from "zod";

export const getUsersDto = z.object({
  page: z.number().min(1).default(1),
  amount: z.number().min(1).max(100).default(20),
  sort: z.enum(["createdAt", "id"]).default("id")
});
export type GetUsersDto = z.infer<typeof getUsersDto>;
