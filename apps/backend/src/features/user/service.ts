import { Result, UnhandledException } from "better-result";
import { NewUserEntity } from "../../schema";
import { GetUsersDto } from "./dto/get-users.dto";
import { UserModel } from "./types/user.model";
import { PaginatedData } from "../../common/types/paginated-data";
import { UserRepository, UserRepositoryImpl } from "./repository";
import { UserStats } from "./types/user-stats.model";
import { NotFoundError } from "../../common/errors/not-found.error";
import { CreatePagination } from "../../common/create-pagination";
import { DatabaseProvider } from "../../providers/database.provider";
import { KvStoreProvider } from "../../providers/kvstore.provider";
import { format } from "date-fns";

export interface UserService {
  findById(userId: string): Promise<Result<UserModel, NotFoundError>>;
  updateUser(
    userId: string,
    payload: Partial<UserModel>
  ): Promise<Result<void, UnhandledException>>;
  getUsers(payload: GetUsersDto): Promise<Result<PaginatedData<UserModel>, UnhandledException>>;
  create(payload: NewUserEntity): Promise<Result<UserModel, UnhandledException>>;

  getStats(from: Date, until: Date): Promise<Result<UserStats, UnhandledException>>;
}

export class UserServiceImpl implements UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly cache: KvStoreProvider
  ) {}

  findById(userId: string): Promise<Result<UserModel, NotFoundError>> {
    return Result.gen(
      async function* (this: UserServiceImpl) {
        const user = yield* Result.await(this.repository.findById(userId));
        return Result.ok({
          ...user,
          imageUrl: user.image ? this.getProfileImageUrl(user.image) : null
        });
      }.bind(this)
    );
  }

  getProfileImageUrl(filename: string): string {
    throw new Error("Method not implemented.");
  }

  updateUser(
    userId: string,
    payload: Partial<UserModel>
  ): Promise<Result<void, UnhandledException>> {
    return Result.tryPromise(() => this.repository.updateUser(userId, payload));
  }

  getUsers(payload: GetUsersDto): Promise<Result<PaginatedData<UserModel>, UnhandledException>> {
    return Result.gen(
      async function* (this: UserServiceImpl) {
        const paginationData = yield* Result.await(this.repository.getUsers(payload));
        const mappedUsers = paginationData.data.map(
          (user) =>
            ({
              ...user,
              imageUrl: user.image ? this.getProfileImageUrl(user.image) : null
            }) as UserModel
        );
        const { total, perPage, currentPage } = paginationData.pagination;
        return Result.ok({
          data: mappedUsers,
          pagination: CreatePagination(total, perPage, currentPage)
        });
      }.bind(this)
    );
  }

  create(payload: NewUserEntity): Promise<Result<UserModel, UnhandledException>> {
    return Result.gen(
      async function* (this: UserServiceImpl) {
        const newUser = yield* Result.await(this.repository.create(payload));
        return Result.ok({
          ...newUser,
          imageUrl: newUser.image ? this.getProfileImageUrl(newUser.image) : null
        } as UserModel);
      }.bind(this)
    );
  }

  getStats(from: Date, until: Date): Promise<Result<UserStats, UnhandledException>> {
    return Result.gen(
      async function* (this: UserServiceImpl) {
        const cacheKey = `user-stats:${format(from, "yyyy-MM-dd")}:${format(until, "yyyy-MM-dd")}`;
        const cached = await this.cache.get<string>(cacheKey);
        if (cached) {
          return Result.try(() => JSON.parse(cached) as UserStats);
        }

        const total = yield* Result.await(this.repository.getTotal(from, until));
        const active = yield* Result.await(this.repository.getActive(from, until));
        const newUsers = yield* Result.await(this.repository.getNew(from, until));
        const result = { total, active, new: newUsers };
        await this.cache.setItem(cacheKey, JSON.stringify(result), { ttl: 60 });
        return Result.ok(result);
      }.bind(this)
    );
  }
}

export function createUserService(db: DatabaseProvider, cache: KvStoreProvider): UserService {
  const userRepository = new UserRepositoryImpl(db);
  return new UserServiceImpl(userRepository, cache);
}
