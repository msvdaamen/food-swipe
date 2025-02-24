import { eq } from "drizzle-orm";
import { DbService } from "../../common/db.service";
import { users, type UserEntity } from "@food-swipe/database";

export class UserService extends DbService {
  async findById(userId: number): Promise<UserEntity | undefined> {
    const [user] = await this.database
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    const [user] = await this.database
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }

  async getUserStats() {}
}

export const userService = new UserService();
