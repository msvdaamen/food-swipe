import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { MeUser } from "../me.types";
import { userKeys } from "../keys";

export const getMe = async (): Promise<MeUser> => {
  const response = await api.fetch("/v1/me");
  if (!response.ok) {
    throw new Error("Not authenticated");
  }
  return response.json() as Promise<MeUser>;
};

export const getMeQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.me(),
    queryFn: getMe,
  });

export const useMe = () => {
  return useQuery(getMeQueryOptions());
};
