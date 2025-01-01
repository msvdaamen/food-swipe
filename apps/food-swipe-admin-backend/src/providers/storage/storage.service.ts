import { type FileEntity as FileModel, files } from './file.schema';
import { FileUploadException } from './file-upload.exception';
import { eq } from 'drizzle-orm';
import { FileNotFoundException } from './file-not-found.exception';
import {DbService} from "../../common/db.service";
import { storageProvider, type Storage } from './storage';
import { storageConfig } from '../../config/storage/storage.config';
import type { BunFile } from 'bun';

export class StorageService extends DbService {
  constructor(
    private readonly storage: Storage
  ) {
    super();
  }

  async upload(userId: number, file: File, isPublic: boolean): Promise<FileModel> {
    try {
      const result = await this.transaction(async(transaction) => {
        const filename = await this.storage.upload(file, isPublic);
        const [createdFile] = await transaction.insert(files).values({
          userId,
          filename,
          isPublic,
          type: file.type
        }).returning();
        return createdFile;
      });
      if (!result) {
        throw new FileUploadException();
      }
      return result;
    } catch (e) {
      console.log(e);
      throw new FileUploadException();
    }
  }

  async getFile(fileId: number): Promise<FileModel> {
    const [file] = await this.database.select().from(files).where(eq(files.id, fileId)).limit(1);
    if (!file) {
      throw new FileNotFoundException();
    }
    return file;
  }

  public getPublicUrl(filename: string): string {
    return storageConfig.publicUrl + `/${filename}`;
  }

  async get(filename: string): Promise<BunFile> {
    return await this.storage.get(filename, false);
  }

  async delete(fileId: number): Promise<void> {
    const oldFile = await this.getFile(fileId);
    if (!oldFile) {
      throw new FileNotFoundException();
    }
    await this.transaction(async(transaction) => {
      const [file] = await transaction.delete(files).where(eq(files.id, oldFile.id)).returning();
      if (!file) {
        throw new FileNotFoundException();
      }
      await this.storage.delete(oldFile.filename, file.isPublic);
    });
  }
}
export const storageService = new StorageService(storageProvider);

