import { storageConfig } from '../../config/storage/storage.config';
import type { BunFile } from 'bun';
import { ObjStorage, type Storage } from '@food-swipe/file-storage';
import { Logger } from '../../common/logger';
import { startSpan } from '@sentry/bun';

export class StorageService {

  logger = new Logger(StorageService.name);

  constructor(
    private readonly storage: Storage
  ) {}

  async upload(file: File|BunFile, isPublic: boolean): Promise<string> {
    return startSpan({name: 'Upload file', op: 'storage.service'}, async () => {
      return await this.storage.upload(file, isPublic);
    });
  }

  public getPublicUrl(filename: string): string {
    return storageConfig.publicUrl + `/${filename}`;
  }

  async get(filename: string, isPublic: boolean = false): Promise<BunFile> {
    return await this.storage.get(filename, isPublic);
  }

  async delete(fileName: string, isPublic: boolean = false): Promise<void> {
    await startSpan({name: 'Upload file', op: 'storage.service'}, async () => {
      await this.storage.delete(fileName, isPublic);
    });
  }
}

export const objectStorage = new ObjStorage(
  storageConfig.accessKeyId,
  storageConfig.secretAccessKey,
  storageConfig.bucket,
  storageConfig.endpoint
);
export const storageService = new StorageService(objectStorage);
