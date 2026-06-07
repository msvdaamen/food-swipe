import type { HttpClient } from "../../client";
import type { MeUser } from "../me.types";

export const getMe = async (api: HttpClient): Promise<MeUser> => {
  const response = await api.fetch("/v1/me");
  if (!response.ok) {
    throw new Error("Not authenticated");
  }
  return response.json() as Promise<MeUser>;
};
