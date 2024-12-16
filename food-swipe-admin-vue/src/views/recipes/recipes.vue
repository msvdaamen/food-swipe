<script setup lang="ts">
import Input from '@/components/ui/form/input.vue'
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import { useRecipeStore } from '@/modules/recipe/recipe.store'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const store = useRecipeStore()

store.loadRecipes()

const search = ref('')
</script>

<template>
  <div class="mb-4 flex justify-between bg-white">
    <div class="w-64">
      <Input placeholder="Search" :iconSuffix="faMagnifyingGlass" v-model="search" />
      <!--      <app-form-input placeholder="Search" [iconSuffix]="faMagnifyingGlass" [(ngModel)]="search" />-->
    </div>
    <div>
      <Button>Create</Button>
      <Button>Import</Button>
      <!--      <app-button (click)="openCreateRecipeDialog()">Create</app-button>-->
      <!--      <app-button (click)="openImportDialog()">import</app-button>-->
    </div>
  </div>
  <div class="content gap-4">
    <router-link
      v-for="recipe in store.recipes"
      :key="recipe.id"
      :to="`recipes/${recipe.id}`"
      :id="`recipe-${recipe.id}`"
    >
      <div class="cursor-pointer rounded border transition-transform hover:scale-105 hover:shadow">
        <div v-if="recipe.coverImageUrl">
          <img
            :src="recipe.coverImageUrl"
            width="5120"
            height="1440"
            alt="Recipe Image"
            class="rounded-t"
          />
        </div>
        <div v-else class="flex w-full cursor-pointer items-center justify-center bg-gray-100">
          <!--        <fa-icon size="10x" [icon]="faQuestion" />-->
        </div>
        <div class="p-2">
          <h3 class="font-bold">{{ recipe.title }}</h3>
          <div class="description">
            <p class="line-clamp-2">
              {{ recipe.description }}
            </p>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
