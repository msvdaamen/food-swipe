import { z } from 'zod';

export const configSchema = z.object({
  STORAGE_PUBLIC_URL: z.string().url(),
  UPLOADTHING_SECRET: z.string(),
});

const parsedConfig = configSchema.parse(process.env);
export const storageConfig = {
  publicUrl: parsedConfig.STORAGE_PUBLIC_URL,
  uploadThingSecret: parsedConfig.UPLOADTHING_SECRET,
};
