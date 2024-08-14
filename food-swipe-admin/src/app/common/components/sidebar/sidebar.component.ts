import { Component } from '@angular/core';
import {
  faBook,
  faList,
  faPencil,
  faPerson,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { SidebarItemComponent } from './sidebar-item/sidebar-item.component';

export type SidebarItem = {
  title: string;
  icon?: IconDefinition;
  link?: string;
  items?: Omit<SidebarItem, 'items'>[];
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  sidebarItems: SidebarItem[] = [
    {
      title: 'Activity',
      icon: faPencil,
      items: [
        { title: 'Logins', icon: faPerson, link: '/activities/logins' },
        { title: 'Recipes', icon: faBook, link: '/activities/recipes' },
      ],
    },
    {
      title: 'Recipes',
      icon: faList,
      items: [{ title: 'Recipes', icon: faBook, link: '/recipes' }],
    },
  ];
}
