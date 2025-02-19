import { Component } from '@angular/core';
import {
  faBook,
  faCode,
  faEgg,
  faList,
  faPencil,
  faPerson,
  faRuler,
  faUtensils,
  faWrench,
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
        { title: 'Recipes', icon: faUtensils, link: '/activities/recipes' },
      ],
    },
    {
      title: 'Recipes',
      icon: faBook,
      items: [
        { title: 'Recipes', icon: faUtensils, link: '/recipes' },
        { title: 'Ingredients', icon: faEgg, link: '/ingredients' },
        { title: 'Measurements', icon: faRuler, link: '/measurements' },
      ],
    },
    {
      title: 'Tools',
      icon: faWrench,
      items: [{ title: 'Query Logs', icon: faCode, link: '/tools/query-logs' }],
    },
  ];
}
