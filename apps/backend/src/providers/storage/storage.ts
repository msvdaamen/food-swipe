import type { BunFile } from 'bun';

export interface Storage {
  upload(file: File, isPublic: boolean): Promise<string>
  get(file: string, isPublic: boolean): Promise<BunFile>
  delete(file: string, isPublic: boolean): Promise<void>
}
