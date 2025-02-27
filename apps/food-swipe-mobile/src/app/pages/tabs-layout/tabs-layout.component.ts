import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faBook,
  faHeart,
  faMagnifyingGlass,
  faPerson,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs-layout',
  imports: [FaIconComponent, IonTabs, IonTabBar, IonTabButton],
  templateUrl: './tabs-layout.component.html',
  styleUrl: './tabs-layout.component.scss',
})
export default class TabsLayoutComponent {
  faMagnifyingGlass = faMagnifyingGlass;
  faBook = faBook;
  faPerson = faPerson;
  protected readonly faPlus = faPlus;
}
