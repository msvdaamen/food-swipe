import { queryOptions } from "@tanstack/react-query";
import { client } from "./client";

export const getUsersQueryOptions = () => {
  return queryOptions({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await client.getUsers({});
      return response.users;
    },
  });
};
