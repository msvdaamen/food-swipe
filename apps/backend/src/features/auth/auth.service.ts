import type { StorageService } from "../../providers/storage/storage.service";
import { createUserService, UserService } from "../user/service";
import { KvStoreProvider } from "../../providers/kvstore.provider";
import { DatabaseProvider } from "../../providers/database.provider";

export class AuthService {
  constructor(
    private readonly storageService: StorageService,
    private readonly userService: UserService
  ) {}

  getAuthUser(userId: string) {
    return this.userService.findById(userId);
  }

  async uploadProfilePicture(userId: string, file: File) {
    const user = await this.userService.findById(userId);
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
    return filename;
  }
}

export function createAuthService(
  db: DatabaseProvider,
  kvStore: KvStoreProvider,
  storage: StorageService
) {
  const userService = createUserService(db, kvStore, storage);
  return new AuthService(storage, userService);
}
