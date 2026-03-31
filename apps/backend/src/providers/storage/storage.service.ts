export type StorageOptions = {
  isPublic?: boolean;
  path?: string;
  filename?: string;
};

function formatPath(path: string | undefined): string {
  if (!path) return "";
  let p = path.startsWith("/") ? path.slice(1) : path;
  if (p && !p.endsWith("/")) p += "/";
  return p;
}

function extensionFromType(contentType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif"
  };
  return map[contentType] ?? "bin";
}

function objectKey(file: File | Blob, options?: StorageOptions): string {
  const prefix = formatPath(options?.path);
  if (options?.filename) {
    return `${prefix}${options.filename}`.replace(/^\/+/, "");
  }
  const type = file.type || "application/octet-stream";
  const ext = extensionFromType(type);
  return `${prefix}${crypto.randomUUID()}.${ext}`.replace(/^\/+/, "");
}

export class StorageService {
  constructor(
    private readonly publicBucket: R2Bucket,
    private readonly privateBucket: R2Bucket,
    private readonly publicBaseUrl: string
  ) {}

  getPublicUrl(key: string): string {
    const base = this.publicBaseUrl.replace(/\/$/, "");
    const path = key.replace(/^\//, "");
    return `${base}/${encodeURI(path)}`;
  }

  private pickBucket(isPublic: boolean): R2Bucket {
    return isPublic ? this.publicBucket : this.privateBucket;
  }

  async upload<T extends Blob>(file: T, options?: StorageOptions): Promise<string> {
    const isPublic = options?.isPublic ?? false;
    const bucket = this.pickBucket(isPublic);
    const key = objectKey(file, options);
    const body = await file.arrayBuffer();
    const contentType =
      file instanceof File && file.type ? file.type : "application/octet-stream";
    await bucket.put(key, body, {
      httpMetadata: { contentType }
    });
    return key;
  }

  async delete(key: string, options?: StorageOptions): Promise<void> {
    const isPublic = options?.isPublic ?? false;
    const bucket = this.pickBucket(isPublic);
    await bucket.delete(key.replace(/^\//, ""));
  }

  async get(key: string, options?: StorageOptions): Promise<R2ObjectBody | null> {
    const isPublic = options?.isPublic ?? false;
    const bucket = this.pickBucket(isPublic);
    return await bucket.get(key.replace(/^\//, ""));
  }
}

export function createStorageService(env: Env): StorageService {
  return new StorageService(env.R2_PUBLIC, env.R2_PRIVATE, env.STORAGE_PUBLIC_URL);
}
