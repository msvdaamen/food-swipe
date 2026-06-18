import type { PaginatedData, User } from "@food-swipe/types";
import type { HttpClient } from "../../client";
import { objectToSearchParams } from "../../internal/search-params";

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

export const getUsers = async (api: HttpClient, payload: GetUsersInput) => {
  const searchParams = objectToSearchParams(payload);
  const response = await api.fetch(`/v1/users?${searchParams}`, {
    method: "GET",
  });
  const data = (await response.json()) as PaginatedData<UserDto>;
  return mapGetUsersDtoToModel(data);
};
