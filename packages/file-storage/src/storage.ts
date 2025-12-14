
export type StorageOptions = {
  isPublic?: boolean;
  path?: string;
  filename?: string;
}

export interface Storage {
  upload<T extends Blob>(file: T, options?: StorageOptions): Promise<string>
  get<T extends Blob>(file: string, options?: StorageOptions): Promise<T>
  delete(file: string, options?: StorageOptions): Promise<void>
}
