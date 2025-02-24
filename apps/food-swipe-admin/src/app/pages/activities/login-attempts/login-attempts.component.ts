import { DatePipe, PercentPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/modules/user/user.service';
import { PaginationComponent } from '../../../common/components/pagination/pagination.component';

@Component({
  selector: 'app-login-attempts',
  imports: [FaIconComponent, PercentPipe, PaginationComponent, DatePipe],
  templateUrl: './login-attempts.component.html',
  styleUrl: './login-attempts.component.scss',
})
export default class LoginAttemptsComponent {
  protected readonly faArrowUp = faArrowUp;
  protected readonly faArrowDown = faArrowDown;
  protected readonly faSpinner = faSpinner;

  private readonly userService = inject(UserService);

  amount = signal(10);
  page = signal(1);
  loadingArr = new Array(this.amount());

  users = rxResource({
    request: () => ({
      amount: this.amount(),
      page: this.page(),
    }),
    loader: ({ request: { amount, page } }) =>
      this.userService.get({ amount, page, sort: 'id' }),
  });

  pagination = computed(() => {
    const users = this.users.value();
    if (!users) return null;

    return users.pagination;
  });

  stats = rxResource({
    loader: () => this.userService.getStats(),
  });

  activeStats = computed(() => {
    const stats = this.stats.value();
    if (!stats) return null;

    const isLower = stats.active < stats.activeLastMonth;

    return {
      active: stats.active,
      activeLastMonth: stats.activeLastMonth,
      percentage: (stats.active / stats.activeLastMonth) * (isLower ? -1 : 1),
    };
  });

  totalStats = computed(() => {
    const stats = this.stats.value();
    if (!stats) return null;

    const isLower = stats.total < stats.totalLastMonth;

    return {
      total: stats.total,
      totalLastMonth: stats.totalLastMonth,
      percentage: (stats.total / stats.totalLastMonth) * (isLower ? -1 : 1),
    };
  });

  newStats = computed(() => {
    const stats = this.stats.value();
    if (!stats) return null;

    const isLower = stats.new < stats.newLastMonth;

    return {
      new: stats.new,
      newLastMonth: stats.newLastMonth,
      percentage: (stats.new / stats.newLastMonth) * (isLower ? -1 : 1),
    };
  });

  changePage(page: number) {
    const pagination = this.pagination();
    if (!pagination || pagination.totalPages === this.page()) {
      return;
    }
    this.page.set(page);
  }
}
