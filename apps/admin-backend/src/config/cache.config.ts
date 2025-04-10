import { z } from "zod";

const schema = z.object({
  CACHE_URL: z.string().url(),
});

const parsed = schema.parse(process.env);

export const cacheConfig = {
  url: parsed.CACHE_URL,
};
