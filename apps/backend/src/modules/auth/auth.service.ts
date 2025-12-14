import {
  storageService,
  type StorageService,
} from "../../providers/storage/storage.service";
import { userService, type UserService } from "../user/user.service";

export class AuthService {
  constructor(
    private readonly storageService: StorageService,
    private readonly userService: UserService,
  ) {}

  async getAuthUser(userId: string) {
    return await this.userService.findById(userId);
  }

  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    const user = await this.userService.findById(userId);
    if (!user) throw new Error("User not found");

    const filename = await this.storageService.upload(file, {
      isPublic: true,
      path: "profiles",
    });

    try {
      await this.userService.updateUser(userId, { image: filename });
    } catch (error) {
      await this.storageService.delete(filename, {
        isPublic: true,
      });
      throw error;
    }

    if (user.image) {
      await this.storageService.delete(user.image, {
        isPublic: true,
      });
    }

    return filename;
  }
}

export const authService = new AuthService(storageService, userService);
