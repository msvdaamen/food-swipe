
import { authClient } from "@/lib/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query";


type UpdateUserInput = {
  id: string;
  email: string;
  password: string;
  name: string;
  username: string;
  role: string;
};

export async function updateUser(input: UpdateUserInput) {
 return await authClient.admin.updateUser({
   userId: input.id,
   data: {
     email: input.email, // required
     password: input.password || undefined, // required
     name: input.name, // required
     role: input.role as "user" | "admin",
     username: input.username
   }
 })
}


export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
