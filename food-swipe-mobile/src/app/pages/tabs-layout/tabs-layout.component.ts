import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faHeart,
  faMagnifyingGlass,
  faPerson,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../common/components/ui/button/button.component';
import { HeaderComponent } from '../../common/components/header/header.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  IonContent,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs-layout',
  standalone: true,
  imports: [
    IonRouterOutlet,
    FaIconComponent,
    RouterLink,
    RouterLinkActive,
    ButtonComponent,
    HeaderComponent,
    CdkScrollable,
    IonContent,
    IonTabs,
    IonTabBar,
    IonTabButton,
  ],
  templateUrl: './tabs-layout.component.html',
  styleUrl: './tabs-layout.component.scss',
})
export default class TabsLayoutComponent {
  faMagnifyingGlass = faMagnifyingGlass;
  faHeart = faHeart;
  faPerson = faPerson;
  protected readonly faPlus = faPlus;
}
