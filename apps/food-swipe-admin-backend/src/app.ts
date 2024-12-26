import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {rateLimiter} from "hono-rate-limiter";
import { getConnInfo } from 'hono/bun'
import { secureHeaders } from 'hono/secure-headers'
import {registerAuthController} from "./modules/auth/auth.controller.ts";
import {registerRecipeController} from "./modules/recipe/recipe.controller.ts";
import {registerUserController} from "./modules/user/user.controller.ts";
import {registerMeasurementsController} from "./modules/measurement/measurement.controller.ts";
import {registerIngredientController} from "./modules/ingredient/ingredient.controller.ts";
import {ZodError} from "zod";
import {FormatZodErrors} from "./common/format-zod-errors.ts";
import {appRouter} from "./router.ts";
import {trpcServer} from "@hono/trpc-server";

const app = new Hono();

app.use(secureHeaders())
app.use(cors());

const limiter = rateLimiter({
    windowMs: 60 * 1000, // 1 minutes
    limit: 120, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
    standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: (c) => {
        const info = getConnInfo(c);
        const cfConnectingIp = c.req.header()['cf-connecting-ip'];
        const realIp = c.req.header()['x-forwarded-for'];
        return cfConnectingIp || realIp || info.remote.address as string;
    } // Method to generate custom identifiers for clients.
    // store: ... , // Redis, MemoryStore, etc. See below.
});

app.use(limiter);

app.onError((err, c) => {
    console.log(err);
    if (err instanceof ZodError) {
        const errors = FormatZodErrors(err);
        return c.json({error: 'validation_error', message: errors}, 400);
    }

    return c.json({error: 'Internal Server Error'}, 500);
})

app.get('/', (c) => c.text('Hello Bun!'))

app.use(
  '/trpc/*',
  trpcServer({
      router: appRouter,
  })
)



registerAuthController(app);
registerUserController(app);
registerRecipeController(app);
registerMeasurementsController(app);
registerIngredientController(app);

export * from './router.ts'

export default {
    port: process.env.APP_PORT || 3000,
    fetch: app.fetch,
}