import { Hono } from 'hono';
import { cors } from 'hono/cors'
import { registerAuthController } from './modules/auth/auth.controller';
import { registerRecipeController } from './modules/recipe/recipe.controller';

const app = new Hono();

app.use(cors());

app.get('/', (c) => c.text('Hello Bun!'));

registerAuthController(app);
registerRecipeController(app)

export default app;