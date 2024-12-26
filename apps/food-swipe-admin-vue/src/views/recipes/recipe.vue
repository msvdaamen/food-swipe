<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPencil, faQuestion, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useRecipeStore } from '@/modules/recipe/recipe.store'
import draggable from 'vuedraggable'
import type { RecipeStep } from '@/modules/recipe/types/recipe-step.type'
import {Input, Button, Checkbox, Textarea} from "@food-swipe/ui"

const store = useRecipeStore()

const props = defineProps<{ id: number }>()

await Promise.all([
  store.loadRecipe(props.id),
  store.loadIngredients(props.id),
  store.loadSteps(props.id),
])

const drag = ref(false)

watch(
  () => props.id,
  async (id) => {
    await Promise.all([store.loadRecipe(id), store.loadIngredients(id), store.loadSteps(id)])
  },
)

const recipe = computed(() => {
  const recipe = store.getRecipe(props.id)
  return recipe.value
})
const ingredients = store.ingredients

const steps = computed<RecipeStep[]>({
  // getter
  get() {
    return store.steps
  },
  // setter
  set(newStepsOrder) {
    console.log('set', newStepsOrder)
    store.setSteps(newStepsOrder)
  }
})

watch(steps, (news, old) => {
  console.log({news, old})
})

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

function updateIsPublished(event: Event) {
  console.log('updateIsPublished', event)
}

function openManageIngredientDialog(recipeId: number, ingredientId?: number) {
  console.log('openManageIngredientDialog', recipeId, ingredientId)
}

function deleteIngredient(ingredientId: number) {
  console.log('deleteIngredient', ingredientId)
}

function openManageStepDialog(recipeId: number, stepId?: number) {
  console.log('openManageStepDialog', recipeId, stepId)
}

function deleteStep(stepId: number) {
  console.log('deleteStep', stepId)
}
function reorderStepsList(event: Event) {
  console.log(event)

}
</script>

<template>
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
            :model-value="recipe.calories?.toString() ?? ''"
            @blur="updateRecipe('calories', $event)"
            >Cals</Input
          >
        </div>
        <div>
          <Input
            type="number"
            :model-value="recipe.prepTime?.toString() ?? ''"
            @blur="updateRecipe('prepTime', $event)"
            >Time</Input
          >
        </div>
        <div>
          <Input
            type="number"
            :model-value="recipe.servings?.toString() ?? ''"
            @blur="updateRecipe('servings', $event)"
            >serv</Input
          >
        </div>
      </div>
    </div>
    <div class="w-2/3 p-8 pt-0">
      <h1 class="font-bold">
        <Input :model-value="recipe.title" @blur="updateRecipe('title', $event)">
          <span class="font-normal">Title</span>
        </Input>
      </h1>
      <p class="mt-1 text-gray-600">
        <Textarea
          autoRows
          :model-value="recipe.description"
          @blur="updateRecipe('description', $event)"
          >Description</Textarea
        >
      </p>
      <div>
        <Checkbox :model-value="recipe.isPublished" @blur="updateIsPublished($event)"
          >Is publish</Checkbox
        >
      </div>
    </div>
  </div>

  <div class="mt-8">
    <div class="mb-1 flex gap-2">
      <h2 class="grow text-2xl font-bold">Ingredients</h2>
      <Button size="small" @click="openManageIngredientDialog(recipe.id)">Add ingredient</Button>
    </div>
    <div class="table-container">
      <div class="ingredients">
        <div class="t-row ingredient font-semibold">
          <div class="name">Ingredient</div>
          <div class="amount min-w-20 flex-shrink">Amount</div>
          <div class="min-w-28 flex-shrink"></div>
        </div>
        <div
          v-for="ingredient in ingredients"
          :key="ingredient.ingredientId"
          class="t-row flex items-center"
        >
          <div class="name">{{ ingredient.ingredient }}</div>
          <div class="amount min-w-20 flex-shrink">
            {{ ingredient.amount }}{{ ingredient.measurement }}
          </div>
          <div class="flex min-w-28 flex-shrink gap-1">
            <Button
              type="icon"
              size="small"
              @click="openManageIngredientDialog(recipe.id, ingredient.ingredientId)"
              ><FontAwesomeIcon :icon="faPencil"
            /></Button>
            <Button
              type="icon"
              size="small"
              color="danger"
              @click="deleteIngredient(ingredient.ingredientId)"
              ><FontAwesomeIcon :icon="faTrash"
            /></Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-8">
    <div class="mb-1 flex gap-2">
      <h2 class="grow text-2xl font-bold">Steps</h2>
      <Button size="small" @click="openManageStepDialog(recipe.id)">Add Step</Button>
    </div>
    <div class="table-container">
      <div class="ingredients">
        <draggable
          animate-pulse
          v-model="steps"
          @start="drag = true"
          @end="drag = false"
          @change="reorderStepsList($event)"
          group="steps"
          ghost-class="ghost"
          :anmation="200"
          item-key="id"
        >
          <template #header>
            <div class="t-row ingredient font-semibold">
              <div class="step min-w-20 flex-shrink">Step</div>
              <div class="description">Description</div>
              <div class="min-w-28 flex-shrink"></div>
            </div>
          </template>
          <template #item="{ element }">
            <div class="t-row flex items-center">
              <div class="step min-w-20 flex-shrink">{{ element.stepNumber }}</div>
              <div class="description">{{ element.description }}</div>
              <div class="flex min-w-28 flex-shrink gap-1">
                <Button
                  type="icon"
                  size="small"
                  @click="openManageStepDialog(recipe.id, element.id)"
                  ><FontAwesomeIcon :icon="faPencil"
                /></Button>
                <Button type="icon" size="small" color="danger" @click="deleteStep(element.id)"
                  ><FontAwesomeIcon :icon="faTrash"
                /></Button>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ghost {
  opacity: 0;
}

.sortable-chosen {
  box-sizing: border-box;
  background: white;
  @apply border rounded overflow-hidden;
}
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

</style>
