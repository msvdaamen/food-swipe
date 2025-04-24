import { eq } from "drizzle-orm";
import { DbService } from "../../common/db.service";
import { users, type NewUserEntity, type UserEntity } from "@food-swipe/database";


export class UserService extends DbService {

    findById(userId: number): Promise<UserEntity | undefined> {
        return this.database.select().from(users).where(eq(users.id, userId)).limit(1).then(([user]) => user);
    }
    
    findByEmail(email: string): Promise<UserEntity | undefined>{
        return this.database.select().from(users).where(eq(users.email, email)).limit(1).then(([user]) => user);
    }

    async create(user: NewUserEntity): Promise<UserEntity> {
        const [newUser] = await this.database.insert(users).values(user).returning();
        if (!newUser) {
          throw new Error('User not created');
        }
        return newUser;
      }
    
}

export const userService = new UserService();