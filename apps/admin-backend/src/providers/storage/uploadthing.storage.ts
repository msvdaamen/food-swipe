import { UTApi } from "uploadthing/server";
import type { Storage } from "./storage";
import type { BunFile } from "bun";
import {v4 as uuid} from "uuid";

export class UploadThingStorage implements Storage {
    utapi = new UTApi({
        apiKey: process.env.UPLOADTHING_SECRET
    });

    async upload(file: File, isPublic: boolean): Promise<string> {
        // @ts-ignore
        file.name = uuid() + '.' + file.name.split('.').pop();
        const response = await this.utapi.uploadFiles(file);
        if (response.error) {
            throw response.error;
        } 
        return response.data.key;
    }
    get(file: string, isPublic: boolean): Promise<BunFile> {

        throw new Error("Method not implemented.");
    }
    async delete(file: string, isPublic: boolean): Promise<void> {
        await this.utapi.deleteFiles(file);
    }
    
}