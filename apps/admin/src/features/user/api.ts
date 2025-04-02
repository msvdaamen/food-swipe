import { httpApi } from "@/lib/api";
import { UserStats } from "./types/user-stats.type";
import { User } from "./types/user.type";
import { PaginatedData } from "@/types/paginated-data";

export class UserApi {
  public async getStats() {
    const response = await httpApi.get<UserStats>("/v1/users/stats");
    return response;
  }

  public async getUsers({
    amount,
    page,
    sort,
  }: {
    amount: number;
    page: number;
    sort: string;
  }) {
    const searchParams = new URLSearchParams();
    searchParams.set("amount", amount.toString());
    searchParams.set("page", page.toString());
    searchParams.set("sort", sort);

    const response = await httpApi.get<PaginatedData<User>>(
      `/v1/users?${searchParams}`
    );
    return response;
  }
}

export const userApi = new UserApi();
