import type { DefaultError, QueryKey, UseQueryOptions } from "@tanstack/react-query";

export type ApiQueryOverrides<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, QueryKey>, "queryKey" | "queryFn">;

export type ApiQueryOptions = {
  enabled?: boolean;
};
