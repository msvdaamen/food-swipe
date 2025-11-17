import { and, count, eq, getTableColumns, gte, lte, sql } from "drizzle-orm";
import { DbService } from "../../common/db.service";
import {
  authRefreshTokens,
  users,
  type UserEntity,
} from "../../schema";
import { getUsersDto, type GetUsersDto } from "./dto/get-users.dto";
import { CreatePagination } from "../../common/create-pagination";
import type { UserModel } from "./models/user.model";
import type { PaginatedData } from "../../common/types/paginated-data";
import {
  cacheProvider,
  type CacheProvider,
} from "../../providers/cache.provider";
import { format } from "date-fns";
const { password: _, ...columns } = getTableColumns(users);

export class UserService extends DbService {
  constructor(private readonly cache: CacheProvider) {
    super();
  }

  async findById(userId: number): Promise<UserModel | undefined> {
    const [user] = await this.database
      .select(columns)
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return user;
  }

  async findByEmailWithPassword(
    email: string
  ): Promise<UserEntity | undefined> {
    const [user] = await this.database
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }

  async findByEmail(email: string): Promise<UserModel | undefined> {
    const [user] = await this.database
      .select(columns)
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }

  async getUsers(dto: GetUsersDto): Promise<PaginatedData<UserModel>> {
    const { page, amount, sort } = getUsersDto.parse(dto);
    const sortColumn = this.getSortColumn(sort || "id");
    const [result, [{ total }]] = await Promise.all([
      this.database
        .select(columns)
        .from(users)
        .orderBy(sortColumn)
        .limit(amount)
        .offset((page - 1) * amount),
      this.database
        .select({ total: count(users.id) })
        .from(users)
        .limit(1),
    ]);
    return {
      data: result,
      pagination: CreatePagination(total, amount, page),
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

  async getTotal(from: Date, until: Date, cacheTimeSeconds = 60) {
    const cacheKey = `user-total:${format(from, "yyyy-MM-dd")}:${format(until, "yyyy-MM-dd")}`;
    const cached = await this.cache.get<number>(cacheKey);

    if (cached) {
      return cached;
    }
    const [result] = await this.database
      .select({ count: count(users.id) })
      .from(users)
      .where(and(gte(users.createdAt, from), lte(users.createdAt, until)))
      .limit(1);

    await this.cache.set(cacheKey, result.count, 1000 * cacheTimeSeconds);
    return result.count;
  }

  async getActive(from: Date, until: Date, cacheTimeSeconds = 60) {
    const cacheKey = `user-active:${format(from, "yyyy-MM-dd")}:${format(until, "yyyy-MM-dd")}`;
    const cached = await this.cache.get<number>(cacheKey);
    if (cached) {
      return cached;
    }
    const [result] = await this.database
      .select({ count: sql`count(distinct ${users.id})`.mapWith(Number) })
      .from(users)
      .innerJoin(authRefreshTokens, eq(users.id, authRefreshTokens.userId))
      .where(
        and(
          gte(authRefreshTokens.createdAt, from),
          lte(authRefreshTokens.createdAt, until)
        )
      )
      .limit(1);

    await this.cache.set(cacheKey, result.count, 1000 * cacheTimeSeconds);
    return result.count;
  }

  async getNew(from: Date, until: Date, cacheTimeSeconds = 60) {
    const cacheKey = `user-new:${format(from, "yyyy-MM-dd")}:${format(until, "yyyy-MM-dd")}`;
    const cached = await this.cache.get<number>(cacheKey);
    if (cached) {
      return cached;
    }
    const [result] = await this.database
      .select({ count: count(users.id) })
      .from(users)
      .where(and(gte(users.createdAt, from), lte(users.createdAt, until)))
      .limit(1);

    await this.cache.set(cacheKey, result.count, 1000 * cacheTimeSeconds);
    return result.count;
  }
}

export const userService = new UserService(cacheProvider);
``;
