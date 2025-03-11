import { Component, ElementRef, inject, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faBell } from '@fortawesome/free-solid-svg-icons';
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { ButtonComponent } from '../ui/button/button.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [FaIconComponent, IonHeader, IonToolbar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly elRef = inject(ElementRef);
  private readonly location = inject(Location);
  private readonly modalController = inject(ModalController);

  backButton = input(false);
  closeModal = input(false);

  faBell = faBell;
  faArrowLeft = faArrowLeft;

  async temp() {
    if (this.closeModal()) {
      this.modalController.dismiss();
      return;
    }
    const nav = this.elRef.nativeElement.closest('ion-nav');
    console.log(nav);
    this.location.back();
    if (nav) {
      await nav.canGoBack();
    }
  }
}
