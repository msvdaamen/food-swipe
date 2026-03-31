import { cacheConfig } from "../config/cache.config";
import { RedisClient } from "bun";

export const cacheProvider = new RedisClient(cacheConfig.url);
export type CacheProvider = typeof cacheProvider;
