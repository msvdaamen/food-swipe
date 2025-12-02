import { type } from 'arktype';

export const signUpDtoSchema = type({
  email: "string.email",
  username: "string >= 3",
  firstName: "string >= 1",
  lastName: "string >= 1",
  password: "string >= 3",
  passwordConfirmation: "string >= 3",
});

export type SignUpDto = typeof signUpDtoSchema.infer;
