export interface Storage {
  upload<T extends Blob>(file: T, isPublic: boolean): Promise<string>
  get<T extends Blob>(file: string, isPublic: boolean): Promise<T>
  delete(file: string, isPublic: boolean): Promise<void>
}

