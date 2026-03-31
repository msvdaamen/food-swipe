import { z } from "zod";

function boolFromQuery(val: unknown): boolean | undefined {
  if (val === undefined || val === "") return undefined;
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val === "true";
  return undefined;
}

export const loadRecipesDto = z.object({
  isPublished: z.preprocess(boolFromQuery, z.boolean().optional())
});
export type LoadRecipesDto = z.infer<typeof loadRecipesDto>;
