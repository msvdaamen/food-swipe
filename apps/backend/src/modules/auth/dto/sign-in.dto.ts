import { type } from "arktype";

export const signInDtoSchema = type({
  email: "string.email",
  password: "string >= 8"
});

export type SignInDto = typeof signInDtoSchema.infer;
