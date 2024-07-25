import { Component, OnInit, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  bookmark,
  bookmarkOutline,
  person,
  personOutline,
  search,
  searchOutline,
  add
} from 'ionicons/icons';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  standalone: true,
  imports: [ IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class MainPageComponent {
  activeTab = signal('search');

  constructor() {
    addIcons({
      person,
      personOutline,
      search,
      searchOutline,
      bookmark,
      bookmarkOutline,
      add
    });
  }

  getIcon(name: string) {
    if (this.activeTab() === name) {
      return name;
    }
    return name + '-outline';
  }

  setActiveTab(name: string) {
    this.activeTab.set(name);
  }
}
