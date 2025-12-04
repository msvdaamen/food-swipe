import { objectToSearchParams } from "@/lib/utils";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { User } from "../types/user.type";
import { PaginatedData } from "@/types/paginated-data";
import { api } from "@/lib/api";

export type GetUsersInput = {
  amount: number;
  page: number;
  sort: string;
};

export const getUsers = async (payload: GetUsersInput) => {
  const searchParams = objectToSearchParams(payload);
  const response = await api.fetch(`/v1/users?${searchParams}`, {
    method: 'GET'
  });
  return response.json() as Promise<PaginatedData<User>>;
};

export const getUsersQueryOptions = (payload: GetUsersInput) => {
  return queryOptions({
    queryKey: ["users", payload],
    queryFn: () => getUsers(payload),
  });
};

export const useUsers = (payload: GetUsersInput) =>
  useQuery(getUsersQueryOptions(payload));
