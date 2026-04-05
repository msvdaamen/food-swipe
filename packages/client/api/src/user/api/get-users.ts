import type { PaginatedData, User } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { objectToSearchParams } from "../../internal/search-params";
import { userKeys } from "../keys";

export type GetUsersInput = {
  amount: number;
  page: number;
  sort: string;
};

type UserDto = Omit<User, "createdAt"> & {
  createdAt: string;
};

export type GetUsersDto = PaginatedData<UserDto>;

function mapGetUsersDtoToModel(dto: GetUsersDto): PaginatedData<User> {
  return {
    pagination: dto.pagination,
    data: dto.data.map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt),
    })),
  };
}

export const getUsers = async (api: AuthApiClient, payload: GetUsersInput) => {
  const searchParams = objectToSearchParams(payload);
  const response = await api.fetch(`/v1/users?${searchParams}`, {
    method: "GET",
  });
  const data = (await response.json()) as PaginatedData<UserDto>;
  return mapGetUsersDtoToModel(data);
};

export const getUsersQueryOptions = (api: AuthApiClient, payload: GetUsersInput) =>
  queryOptions({
    queryKey: userKeys.list(payload),
    queryFn: () => getUsers(api, payload),
  });

export const useUsers = (payload: GetUsersInput) => {
  const api = useApiClient();
  return useQuery(getUsersQueryOptions(api, payload));
};
