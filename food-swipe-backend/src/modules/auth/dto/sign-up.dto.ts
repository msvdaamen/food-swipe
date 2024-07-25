import { z } from 'zod';

export const signUpDtoSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(3),
  passwordConfirmation: z.string().min(3),
});

export type SignUpDto = z.infer<typeof signUpDtoSchema>;
