import { api } from "@/lib/api";
import { UserStats } from "../types/user-stats.type";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getUserStats = async () => {
  const response = await api.fetch("/v1/users/stats", {
    method: 'GET'
  });
  return response.json() as Promise<UserStats>;
};

export const getUserStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ["user-stats"],
    queryFn: getUserStats,
  });
};

export const useUserStats = () => useQuery(getUserStatsQueryOptions());
