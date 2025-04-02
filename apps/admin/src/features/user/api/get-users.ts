import { objectToSearchParams } from "@/lib/utils";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { User } from "../types/user.type";
import { PaginatedData } from "@/types/paginated-data";
import { httpApi } from "@/lib/api";

export type GetUsersInput = {
  amount: number;
  page: number;
  sort: string;
};

export const getUsers = (payload: GetUsersInput) => {
  const searchParams = objectToSearchParams(payload);
  return httpApi.get<PaginatedData<User>>(`/v1/users?${searchParams}`);
};

export const getUsersQueryOptions = (payload: GetUsersInput) => {
  return queryOptions({
    queryKey: ["users", payload],
    queryFn: () => getUsers(payload),
  });
};

export const useUsers = (payload: GetUsersInput) =>
  useQuery(getUsersQueryOptions(payload));
