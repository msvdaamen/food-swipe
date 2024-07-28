import { Hono } from "hono";
import { signInDtoSchema } from "./dto/sign-in.dto";
import { authService } from "./auth.service";
import { signUpDtoSchema } from "./dto/sign-up.dto";
import { refreshTokenDtoSchema } from "./dto/refresh-token.dto";
import { createFactory, createMiddleware } from "hono/factory";
import { authMiddleware, type AuthContext } from "./middlewares/auth.middleware";

const app = new Hono();

app.post('/sign-in', async (c) => {
    const payload = signInDtoSchema.parse(await c.req.json());
    try {
        const response = await authService.signIn(payload);
        return c.json(response);
    } catch (error) {
        return c.json({}, 401);
    }
});
app.post('/sign-up', async (c) => {
    const payload = signUpDtoSchema.parse(await c.req.json());
    const response = await authService.signUp(payload);
    return c.json(response);
});

app.get('/me', authMiddleware, async (c) => {
    const user = c.get('user');
    return c.json({
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt
    });
});


app.post('/refresh-token', async (c) => {
    const {refreshToken} = refreshTokenDtoSchema.parse(await c.req.json());
    try {
        const response = await authService.refreshTokens(refreshToken);
        return c.json(response);
    } catch (error) {
        return c.json({}, 401);
    }
});

app.post('/sign-out', authMiddleware, async (c) => {
    const user = c.get('user');
    await authService.signOut(user.id);
    return c.json({message: 'Sign out successfully'});
});

export const authRouter = createFactory<AuthContext>({
    initApp: app => {
        app.use(authMiddleware);
    }
});

export const registerAuthController = (instance: Hono) => {
    instance.route('/v1/auth', app);
}