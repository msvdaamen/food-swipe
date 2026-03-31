import { createMiddleware } from "hono/factory";
import { AppContext } from "..";
import { createDatabase } from "../providers/database.provider";
import { createAuthProvider } from "../providers/auth.provider";
import { kvStorage } from "../providers/kvstore.provider";

export const setupMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const db = await createDatabase(c.env.HYPERDRIVE.connectionString);
  const auth = createAuthProvider(db, kvStorage, c.env);

  c.set("db", db);
  c.set("auth", auth);

  await next();
});
