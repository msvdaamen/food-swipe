import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../common/components/header/header.component';

@Component({
  selector: 'app-recipe-books',
  standalone: true,
  imports: [CommonModule, IonContent, HeaderComponent],
  templateUrl: './recipe-books.component.html',
  styleUrl: './recipe-books.component.scss',
})
export default class RecipeBooksComponent {}
