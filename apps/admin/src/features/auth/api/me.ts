import { api } from "@/lib/api";
import { getMe } from "@food-swipe/client-api/user";
import { queryOptions } from "@tanstack/react-query";

export const getMeQueryOptions = () =>
  queryOptions({
    queryKey: ["me"],
    queryFn: () => getMe(api)
  });
