import { eq } from "drizzle-orm";
import { DbService } from "../../common/db.service";
import { usersSchema, type UserEntity } from "./schema/user.schema";


export class UserService extends DbService {

    async findById(userId: number): Promise<UserEntity | undefined> {
        const [user] = await this.database.select().from(usersSchema).where(eq(usersSchema.id, userId)).limit(1);
        return user;
    }
    
    async findByEmail(email: string): Promise<UserEntity | undefined> {
        const [user] = await this.database.select().from(usersSchema).where(eq(usersSchema.email, email)).limit(1);
        return user;
    }
}

export const userService = new UserService();