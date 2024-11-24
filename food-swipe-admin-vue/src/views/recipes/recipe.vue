<script setup lang="ts">
import { ref } from 'vue'
import type { Recipe } from '@/modules/recipe/types/recipe.type'
import Button from '@/components/ui/button.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faQuestion, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Input from '@/components/ui/form/input.vue'

// @ts-ignore
const recipe = ref<Recipe>({})
const loading = ref(false)

function deleteRecipe(id: number) {
  console.log('deleteRecipe', id)
}

function openFileUploader() {
  console.log('openFileUploader')
}

function uploadFile(event: Event) {
  console.log('uploadFile', event)
}

function updateRecipe(key: string, event: Event) {
  console.log('updateRecipe', key, event)
}
</script>

<template v-if="recipe">
  <div class="flex justify-end">
    <Button @click="deleteRecipe(recipe.id)" color="danger">Delete</Button>
  </div>
  <div class="flex">
    <div class="w-1/3">
      <div @click="openFileUploader()">
        <div
          v-if="loading"
          class="flex aspect-video w-full cursor-pointer items-center justify-center"
        >
          <FontAwesomeIcon size="10x" spin :icon="faSpinner" />
        </div>
        <div v-else-if="recipe.coverImageUrl" class="cursor-pointer">
          <img :src="recipe.coverImageUrl" alt="" />
        </div>
        <div
          v-else
          class="flex aspect-video w-full cursor-pointer items-center justify-center bg-gray-100"
        >
          <FontAwesomeIcon size="10x" :icon="faQuestion" />
        </div>
        <input type="file" hidden @change="uploadFile($event)" />
      </div>
      <div class="mt-4 flex gap-2">
        <div>
          <Input
            type="number"
            :value="recipe.calories?.toString() ?? ''"
            @blur="updateRecipe('calories', $event)"
            >Cals</Input
          >
        </div>
        <div>
          <Input
            type="number"
            :value="recipe.prepTime?.toString() ?? ''"
            @blur="updateRecipe('prepTime', $event)"
            >Time</Input
          >
        </div>
        <div>
          <Input
            type="number"
            :value="recipe.servings?.toString() ?? ''"
            @blur="updateRecipe('servings', $event)"
            >serv</Input
          >
        </div>
      </div>
    </div>
    <div class="w-2/3 p-8 pt-0">
      <h1 class="font-bold">
        <Input :value="recipe.title" @blur="updateRecipe('title', $event)">
          <span class="font-normal">Title</span>
        </Input>
      </h1>
      <p class="mt-1 text-gray-600">
        <!--        <app-form-textarea-->
        <!--          autoSize-->
        <!--          [value]="recipe.description"-->
        <!--          @blur="updateRecipe('description', $event)"-->
        <!--          >Description</app-form-textarea>-->
      </p>
      <div>
        <!--        <app-form-checkbox [value]="recipe.isPublished" (change)="updateIsPublished($event)"-->
        <!--          >Is publish</app-form-checkbox>-->
      </div>
    </div>
  </div>

  <div class="mt-8">
    <!--    <div class="mb-1 flex gap-2">-->
    <!--      <h2 class="grow text-2xl font-bold">Ingredients</h2>-->
    <!--      <app-button size="small" (click)="openManageIngredientDialog(recipe.id)"-->
    <!--      >Add ingredient</app-button-->
    <!--      >-->
    <!--    </div>-->
    <!--    <div class="table-container">-->
    <!--      <div class="ingredients">-->
    <!--        <div class="t-row ingredient">-->
    <!--          <div class="name">Ingredient</div>-->
    <!--          <div class="amount min-w-20 flex-shrink">Amount</div>-->
    <!--          <div class="min-w-28 flex-shrink"></div>-->
    <!--        </div>-->
    <!--        @for (ingredient of ingredients(); track ingredient) {-->
    <!--        <div class="t-row flex items-center">-->
    <!--          <div class="name">{{ ingredient.ingredient }}</div>-->
    <!--          <div class="amount min-w-20 flex-shrink">-->
    <!--            {{ ingredient.amount }}{{ ingredient.measurement }}-->
    <!--          </div>-->
    <!--          <div class="flex min-w-28 flex-shrink gap-1">-->
    <!--            <app-button-->
    <!--              type="icon"-->
    <!--              size="small"-->
    <!--              (click)="-->
    <!--                  openManageIngredientDialog(recipe.id, ingredient.ingredientId)-->
    <!--                "-->
    <!--            ><fa-icon [icon]="faPencil"-->
    <!--            /></app-button>-->
    <!--            <app-button-->
    <!--              type="icon"-->
    <!--              size="small"-->
    <!--              color="danger"-->
    <!--              (click)="deleteIngredient(ingredient.ingredientId)"-->
    <!--            ><fa-icon [icon]="faTrash"-->
    <!--            /></app-button>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        }-->
    <!--      </div>-->
    <!--    </div>-->
  </div>

  <div class="mt-8">
    <!--    <div class="mb-1 flex gap-2">-->
    <!--      <h2 class="grow text-2xl font-bold">Steps</h2>-->
    <!--      <app-button size="small" (click)="openManageStepDialog(recipe.id)"-->
    <!--      >Add Step</app-button-->
    <!--      >-->
    <!--    </div>-->
    <!--    <div class="table-container">-->
    <!--      <div-->
    <!--        class="ingredients"-->
    <!--        cdkDropList-->
    <!--        (cdkDropListDropped)="stepsDrop($event)"-->
    <!--      >-->
    <!--        <div class="t-row ingredient">-->
    <!--          <div class="step min-w-20 flex-shrink">Step</div>-->
    <!--          <div class="description">Description</div>-->
    <!--          <div class="min-w-28 flex-shrink"></div>-->
    <!--        </div>-->
    <!--        @for (step of steps(); track step.id) {-->
    <!--        <div class="t-row flex items-center" cdkDrag>-->
    <!--          <div class="step min-w-20 flex-shrink">{{ step.stepNumber }}</div>-->
    <!--          <div class="description">{{ step.description }}</div>-->
    <!--          <div class="flex min-w-28 flex-shrink gap-1">-->
    <!--            <app-button-->
    <!--              type="icon"-->
    <!--              size="small"-->
    <!--              (click)="openManageStepDialog(recipe.id, step.id)"-->
    <!--            ><fa-icon [icon]="faPencil"-->
    <!--            /></app-button>-->
    <!--            <app-button-->
    <!--              type="icon"-->
    <!--              size="small"-->
    <!--              color="danger"-->
    <!--              (click)="deleteStep(step.id)"-->
    <!--            ><fa-icon [icon]="faTrash"-->
    <!--            /></app-button>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        }-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<style scoped></style>
