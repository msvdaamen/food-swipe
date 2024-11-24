<script setup lang="ts">
import SidebarItem from '@/components/sidebar/sidebar-item.vue'
import { ref } from 'vue'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faBook,
  faEgg,
  faPencil,
  faPerson,
  faRuler,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons'

export type SidebarItem = {
  title: string
  icon?: IconDefinition
  link?: string
  items?: Omit<SidebarItem, 'items'>[]
}

const sidebarItems = ref([
  {
    title: 'Activity',
    icon: faPencil,
    items: [
      {
        title: 'Logins',
        icon: faPerson,
        link: '/activities/logins',
      },
      {
        title: 'Recipes',
        icon: faUtensils,
        link: '/activities/recipes',
      },
    ],
  },
  {
    title: 'Recipes',
    icon: faBook,
    items: [
      {
        title: 'Recipes',
        icon: faUtensils,
        link: '/recipes',
      },
      {
        title: 'Ingredients',
        icon: faEgg,
        link: '/ingredients',
      },
      {
        title: 'Measurements',
        icon: faRuler,
        link: '/measurements',
      },
    ],
  },
])
</script>

<template>
  <div class="sidebar h-dvh flex-col gap-1">
    <div class="mb-8 ml-2 px-4 pt-4 text-lg font-medium">FoodSwipe Admin</div>
    <div class="px-4 pb-4">
      <sidebar-item v-for="(item, index) of sidebarItems" :key="index" :item="item" />
    </div>
    <div class="overflow-hidden border-t-2">
      <div class="flex max-w-max items-center gap-2 overflow-hidden text-ellipsis p-4 text-sm">
        <div
          class="flex aspect-square w-8 items-center justify-center rounded-full border bg-white text-xs"
        >
          M
        </div>
        <span>Mischa Daamen</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr max-content;
}
</style>
