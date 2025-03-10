import { Hono } from "hono";
import { cors } from "hono/cors";
import { registerAuthController } from "./modules/auth/auth.controller";
import { registerRecipeController } from "./modules/recipe/recipe.controller";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { secureHeaders } from "hono/secure-headers";
import { migrateDatabase } from "./providers/database.provider";
import { registerRecipeBookController } from "./modules/recipe-book/recipe-book.controller";

await migrateDatabase();

const app = new Hono();

app.use(secureHeaders());
app.use(cors());

const limiter = rateLimiter({
  windowMs: 60 * 1000, // 15 minutes
  limit: 60, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => {
    const info = getConnInfo(c);
    const cfConnectingIp = c.req.header()["cf-connecting-ip"];
    const realIp = c.req.header()["x-forwarded-for"];
    return cfConnectingIp || realIp || (info.remote.address as string);
  }, // Method to generate custom identifiers for clients.
  // store: ... , // Redis, MemoryStore, etc. See below.
});

app.use(limiter);

app.get("/", (c) => c.text("Hello Bun!"));

registerAuthController(app);
registerRecipeController(app);
registerRecipeBookController(app);

export default {
  port: process.env.APP_PORT || 3000,
  fetch: app.fetch,
};
