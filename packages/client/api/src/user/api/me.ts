import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import type { MeUser } from "../me.types";
import { userKeys } from "../keys";

export const getMe = async (api: AuthApiClient): Promise<MeUser> => {
  const response = await api.fetch("/v1/me");
  if (!response.ok) {
    throw new Error("Not authenticated");
  }
  return response.json() as Promise<MeUser>;
};

export const getMeQueryOptions = (api: AuthApiClient) =>
  queryOptions({
    queryKey: userKeys.me(),
    queryFn: () => getMe(api),
  });

export const useMe = () => {
  const api = useApiClient();
  return useQuery(getMeQueryOptions(api));
};
