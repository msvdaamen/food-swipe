import type { StorageService } from "../../providers/storage/storage.service";
import { createUserService, UserService } from "../user/service";
import { KvStoreProvider } from "../../providers/kvstore.provider";
import { DatabaseProvider } from "../../providers/database.provider";
import { UserModel } from "../user/types/user.model";
import { Result } from "better-result";
import { NotFoundError2 } from "../../common/errors/not-found.error";

export interface AuthService {
  getAuthUser(userId: string): Promise<Result<UserModel, NotFoundError2>>;
  uploadProfilePicture(userId: string, file: File): Promise<Result<string, NotFoundError2>>;
}

export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly storageService: StorageService,
    private readonly userService: UserService
  ) {}

  getAuthUser(userId: string) {
    return this.userService.findById(userId);
  }

  async uploadProfilePicture(userId: string, file: File): Promise<Result<string, NotFoundError2>> {
    const result = await this.userService.findById(userId);
    if (result.isErr()) return Result.err(result.error);
    const user = result.value;

    const filename = await this.storageService.upload(file, {
      isPublic: true,
      path: "profiles"
    });
    try {
      await this.userService.updateUser(userId, { image: filename });
    } catch (e) {
      await this.storageService.delete(filename, {
        isPublic: true
      });
      throw e;
    }
    const imageKey = user.image;
    if (imageKey) {
      await this.storageService.delete(imageKey, {
        isPublic: true
      });
    }
    return Result.ok(filename);
  }
}

export function createAuthService(
  db: DatabaseProvider,
  kvStore: KvStoreProvider,
  storage: StorageService
): AuthService {
  const userService = createUserService(db, kvStore, storage);
  return new AuthServiceImpl(storage, userService);
}
