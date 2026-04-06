import type { DefaultError, QueryKey, UseQueryOptions } from "@tanstack/react-query";

/**
 * React Query options merged after `queryKey` / `queryFn` (e.g. `enabled`, `staleTime`, `select`).
 * Use this as the last argument on `*QueryOptions` and the second argument on `use*` hooks.
 */
export type ApiQueryOverrides<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, QueryKey>, "queryKey" | "queryFn">;
