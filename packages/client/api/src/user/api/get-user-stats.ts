import type { UserStats } from "@food-swipe/types";
import type { HttpClient } from "../../client";

export const getUserStats = async (api: HttpClient) => {
  const response = await api.fetch("/v1/users/stats", {
    method: "GET",
  });
  return response.json() as Promise<UserStats>;
};
