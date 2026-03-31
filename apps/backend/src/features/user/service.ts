import { NewUserEntity } from "../../schema";
import { GetUsersDto } from "./dto/get-users.dto";
import { UserModel } from "./types/user.model";
import { PaginatedData } from "../../common/types/paginated-data";
import { UserRepository, UserRepositoryImpl } from "./repository";
import { UserStats } from "./types/user-stats.model";
import { CreatePagination } from "../../common/create-pagination";
import { DatabaseProvider } from "../../providers/database.provider";
import { KvStoreProvider } from "../../providers/kvstore.provider";
import { StorageService } from "../../providers/storage/storage.service";
import type { UserEntity } from "../../schema";
import { format } from "date-fns";

export interface UserService {
  findById(userId: string): Promise<UserModel>;
  updateUser(userId: string, payload: Partial<UserModel>): Promise<void>;
  getUsers(payload: GetUsersDto): Promise<PaginatedData<UserModel>>;
  create(payload: NewUserEntity): Promise<UserModel>;

  getStats(from: Date, until: Date): Promise<UserStats>;
}

export class UserServiceImpl implements UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly cache: KvStoreProvider,
    private readonly storage: StorageService
  ) {}

  async findById(userId: string): Promise<UserModel> {
    const user = await this.repository.findById(userId);
    return {
      ...user,
      imageUrl: user.image ? this.getProfileImageUrl(user.image) : null
    };
  }

  getProfileImageUrl(filename: string): string {
    return this.storage.getPublicUrl(filename);
  }

  updateUser(userId: string, payload: Partial<UserModel>): Promise<void> {
    const { imageUrl: _drop, ...entityFields } = payload;
    return this.repository.updateUser(userId, entityFields as Partial<UserEntity>);
  }

  async getUsers(payload: GetUsersDto): Promise<PaginatedData<UserModel>> {
    const paginationData = await this.repository.getUsers(payload);
    const mappedUsers = paginationData.data.map(
      (user) =>
        ({
          ...user,
          imageUrl: user.image ? this.getProfileImageUrl(user.image) : null
        }) as UserModel
    );
    const { total, perPage, currentPage } = paginationData.pagination;
    return {
      data: mappedUsers,
      pagination: CreatePagination(total, perPage, currentPage)
    };
  }

  async create(payload: NewUserEntity): Promise<UserModel> {
    const newUser = await this.repository.create(payload);
    return {
      ...newUser,
      imageUrl: newUser.image ? this.getProfileImageUrl(newUser.image) : null
    } as UserModel;
  }

  async getStats(from: Date, until: Date): Promise<UserStats> {
    const cacheKey = `user-stats:${format(from, "yyyy-MM-dd")}:${format(until, "yyyy-MM-dd")}`;
    const cached = await this.cache.get<string>(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached) as UserStats;
      } catch {
        /* ignore bad cache */
      }
    }

    const total = await this.repository.getTotal(from, until);
    const active = await this.repository.getActive(from, until);
    const newUsers = await this.repository.getNew(from, until);
    const result = { total, active, new: newUsers };
    await this.cache.setItem(cacheKey, JSON.stringify(result), { ttl: 60 });
    return result;
  }
}

export function createUserService(
  db: DatabaseProvider,
  cache: KvStoreProvider,
  storage: StorageService
): UserService {
  const userRepository = new UserRepositoryImpl(db);
  return new UserServiceImpl(userRepository, cache, storage);
}
