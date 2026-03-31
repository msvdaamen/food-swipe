import { Result, UnhandledException } from "better-result";
import { DatabaseProvider } from "../../providers/database.provider";
import { NewUserEntity, sessions, UserEntity, users } from "../../schema";
import { NotFoundError } from "../../common/errors/not-found.error";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { GetUsersDto } from "./dto/get-users.dto";
import { PaginatedData } from "../../common/types/paginated-data";
import { CreatePagination } from "../../common/create-pagination";

export interface UserRepository {
  findById(userId: string): Promise<Result<UserEntity, NotFoundError>>;
  updateUser(userId: string, payload: Partial<UserEntity>): Promise<void>;
  getUsers(payload: GetUsersDto): Promise<Result<PaginatedData<UserEntity>, UnhandledException>>;
  create(payload: NewUserEntity): Promise<Result<UserEntity, UnhandledException>>;

  getTotal(from: Date, until: Date): Promise<Result<number, UnhandledException>>;
  getActive(from: Date, until: Date): Promise<Result<number, UnhandledException>>;
  getNew(from: Date, until: Date): Promise<Result<number, UnhandledException>>;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly database: DatabaseProvider) {}

  async findById(userId: string): Promise<Result<UserEntity, NotFoundError>> {
    const [user] = await this.database.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return Result.err(new NotFoundError({ id: userId, message: "User not found" }));
    }
    return Result.ok(user);
  }

  async updateUser(userId: string, payload: Partial<UserEntity>): Promise<void> {
    await this.database.update(users).set(payload).where(eq(users.id, userId)).execute();
  }

  async getUsers(
    payload: GetUsersDto
  ): Promise<Result<PaginatedData<UserEntity>, UnhandledException>> {
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
    return Result.ok({
      data: result,
      pagination: CreatePagination(total, amount, page)
    });
  }

  getSortColumn(column: keyof UserEntity) {
    switch (column) {
      case "createdAt":
        return users.id;
      default:
        return users.id;
    }
  }

  async create(payload: NewUserEntity): Promise<Result<UserEntity, UnhandledException>> {
    const result = await Result.tryPromise(() =>
      this.database.insert(users).values(payload).returning()
    );
    if (result.isErr()) {
      return Result.err(result.error);
    }
    const [newUser] = result.value;
    return Result.ok(newUser);
  }

  async getTotal(from: Date, until: Date): Promise<Result<number, UnhandledException>> {
    const [result] = await this.database
      .select({ count: count(users.id) })
      .from(users)
      .where(and(gte(users.createdAt, from), lte(users.createdAt, until)))
      .limit(1);

    return Result.ok(result.count);
  }

  async getActive(from: Date, until: Date): Promise<Result<number, UnhandledException>> {
    const [result] = await this.database
      .select({ count: sql`count(distinct ${users.id})`.mapWith(Number) })
      .from(users)
      .innerJoin(sessions, eq(users.id, sessions.userId))
      .where(and(gte(sessions.createdAt, from), lte(sessions.createdAt, until)))
      .limit(1);

    return Result.ok(result.count);
  }

  async getNew(from: Date, until: Date): Promise<Result<number, UnhandledException>> {
    const [result] = await this.database
      .select({ count: count(users.id) })
      .from(users)
      .where(and(gte(users.createdAt, from), lte(users.createdAt, until)))
      .limit(1);

    return Result.ok(result.count);
  }
}
