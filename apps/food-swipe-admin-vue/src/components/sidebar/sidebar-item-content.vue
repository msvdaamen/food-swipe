<script setup lang="ts">
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { SidebarItem } from '@/components/sidebar/sidebar.vue'

const { item, open } = defineProps<{ item: SidebarItem; open: boolean }>()
</script>

<template>
  <span v-if="item.icon" class="icon mr-2 transition-colors"
    ><FontAwesomeIcon :icon="item.icon"
  /></span>
  <span class="title grow">{{ item.title }}</span>
  <span v-if="item.items">
    <Transition>
      <FontAwesomeIcon :icon="open ? faMinus : faPlus" />
    </Transition>
  </span>
</template>

<style scoped></style>
