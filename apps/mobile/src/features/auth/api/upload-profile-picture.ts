import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meQueryOptions } from "./me";

export async function uploadProfilePicture(uri: string): Promise<string> {
  let uriArray = uri.split(".");
  let fileType = uriArray[uriArray.length - 1];

  const formData = new FormData();
  formData.append("file", {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  const response = await api.fetch("/v1/me/profile-picture", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    console.error(
      "Failed to upload profile picture " +
        response.status +
        (await response.text()),
    );
    throw new Error("Failed to upload profile picture");
  }

  return response.json();
}

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries(meQueryOptions());
    },
  });
};
