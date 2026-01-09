import { type } from 'arktype';

export const configSchema = type({
  STORAGE_PUBLIC_URL: 'string.url',
  STORAGE_ACCESS_KEY_ID: 'string',
  STORAGE_SECRET_ACCESS_KEY: 'string',
  STORAGE_BUCKET: 'string',
  STORAGE_ENDPOINT: 'string.url'
});

const parsedConfig = configSchema.assert(process.env);
export const storageConfig = {
  publicUrl: parsedConfig.STORAGE_PUBLIC_URL,
  accessKeyId: parsedConfig.STORAGE_ACCESS_KEY_ID,
  secretAccessKey: parsedConfig.STORAGE_SECRET_ACCESS_KEY,
  bucket: parsedConfig.STORAGE_BUCKET,
  endpoint: parsedConfig.STORAGE_ENDPOINT
};
