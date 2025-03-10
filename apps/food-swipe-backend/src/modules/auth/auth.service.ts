import { addMonths } from "date-fns";
import type { SignUpDto } from "./dto/sign-up.dto";
import {
  authRefreshTokens,
  users,
  type UserEntity,
} from "@food-swipe/database";
import { eq } from "drizzle-orm";
import type { SignInDto } from "./dto/sign-in.dto";
import { jwtService, type JwtService } from "../../providers/jwt.service";
import type { SignUpResponse } from "./responses/sign-up.response";
import type { SignInResponse } from "./responses/sign-in.response";
import type { RefreshTokenResponse } from "./responses/refresh-token.response";
import { userService, type UserService } from "../user/user.service";
import { DbService } from "../../common/db.service";
import { v4 as uuid } from "uuid";
import {
  recipeBookService,
  type RecipeBookService,
} from "../recipe-book/recipe-book.service";

export class AuthService extends DbService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly recipeBookService: RecipeBookService
  ) {
    super();
  }

  async signUp(payload: SignUpDto): Promise<SignUpResponse> {
    const existingUser = await this.userService.findByEmail(payload.email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    if (payload.password !== payload.passwordConfirmation) {
      throw new Error("Passwords do not match");
    }
    const hashedPassword = await Bun.password.hash(payload.password);

    const user = await this.transaction(async (tx) => {
      const user = await this.userService.create({
        ...payload,
        password: hashedPassword,
      });
      await this.recipeBookService.createLikedRecipeBook(user.id, {
        title: "Liked Recipes",
      });

      return user;
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user),
    ]);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async signIn(payload: SignInDto): Promise<SignInResponse> {
    const existingUser = await this.userService.findByEmail(payload.email);
    if (!existingUser) {
      throw new Error("User does not exists");
    }

    const correct = await Bun.password.verify(
      payload.password,
      existingUser.password
    );
    if (!correct) {
      throw new Error("Invalid password");
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(existingUser),
      this.createRefreshToken(existingUser),
    ]);
    return {
      user: {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        createdAt: existingUser.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string): Promise<RefreshTokenResponse> {
    const { sub: refreshTokenId } = await this.jwtService.verify(refreshToken);
    if (!refreshTokenId) {
      throw new Error("Invalid refresh token");
    }
    const [result] = await this.database
      .select({
        user: users,
        token: authRefreshTokens,
      })
      .from(authRefreshTokens)
      .innerJoin(users, eq(authRefreshTokens.userId, users.id))
      .where(eq(authRefreshTokens.id, refreshTokenId))
      .limit(1);
    if (!result || result.token.expiresAt < new Date()) {
      throw new Error("Invalid refresh token");
    }
    await this.database
      .delete(authRefreshTokens)
      .where(eq(authRefreshTokens.id, refreshTokenId));
    const [accessToken, newRefreshToken] = await Promise.all([
      this.createAccessToken(result.user),
      this.createRefreshToken(result.user),
    ]);
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async signOut(userId: number): Promise<void> {
    await this.database
      .delete(authRefreshTokens)
      .where(eq(authRefreshTokens.userId, userId));
  }

  private async createAccessToken(user: UserEntity): Promise<string> {
    const scopes = ["user"];
    if (user.isAdmin) {
      scopes.push("admin");
    }
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      scopes,
    };
    return await this.jwtService.sign(tokenPayload, "10m");
  }

  private async createRefreshToken(user: UserEntity): Promise<string> {
    const [token] = await this.database
      .insert(authRefreshTokens)
      .values({
        id: uuid(),
        userId: user.id,
        expiresAt: addMonths(new Date(), 1),
      })
      .returning();
    if (!token) throw new Error("Failed to create refresh token");
    const jwt = await this.jwtService.sign({ sub: token.id }, "10W");
    return jwt;
  }
}

export const authService = new AuthService(
  userService,
  jwtService,
  recipeBookService
);
