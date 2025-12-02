import { Hono } from "hono";
import { cors } from "hono/cors";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { secureHeaders } from "hono/secure-headers";
import { registerAuthController } from "./modules/auth/auth.controller.ts";
import { registerRecipeController } from "./modules/recipe/recipe.controller.ts";
import { registerUserController } from "./modules/user/user.controller.ts";
import { registerMeasurementsController } from "./modules/measurement/measurement.controller.ts";
import { registerIngredientController } from "./modules/ingredient/ingredient.controller.ts";
import { ZodError } from "zod";
import { FormatZodErrors } from "./common/format-zod-errors.ts";
import { migrateDatabase } from "./providers/database.provider.ts";
import { registerToolsController } from "./modules/tools/tools.controller.ts";
import { registerRecipeBookController } from "./modules/recipe-book/recipe-book.controller.ts";
import { removeBackground } from "@imgly/background-removal-node";

await migrateDatabase();

const app = new Hono();

app.use(secureHeaders());
app.use(cors());

const limiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minutes
  limit: 120, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => {
    const info = getConnInfo(c);
    const cfConnectingIp = c.req.header()["cf-connecting-ip"];
    const realIp = c.req.header()["x-forwarded-for"];
    return cfConnectingIp || realIp || (info.remote.address as string);
  },
});

app.use(limiter);

app.get("/", (c) => c.text("Hello Bun!"));

registerAuthController(app);
registerUserController(app);
registerRecipeController(app);
registerMeasurementsController(app);
registerIngredientController(app);
registerToolsController(app);
registerRecipeBookController(app);

// app.get("/test", async (c) => {
//   const file = Bun.file("test2.png");
// const blob = await removeBackground(file);
//   Bun.write("output.png", await blob.arrayBuffer());
//   return c.body(await blob.arrayBuffer(), {
//     headers: {
//       "Content-Type": "image/png",
//     },
//   })
// })

export default {
  port: process.env.APP_PORT || 3000,
  fetch: app.fetch,
};
