import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { userKeys } from "../keys";

export type UploadProfilePictureResult = {
  filename: string;
};

/**
 * Upload a profile image. `uri` is a React Native local file URI (e.g. from ImagePicker).
 */
export const uploadProfilePicture = async (
  api: AuthApiClient,
  uri: string,
): Promise<UploadProfilePictureResult> => {
  const uriArray = uri.split(".");
  const fileType = uriArray[uriArray.length - 1] ?? "jpg";

  const formData = new FormData();
  formData.append(
    "file",
    { uri, name: `photo.${fileType}`, type: `image/${fileType}` } as unknown as Blob,
  );

  const response = await api.fetch("/v1/me/profile-picture", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload profile picture");
  }

  return response.json() as Promise<UploadProfilePictureResult>;
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
