import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  getUsers,
  getUserStats,
  uploadProfilePicture,
  userKeys,
  type GetUsersInput,
  type MeUser,
  type UploadProfilePictureResult,
} from "@food-swipe/client-api/user";
import { useApiClient } from "@/lib/api-client-context";

export { userKeys, type GetUsersInput, type MeUser, type UploadProfilePictureResult };

export const getUsersQueryOptions = (api: Parameters<typeof getUsers>[0], payload: GetUsersInput) =>
  queryOptions({
    queryKey: userKeys.list(payload),
    queryFn: () => getUsers(api, payload),
  });

export const useUsers = (payload: GetUsersInput) => {
  const api = useApiClient();
  return useQuery(getUsersQueryOptions(api, payload));
};

export const getUserStatsQueryOptions = (api: Parameters<typeof getUserStats>[0]) =>
  queryOptions({
    queryKey: userKeys.stats(),
    queryFn: () => getUserStats(api),
  });

export const useUserStats = () => {
  const api = useApiClient();
  return useQuery(getUserStatsQueryOptions(api));
};

export const getMeQueryOptions = (api: Parameters<typeof getMe>[0]) =>
  queryOptions({
    queryKey: userKeys.me(),
    queryFn: () => getMe(api),
  });

export const useMe = () => {
  const api = useApiClient();
  return useQuery(getMeQueryOptions(api));
};

export const useUploadProfilePicture = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uri: string) => uploadProfilePicture(api, uri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};
