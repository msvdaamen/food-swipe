import { createMiddleware } from "hono/factory";
import type { AppContext } from "../app-context";
import { createDatabase } from "../providers/database.provider";
import { createAuthProvider } from "../providers/auth.provider";
import { kvStorage } from "../providers/kvstore.provider";
import { createStorageService } from "../providers/storage/storage.service";

export const setupMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const db = await createDatabase(c.env.HYPERDRIVE.connectionString);
  const auth = createAuthProvider(db, kvStorage, c.env);
  const storage = createStorageService(c.env);

  c.set("db", db);
  c.set("auth", auth);
  c.set("storage", storage);

  await next();
});
