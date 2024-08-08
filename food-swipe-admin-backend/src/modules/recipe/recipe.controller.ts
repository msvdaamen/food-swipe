import type { Hono } from "hono";
import { authRouter } from "../auth/auth.controller";
import { recipeService } from "./recipe.service";

const app = authRouter.createApp();




export const registerRecipeController = (instance: Hono) => {
    instance.route('/v1/recipes', app);
}