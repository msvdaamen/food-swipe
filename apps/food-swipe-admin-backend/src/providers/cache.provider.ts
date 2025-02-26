import KeyvRedis from "@keyv/redis";
import Keyv from "keyv";
import { cacheConfig } from "../config/cache.config";

export const cacheProvider = new Keyv(new KeyvRedis(cacheConfig.url), {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

export type CacheProvider = typeof cacheProvider;
