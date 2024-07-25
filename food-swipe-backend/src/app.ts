import { Hono } from 'hono';
import { cors } from 'hono/cors'
import { registerAuthController } from './modules/auth/auth.controller';
import { registerRecipeController } from './modules/recipe/recipe.controller';
import { serveStatic } from 'hono/bun';

const app = new Hono();

app.use(cors());
app.use('/storage/*', serveStatic({ root: './storage' }))

app.get('/', (c) => c.text('Hello Bun!'));

registerAuthController(app);
registerRecipeController(app)

export default app;