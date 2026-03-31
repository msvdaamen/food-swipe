import { DatabaseProvider } from "../../providers/database.provider";
import { NewUserEntity, sessions, UserEntity, users } from "../../schema";
import { NotFoundError } from "../../common/errors/not-found.error";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { GetUsersDto } from "./dto/get-users.dto";
import { PaginatedData } from "../../common/types/paginated-data";
import { CreatePagination } from "../../common/create-pagination";

export interface UserRepository {
  findById(userId: string): Promise<UserEntity>;
  updateUser(userId: string, payload: Partial<UserEntity>): Promise<void>;
  getUsers(payload: GetUsersDto): Promise<PaginatedData<UserEntity>>;
  create(payload: NewUserEntity): Promise<UserEntity>;

  getTotal(from: Date, until: Date): Promise<number>;
  getActive(from: Date, until: Date): Promise<number>;
  getNew(from: Date, until: Date): Promise<number>;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly database: DatabaseProvider) {}

  async findById(userId: string): Promise<UserEntity> {
    const [user] = await this.database.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      throw new NotFoundError({ id: userId, message: "User not found" });
    }
    return user;
  }

  async updateUser(userId: string, payload: Partial<UserEntity>): Promise<void> {
    await this.database.update(users).set(payload).where(eq(users.id, userId)).execute();
  }

  async getUsers(payload: GetUsersDto): Promise<PaginatedData<UserEntity>> {
    const { page, amount, sort } = payload;
    const sortColumn = this.getSortColumn(sort || "id");
    const [result, [{ total }]] = await Promise.all([
      this.database
        .select()
        .from(users)
        .orderBy(sortColumn)
        .limit(amount)
        .offset((page - 1) * amount),
      this.database
        .select({ total: count(users.id) })
        .from(users)
        .limit(1)
    ]);
    return {
      data: result,
      pagination: CreatePagination(total, amount, page)
    };
  }

  getSortColumn(column: keyof UserEntity) {
    switch (column) {
      case "createdAt":
        return users.id;
      default:
        return users.id;
    }
  }

  async create(payload: NewUserEntity): Promise<UserEntity> {
    const rows = await this.database.insert(users).values(payload).returning();
    const [newUser] = rows;
    if (!newUser) throw new Error("Insert returned no row");
    return newUser;
  }

  async getTotal(from: Date, until: Date): Promise<number> {
    const [result] = await this.database
      .select({ count: count(users.id) })
      .from(users)
      .where(and(gte(users.createdAt, from), lte(users.createdAt, until)))
      .limit(1);

    return result.count;
  }

  async getActive(from: Date, until: Date): Promise<number> {
    const [result] = await this.database
      .select({ count: sql`count(distinct ${users.id})`.mapWith(Number) })
      .from(users)
      .innerJoin(sessions, eq(users.id, sessions.userId))
      .where(and(gte(sessions.createdAt, from), lte(sessions.createdAt, until)))
      .limit(1);

    return result.count;
  }

  async getNew(from: Date, until: Date): Promise<number> {
    const [result] = await this.database
      .select({ count: count(users.id) })
      .from(users)
      .where(and(gte(users.createdAt, from), lte(users.createdAt, until)))
      .limit(1);

    return result.count;
  }
}
