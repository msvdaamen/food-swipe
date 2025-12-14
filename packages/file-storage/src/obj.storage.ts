import { S3Client } from "bun";
import type { Storage, StorageOptions } from "./storage";
import mime from 'mime/lite';

export class ObjStorage implements Storage {
    private client: S3Client;

    constructor(
        accessKeyId: string,
        secretAccessKey: string,
        private readonly bucket: string,
        endpoint: string
    ) {
        this.client = new S3Client({
            accessKeyId,
            secretAccessKey,
            bucket,
            endpoint
          });
    }

    async upload<T extends Blob>(file: T, options?: StorageOptions): Promise<string> {
        const { isPublic = false, path = "", filename: customFilename } = options || {};

        const filename = this.formatPath(path) + (customFilename || crypto.randomUUID() + '.' + this.getExtension(file.type));

        await this.client.write(filename, await file.arrayBuffer(), {bucket: this.getBucket(isPublic)})
        return filename;
    }

    async get<T extends Blob>(file: string, options?: StorageOptions): Promise<T> {
      const { isPublic = false } = options || {};
        return await this.client.file(file, {bucket: this.getBucket(isPublic)}) as unknown as T;
    }

    async delete(file: string, options?: StorageOptions): Promise<void> {
      const { isPublic = false } = options || {};
        await this.client.delete(file, {bucket: this.getBucket(isPublic)});
    }

    private getBucket(isPublic: boolean): string {
        return isPublic ? this.bucket + '-public' : this.bucket;
    }

    private getExtension(type: string) {
        return mime.getExtension(type);
    }

    private formatPath(path: string) {
      if (!path) {
        return '/';
      }
      if (path.startsWith('/')) {
        path = path.substring(1);
      }

      if (!path.endsWith('/')) {
        path += '/';
      }

      return path;
    }
}
