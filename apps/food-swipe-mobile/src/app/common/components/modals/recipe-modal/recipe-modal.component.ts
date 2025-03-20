import {
  Component,
  computed,
  ElementRef,
  inject,
  linkedSignal,
  OnInit,
  viewChild,
} from '@angular/core';
import {
  IonContent,
  ModalController,
  ViewDidEnter,
  ViewDidLeave,
} from '@ionic/angular/standalone';
import {
  faAdd,
  faArrowLeft,
  faHeart,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormCheckboxComponent } from '../../ui/form/form-checkbox/form-checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { RecipeRepository } from '../../../../modules/recipe/recipe.repository';
import { nutritionOrder } from '../../../../modules/recipe/constants/nutritions';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-recipe-modal',
  imports: [
    IonContent,
    FormCheckboxComponent,
    ButtonComponent,
    FaIconComponent,
    DecimalPipe,
  ],
  templateUrl: './recipe-modal.component.html',
  styleUrl: './recipe-modal.component.scss',
})
export class RecipeModalComponent implements OnInit {
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly modalController = inject(ModalController);

  id!: number;

  recipe = computed(() => {
    return this.recipeRepository.getRecipe(this.id)();
  });

  peopleCounter = linkedSignal(() => this.recipe()?.servings);
  ingredientAmount = computed(() => {
    const servings = this.recipe()?.servings || 2;
    if (!servings) {
      return 1;
    }
    return this.peopleCounter() / servings;
  });

  liked = computed(() => {
    return this.recipe()?.liked || false;
  });

  faAdd = faAdd;
  faMinus = faMinus;
  faArrowLeft = faArrowLeft;
  faHeart = faHeart;
  faHeartOutline = faHeartOutline;

  observer: IntersectionObserver | null = null;

  ngOnInit() {
    this.recipeRepository.loadOne(this.id);
  }

  incrementPeople() {
    this.peopleCounter.update((value) => value + 1);
  }

  decrementPeople() {
    if (this.peopleCounter() === 1) {
      return;
    }
    this.peopleCounter.update((value) => value - 1);
  }

  toggleLike() {
    const recipe = this.recipe();
    this.recipeRepository.like(recipe.id, !recipe.liked);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  protected readonly nutritions = nutritionOrder;
}
