import { type } from "arktype";

const schema = type({
  CACHE_URL: "string.url",
});

const parsed = schema.assert(process.env);

export const cacheConfig = {
  url: parsed.CACHE_URL,
};
