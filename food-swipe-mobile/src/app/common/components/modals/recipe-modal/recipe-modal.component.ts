import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {
  IonContent,
  ModalController,
  ViewDidEnter,
} from '@ionic/angular/standalone';
import {
  faAdd,
  faArrowLeft,
  faHeart,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../../header/header.component';
import { FormCheckboxComponent } from '../../ui/form/form-checkbox/form-checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { RecipeRepository } from '../../../../modules/recipe/recipe.repository';

@Component({
  selector: 'app-recipe-modal',
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    FormCheckboxComponent,
    ButtonComponent,
    FaIconComponent,
  ],
  templateUrl: './recipe-modal.component.html',
  styleUrl: './recipe-modal.component.scss',
})
export class RecipeModalComponent implements OnInit, ViewDidEnter {
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly modalController = inject(ModalController);

  dismissHeader = viewChild<ElementRef<HTMLDivElement>>('dismissHeader');
  coverImage = viewChild<ElementRef<HTMLDivElement>>('coverImage');

  id!: number;

  recipe = computed(() => {
    return this.recipeRepository.getRecipe(this.id)();
  });

  peopleCounter = signal(2);
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

  ngOnInit() {
    this.recipeRepository.loadOne(this.id);
  }

  ionViewDidEnter() {
    const coverImage = this.coverImage()?.nativeElement;
    if (!coverImage) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const dismissHeader = this.dismissHeader()?.nativeElement;
        if (!dismissHeader) {
          return;
        }
        if (!entry.isIntersecting) {
          dismissHeader.classList.add('header-visible');
        } else {
          dismissHeader.classList.remove('header-visible');
        }
      },
      { rootMargin: '-40px 0px 0px 0px' },
    );
    requestAnimationFrame(() => {
      observer.observe(coverImage);
    });
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
}
