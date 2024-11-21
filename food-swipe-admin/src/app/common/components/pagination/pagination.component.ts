import { Component, computed, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-pagination',
    imports: [FaIconComponent, NgClass],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;

  currentPage = input.required<number>();
  totalPages = input.required<number>();
  perPage = input.required<number>();

  pageNumbers = computed<number[]>(() => {
    const pages: number[] = [];

    const left = (() => {
      if (this.currentPage() - 2 <= 0) {
        return 1;
      }
      if (this.currentPage() + 2 > this.totalPages()) {
        return this.totalPages() - 4;
      }
      return this.currentPage() - 2;
    })();
    const right = (() => {
      if (this.currentPage() + 2 >= this.totalPages()) {
        return this.totalPages();
      }
      if (this.currentPage() - 2 <= 0) {
        return 5;
      }
      return this.currentPage() + 2;
    })();

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }
    return pages;
  });

  nextDisabled = computed(() => this.currentPage() === this.totalPages());
  previousDisabled = computed(() => this.currentPage() === 1);

  pageChange = output<number>();

  nextPage() {
    this.pageChange.emit(this.currentPage() + 1);
  }

  previousPage() {
    this.pageChange.emit(this.currentPage() - 1);
  }

  setPage(pageNumber: number) {
    this.pageChange.emit(pageNumber);
  }
}
