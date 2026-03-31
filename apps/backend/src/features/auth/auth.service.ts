import { Result } from "better-result";
import { storageService, type StorageService } from "../../providers/storage/storage.service";
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
        if (user.image) {
          yield* Result.await(
            this.storageService.delete(user.image, {
              isPublic: true
            })
          );
        }
        return Result.ok(filename);
      }.bind(this)
    );
  }
}

export function createAuthService(db: DatabaseProvider, kvStore: KvStoreProvider) {
  const userService = createUserService(db, kvStore);
  return new AuthService(storageService, userService);
}
