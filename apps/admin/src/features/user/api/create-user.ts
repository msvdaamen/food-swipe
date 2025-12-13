import { authClient } from "@/lib/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query";



type CreateUserInput = {
    email: string;
    password: string;
    name: string;
    username: string;
    role: string;
};

export async function createUser(input: CreateUserInput) {
 return await authClient.admin.createUser({
    email: input.email, // required
    password: input.password, // required
    name: input.name, // required
    role: input.role as "user" | "admin",
    data: { username: input.username },
 })
}


export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
