import { api } from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type MeUser = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  image: string | null;
  imageUrl: string | null;
  role: string;
};

export async function getMe(): Promise<MeUser> {
  const response = await api.fetch("/v1/me");
  if (!response.ok) {
    throw new Error("Not authenticated");
  }
  return response.json() as Promise<MeUser>;
};

export const getMeQueryOptions = () =>
  queryOptions({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });

export const useMe = () => useQuery(getMeQueryOptions());
