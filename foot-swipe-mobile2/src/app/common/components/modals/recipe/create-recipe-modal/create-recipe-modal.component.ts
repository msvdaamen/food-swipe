import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, ModalController, IonTitle, IonItem, IonInput } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Component({
  selector: 'app-create-recipe-modal',
  templateUrl: './create-recipe-modal.component.html',
  styleUrls: ['./create-recipe-modal.component.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonTitle, IonToolbar, IonHeader, IonButtons, IonButton, IonIcon, IonContent, FormsModule]
})
export class CreateRecipeModalComponent {
  private readonly modalCtrl = inject(ModalController);

  title = signal('');
  capturedPhoto = signal<Photo | null>(null);

  constructor() {
    addIcons({
      arrowBackOutline
    });
   }

   async addImage() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 100
    });
    this.capturedPhoto.set(capturedPhoto);
   }

  close() {
    this.modalCtrl.dismiss();
  }
}
