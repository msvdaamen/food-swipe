import { eq } from "drizzle-orm";
import { DbService } from "../../common/db.service";
import { storageService, type StorageService } from "../../providers/storage/storage.service";
import { users } from "../../schema";
import type { AuthUser } from "./auth-user";



export class AuthService extends DbService {

  constructor(
    private readonly storageService: StorageService,
  ) {
    super();
  }

  async getAuthUser(userId: string) {
    const [user] = await this.database.select().from(users).where(eq(users.id, userId)).execute();
    user.image = this.getProfileImageUrl(user.image);
    return user;
  }

  getProfileImageUrl(filename: string | null): string | null {
    return filename ? storageService.getPublicUrl(filename) : null;
  }

  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    const [user] = await this.database.select().from(users).where(eq(users.id, userId)).execute();
    if (!user) throw new Error("User not found");

    const filename = await this.storageService.upload(file, {
      isPublic: true,
      path: "profiles"
    });

    try {
      await this.database.update(users)
        .set({ image: filename })
        .where(eq(users.id, user.id))
        .execute();
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

export const authService = new AuthService(storageService);
