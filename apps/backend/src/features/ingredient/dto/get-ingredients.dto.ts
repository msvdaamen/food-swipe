import { z } from "zod";

export const getIngredientsDto = z.object({
  search: z.string().optional(),
  sort: z.literal("name").optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().min(1).default(1),
  amount: z.coerce.number().min(1).max(100).default(10)
});
export type GetIngredientsDto = z.infer<typeof getIngredientsDto>;
