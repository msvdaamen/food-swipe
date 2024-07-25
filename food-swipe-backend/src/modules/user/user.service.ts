import { eq } from "drizzle-orm";
import { DbService } from "../../common/db.service";
import { users, type NewUser, type User } from "./schema/user.schema";


export class UserService extends DbService {

    findById(userId: number): Promise<User | undefined> {
        return this.database.select().from(users).where(eq(users.id, userId)).limit(1).then(([user]) => user);
    }
    
    findByEmail(email: string): Promise<User | undefined>{
        return this.database.select().from(users).where(eq(users.email, email)).limit(1).then(([user]) => user);
    }

    async create(user: NewUser): Promise<User> {
        const [newUser] = await this.database.insert(users).values(user).returning();
        if (!newUser) {
          throw new Error('User not created');
        }
        return newUser;
      }
    
}

export const userService = new UserService();