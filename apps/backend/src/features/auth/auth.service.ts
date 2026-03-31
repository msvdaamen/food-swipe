import { Result } from "better-result";
import type { StorageService } from "../../providers/storage/storage.service";
import { createUserService, UserService } from "../user/service";
import { KvStoreProvider } from "../../providers/kvstore.provider";
import { DatabaseProvider } from "../../providers/database.provider";

export class AuthService {
  constructor(
    private readonly storageService: StorageService,
    private readonly userService: UserService
  ) {}

  async getAuthUser(userId: string) {
    return await this.userService.findById(userId);
  }

  async uploadProfilePicture(userId: string, file: File) {
    return Result.gen(
      async function* (this: AuthService) {
        const user = yield* Result.await(this.userService.findById(userId));
        const filename = yield* Result.await(
          this.storageService.upload(file, {
            isPublic: true,
            path: "profiles"
          })
        );
        const uploadResult = await this.userService.updateUser(userId, { image: filename });
        if (uploadResult.isErr()) {
          yield* Result.await(
            this.storageService.delete(filename, {
              isPublic: true
            })
          );
          return Result.err(uploadResult.error);
        }
        const imageKey = user.image;
        if (imageKey) {
          yield* Result.await(
            this.storageService.delete(imageKey, {
              isPublic: true
            })
          );
        }
        return Result.ok(filename);
      }.bind(this)
    );
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
