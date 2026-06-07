import type { HttpClient } from "../../client";

export type UploadProfilePictureResult = {
  filename: string;
};

/**
 * Upload a profile image. `uri` is a React Native local file URI (e.g. from ImagePicker).
 */
export const uploadProfilePicture = async (
  api: HttpClient,
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
