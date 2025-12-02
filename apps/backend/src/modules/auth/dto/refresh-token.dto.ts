import { type } from 'arktype';

export const refreshTokenDtoSchema = type({
  refreshToken: "string >= 1"
});

export type RefreshTokenDto = typeof refreshTokenDtoSchema.infer
