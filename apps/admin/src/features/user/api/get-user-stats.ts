import type { UserStats } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { userKeys } from "./keys";

export const getUserStats = async () => {
  const response = await api.fetch("/v1/users/stats", {
    method: "GET",
  });
  return response.json() as Promise<UserStats>;
};

export const getUserStatsQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.stats(),
    queryFn: getUserStats,
  });

export const useUserStats = () => {
  return useQuery(getUserStatsQueryOptions());
};
