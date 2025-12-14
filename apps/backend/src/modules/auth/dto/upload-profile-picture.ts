import { type } from "arktype";
import { z } from "zod";

export const uploadProfilePictureDto = z.file()
  .mime(["image/png", "image/jpeg", "image/webp"]);
