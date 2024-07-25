import { z } from 'zod';
import { configSchema as MainConfigSchema } from './storage.config';

const configSchema = MainConfigSchema.extend({
  S3_BUCKET_NAME: z.string().optional(),
  S3_BUCKET_REGION: z.string().optional(),
  S3_BUCKET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET_SECRET_KEY: z.string().optional()
});

const parsedConfig = configSchema.parse(process.env);

export const s3StorageConfig = {
  provider: parsedConfig.STORAGE_PROVIDER,
  bucketName: parsedConfig.S3_BUCKET_NAME ?? '',
  region: parsedConfig.S3_BUCKET_REGION ?? '',
  accessKeyId: parsedConfig.S3_BUCKET_ACCESS_KEY ?? '',
  secretAccessKey: parsedConfig.S3_BUCKET_SECRET_KEY ?? ''
};
