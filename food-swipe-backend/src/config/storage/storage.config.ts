import { z } from 'zod';

export const configSchema = z.object({
  STORAGE_PROVIDER: z.enum(['file']),
  STORAGE_PUBLIC_URL: z.string().url()
});

const parsedConfig = configSchema.parse(process.env);
export const storageConfig = {
  provider: parsedConfig.STORAGE_PROVIDER,
  publicUrl: parsedConfig.STORAGE_PUBLIC_URL
};
