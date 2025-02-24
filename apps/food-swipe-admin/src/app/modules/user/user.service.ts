import { Injectable } from '@angular/core';
import { Service } from '@common/service';
import { UserStats } from './types/user-stats.type';
import { User } from './types/user.type';
import { PaginatedData } from '@common/types/paginated-data';

@Injectable({
  providedIn: 'root',
})
export class UserService extends Service {
  get({ amount, page, sort }: { amount: number; page: number; sort: string }) {
    return this.http.get<PaginatedData<User>>(`${this.api}/users`, {
      params: {
        amount,
        page,
        sort,
      },
    });
  }

  getStats() {
    return this.http.get<UserStats>(`${this.api}/users/stats`);
  }
}
