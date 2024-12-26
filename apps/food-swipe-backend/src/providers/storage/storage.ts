import type { BunFile } from 'bun';
import { UploadThingStorage } from './uploadthing.storage';

export interface Storage {
  upload(file: File, isPublic: boolean): Promise<string>
  get(file: string, isPublic: boolean): Promise<BunFile>
  delete(file: string, isPublic: boolean): Promise<void>
}
export const storageProvider = new UploadThingStorage();

