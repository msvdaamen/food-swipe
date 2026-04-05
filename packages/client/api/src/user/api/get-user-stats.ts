import type { UserStats } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { userKeys } from "../keys";

export const getUserStats = async (api: AuthApiClient) => {
  const response = await api.fetch("/v1/users/stats", {
    method: "GET",
  });
  return response.json() as Promise<UserStats>;
};

export const getUserStatsQueryOptions = (api: AuthApiClient) =>
  queryOptions({
    queryKey: userKeys.stats(),
    queryFn: () => getUserStats(api),
  });

export const useUserStats = () => {
  const api = useApiClient();
  return useQuery(getUserStatsQueryOptions(api));
};
