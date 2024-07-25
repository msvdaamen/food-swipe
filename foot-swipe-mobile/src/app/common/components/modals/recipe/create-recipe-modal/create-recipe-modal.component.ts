import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, ModalController } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-create-recipe-modal',
  templateUrl: './create-recipe-modal.component.html',
  styleUrls: ['./create-recipe-modal.component.scss'],
  standalone: true,
  imports: [IonToolbar, IonHeader, IonButtons, IonButton, IonIcon, IonContent]
})
export class CreateRecipeModalComponent {
  private readonly modalCtrl = inject(ModalController);

  constructor() {
    addIcons({
      arrowBackOutline
    });
   }

  close() {
    this.modalCtrl.dismiss();
  }
}
