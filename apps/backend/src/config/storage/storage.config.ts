import { z } from 'zod';

export const configSchema = z.object({
  STORAGE_PUBLIC_URL: z.string().url(),
  STORAGE_ACCESS_KEY_ID: z.string(),
  STORAGE_SECRET_ACCESS_KEY: z.string(),
  STORAGE_BUCKET: z.string(),
  STORAGE_ENDPOINT: z.string().url()
});

const parsedConfig = configSchema.parse(process.env);
export const storageConfig = {
  publicUrl: parsedConfig.STORAGE_PUBLIC_URL,
  accessKeyId: parsedConfig.STORAGE_ACCESS_KEY_ID,
  secretAccessKey: parsedConfig.STORAGE_SECRET_ACCESS_KEY,
  bucket: parsedConfig.STORAGE_BUCKET,
  endpoint: parsedConfig.STORAGE_ENDPOINT
};
