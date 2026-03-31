import { createStorage, Storage } from "unstorage";
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding";
import { env } from "cloudflare:workers";

export type KvStoreProvider = Storage;

export const kvStorage = createStorage({
  driver: cloudflareKVBindingDriver({ binding: env.FOOD_SWIPE_CACHE })
});
