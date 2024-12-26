import type {Hono} from "hono";
import {authRouter} from "../auth/auth.controller.ts";

const app = authRouter.createApp();

export const registerUserController = (instance: Hono) => {
    instance.route('/v1/users', app);
}