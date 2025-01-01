import { Component, inject, input, OnInit, signal } from '@angular/core';
import { SidebarItem } from '../sidebar.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faChevronDown,
  faChevronRight,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { menuAnimation } from './menu-animation';

@Component({
    selector: 'app-sidebar-item',
    imports: [FaIconComponent, RouterLink, RouterLinkActive],
    templateUrl: './sidebar-item.component.html',
    styleUrl: './sidebar-item.component.scss',
    animations: [menuAnimation]
})
export class SidebarItemComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  item = input.required<SidebarItem>();

  open = signal(false);

  protected readonly faMinus = faMinus;
  protected readonly faArrowDown = faArrowDown;
  protected readonly faChevronRight = faChevronRight;
  protected readonly faChevronDown = faChevronDown;
  protected readonly faPlus = faPlus;

  ngOnInit() {
    const items = this.item().items;
    if (items) {
      const url = this.router.url;
      for (const item of items) {
        if (item.link === url) {
          this.open.set(true);
          break;
        }
      }
    }
  }

  toggleMenu() {
    if (this.item().items) {
      this.open.set(!this.open());
    }
  }
}
