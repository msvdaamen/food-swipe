import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { map, ReplaySubject, Subject, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  addOutline,
  arrowBackOutline,
  heart,
  heartOutline,
  removeOutline,
} from 'ionicons/icons';
import { RecipeStore } from 'src/app/modules/recipe/recipe.store';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss'],
  standalone: true,
  imports: [IonicModule, NgForOf, NgIf, AsyncPipe],
})
export default class RecipeViewComponent implements OnInit {
  private readonly recipeStore = inject(RecipeStore);
  modalCtrl = inject(ModalController);
  route = inject(ActivatedRoute);

  @Input() id!: number;
  recipe = this.recipeStore.fullRecipe;

  peopleCounter = signal(2);
  ingredientAmount = computed(() => {
    let servings = this.recipe()?.servings;
    if (!servings) {
      return 1;
    }
    return this.peopleCounter() / servings;
  });
  changed = false;

  constructor() {
    addIcons({
      arrowBackOutline,
      heart,
      heartOutline,
      removeOutline,
      addOutline,
    });
  }

  ngOnInit(): void {
    this.recipeStore.loadOne(this.id);
  }

  close() {
    this.modalCtrl.dismiss(this.changed);
  }

  incrementPeople() {
    this.peopleCounter.update(value => value + 1);
  }

  decrementPeople() {
    if (this.peopleCounter() === 1) {
      return;
    }
    this.peopleCounter.update(value => value - 1);
  }

  toggleLike(id: number, liked: boolean) {
    if (liked) {
      this.unlike(id);
    } else {
      this.like(id);
    }
    this.changed = true;
  }

  like(id: number) {}

  unlike(id: number) {}
}
