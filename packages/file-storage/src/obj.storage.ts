import { type BunFile, S3Client } from "bun";
import type { Storage } from "./storage";
import {v4 as uuid} from "uuid";
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
    
    async upload<T extends Blob>(file: T, isPublic: boolean): Promise<string> {
        const filename = uuid() + '.' + this.getExtension(file.type);
        await this.client.write(filename, file, {bucket: this.getBucket(isPublic)})
        return filename;
    }

    async get<T extends Blob>(file: string, isPublic: boolean): Promise<T> {
        return await this.client.file(file, {bucket: this.getBucket(isPublic)}) as unknown as T;
    }

    async delete(file: string, isPublic: boolean): Promise<void> {
        await this.client.delete(file, {bucket: this.getBucket(isPublic)});
    }  
    
    private getBucket(isPublic: boolean): string {
        return isPublic ? this.bucket + '-public' : this.bucket;
    }

    private getExtension(type: string) {
        return mime.getExtension(type);
    }
}