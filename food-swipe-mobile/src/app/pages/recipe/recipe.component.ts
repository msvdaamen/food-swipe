import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../common/components/header/header.component';
import { RecipeRepository } from '../../modules/recipe/recipe.repository';
import { FormCheckboxComponent } from '../../common/components/ui/form/form-checkbox/form-checkbox.component';
import { ButtonComponent } from '../../common/components/ui/button/button.component';
import { faAdd, faMinus, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    FormCheckboxComponent,
    ButtonComponent,
    FaIconComponent,
  ],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export default class RecipeComponent {
  private readonly recipeRepository = inject(RecipeRepository);

  id = input.required<number, number>({ transform: numberAttribute });

  recipe = computed(() => {
    return this.recipeRepository.getRecipe(this.id())();
  });

  peopleCounter = signal(2);
  ingredientAmount = computed(() => {
    const servings = this.recipe()?.servings || 2;
    if (!servings) {
      return 1;
    }
    return this.peopleCounter() / servings;
  });

  faAdd = faAdd;
  faMinus = faMinus;

  constructor() {
    effect(
      () => {
        this.recipeRepository.findOne(this.id());
      },
      { allowSignalWrites: true },
    );
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

  toggleLike(id: number, liked: boolean) {
    if (liked) {
      this.unlike(id);
    } else {
      this.like(id);
    }
  }

  like(id: number) {}

  unlike(id: number) {}
}
