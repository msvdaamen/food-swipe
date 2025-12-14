import { AuthUser } from "../types/auth-user";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export async function me(): Promise<AuthUser> {
  const response = await api.fetch("/v1/me");

  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  const user = await response.json();
  console.log(user);

  return user;
}

export const meQueryOptions = () =>
  queryOptions({
    queryKey: ["me"],
    queryFn: me,
  });

export const useMe = () => useQuery(meQueryOptions());
