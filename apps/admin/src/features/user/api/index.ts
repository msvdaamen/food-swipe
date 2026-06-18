import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getUserStats,
  uploadProfilePicture,
  type GetUsersInput,
  type MeUser,
  type UploadProfilePictureResult
} from "@food-swipe/client-api/user";
import { api } from "@/lib/api";

export { type GetUsersInput, type MeUser, type UploadProfilePictureResult };

export const getUsersQueryOptions = (payload: GetUsersInput) =>
  queryOptions({
    queryKey: ["users", payload],
    queryFn: () => getUsers(api, payload)
  });

export const useUsers = (payload: GetUsersInput) => useQuery(getUsersQueryOptions(payload));
export const getUserStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["user-stats"],
    queryFn: () => getUserStats(api)
  });

export const useUserStats = () => useQuery(getUserStatsQueryOptions());

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uri: string) => uploadProfilePicture(api, uri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    }
  });
};
