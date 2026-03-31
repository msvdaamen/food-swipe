import { z } from "zod";

export const uploadProfilePictureDto = z
  .instanceof(File)
  .refine((f) => ["image/png", "image/jpeg", "image/webp"].includes(f.type), {
    message: "Expected image/png, image/jpeg, or image/webp"
  });
