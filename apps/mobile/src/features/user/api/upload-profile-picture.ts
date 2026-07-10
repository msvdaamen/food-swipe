import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { File } from "expo-file-system";

export type UploadProfilePictureInput = {
  uri: string;
};

export type UploadProfilePictureResult = {
  filename: string;
};

export async function uploadProfilePicture(
  { uri }: UploadProfilePictureInput,
): Promise<UploadProfilePictureResult> {
  const formData = new FormData();
  formData.append("file", new File(uri));

  const response = await api.fetch("/v1/me/profile-picture", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload profile picture");
  }

  return response.json();
}

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UploadProfilePictureInput) => uploadProfilePicture(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
