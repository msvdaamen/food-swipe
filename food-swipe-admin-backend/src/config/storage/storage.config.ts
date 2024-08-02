import { z } from 'zod';

export const configSchema = z.object({
  STORAGE_PUBLIC_URL: z.string().url()
});

const parsedConfig = configSchema.parse(process.env);
export const storageConfig = {
  publicUrl: parsedConfig.STORAGE_PUBLIC_URL
};
