import { addMonths } from "date-fns";
import { authRefreshTokenSchema } from "./schema/auth-refresh-token.schema";
import type { SignInDto } from "./dto/sign-in.dto";
import { jwtService, type JwtService } from "../../providers/jwt.service";
import type { SignInResponse } from "./responses/sign-in.response";
import type { RefreshTokenResponse } from "./responses/refresh-token.response";
import { userService, type UserService } from "../user/user.service";
import { DbService } from "../../common/db.service";
import {v4 as uuid} from 'uuid';
import {usersSchema} from "../user/schema/user.schema.ts";
import {eq} from "drizzle-orm";

export class AuthService extends DbService  {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {
        super();
    }

      async signIn(payload: SignInDto): Promise<SignInResponse> {
        const existingUser = await this.userService.findByEmail(payload.email);
        if (!existingUser || !existingUser.isAdmin) {
          throw new Error('User does not exists');
        }
        console.log(existingUser)
    
        const correct = await Bun.password.verify(payload.password, existingUser.password);
        if (!correct) {
          throw new Error('Invalid password');
        }
        const [accessToken, refreshToken] = await Promise.all([
          this.createAccessToken(existingUser.id, existingUser.email),
          this.createRefreshToken(existingUser.id)
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
          refreshToken
        };
      }
    
      async refreshTokens(refreshToken: string): Promise<RefreshTokenResponse> {
        const {sub: refreshTokenId} = await this.jwtService.verify(refreshToken);
        if (!refreshTokenId) {
          throw new Error('Invalid refresh token');
        }

        const [result] = await this.database
          .select({
            expiresAt: authRefreshTokenSchema.expiresAt,
            userId: usersSchema.id,
            email: usersSchema.email
          })
          .from(authRefreshTokenSchema)
          .innerJoin(usersSchema, eq(authRefreshTokenSchema.userId, usersSchema.id))
          .where(eq(authRefreshTokenSchema.id, refreshTokenId))
          .limit(1);
        if (!result || result.expiresAt < new Date()) {
          throw new Error('Invalid refresh token');
        }
        await this.database.delete(authRefreshTokenSchema).where(eq(authRefreshTokenSchema.id, refreshTokenId));
        const [accessToken, newRefreshToken] = await Promise.all([
          this.createAccessToken(result.userId, result.email),
          this.createRefreshToken(result.userId)
        ]);
        return {
          accessToken,
          refreshToken: newRefreshToken
        };
      }
    
    
      async signOut(userId: number): Promise<void> {
        await this.database.delete(authRefreshTokenSchema).where(eq(authRefreshTokenSchema.userId, userId));
      }
    
      private async createAccessToken(userId: number, email: string): Promise<string> {
        const tokenPayload = {
          sub: userId,
          email
        };
        return await this.jwtService.sign(tokenPayload, '10s');
      }
    
      private async createRefreshToken(userId: number): Promise<string> {
        const [token] = await this.database.insert(authRefreshTokenSchema)
          .values({
            id: uuid(),
            userId,
            expiresAt: addMonths(new Date(), 1)
          })
          .returning();
        if (!token) throw new Error('Failed to create refresh token');
        const jwt = await this.jwtService.sign({sub: token.id}, '10W');
        return jwt;
      }
}

export const authService = new AuthService(userService, jwtService);

