import { api } from "@/lib/api";
import { UserStats } from "../types/user-stats.type";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getUserStats = async () => {
  return api.get<UserStats>("/v1/users/stats");
};

export const getUserStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ["user-stats"],
    queryFn: getUserStats,
  });
};

export const useUserStats = () => useQuery(getUserStatsQueryOptions());
