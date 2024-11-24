<script setup lang="ts">
import type { SidebarItem } from '@/components/sidebar/sidebar.vue'
import { onMounted, ref } from 'vue'
import SidebarItemContent from '@/components/sidebar/sidebar-item-content.vue'
import { animate } from 'motion'

const { item } = defineProps<{ item: SidebarItem }>()

const open = ref(false)

function toggleMenu() {
  if (item.items) {
    open.value = !open.value
  }
}

function onEnter(el: Element, done: () => void) {
  const animation = animate(el, { height: 'auto' }, { duration: 0.3, ease: 'easeInOut' })
  animation.then(() => {
    console.log('done')
    done()
  })
}

function onLeave(el: Element, done: () => void) {
  const animation = animate(el, { height: 0 }, { duration: 0.3, ease: 'easeIn' })
  animation.then(() => {
    console.log('done')
    done()
  })
}
</script>

<template>
  <div class="flex w-full flex-col">
    <router-link
      v-if="item.link"
      class="flex w-full cursor-pointer select-none rounded-lg px-2.5 py-1.5 transition-colors hover:bg-gray-200"
      @click="toggleMenu()"
      :to="item.link"
      exactActiveClass="bg-gray-200 active"
    >
      <SidebarItemContent :item="item" :open="open" />
    </router-link>
    <div
      v-else
      @click="toggleMenu()"
      class="flex w-full cursor-pointer select-none rounded-lg px-2.5 py-1.5 transition-colors hover:bg-gray-200"
    >
      <SidebarItemContent :item="item" :open="open" />
    </div>
    <Transition @enter="onEnter" @leave="onLeave">
      <div v-if="item.items && open" class="menu-list flex h-0 flex-col overflow-hidden">
        <div v-for="(item2, index) of item.items" :key="index" class="flex">
          <div class="relative flex justify-center" style="width: 35px">
            <div
              :class="{
                'h-full': index < item.items.length - 1,
                'h-1/2': index === item.items.length - 1,
              }"
              class="absolute left-1/2 top-0 border-r border-gray-400"
            ></div>
            <div class="absolute top-1/2 w-1/2 translate-x-1/2 border-b border-gray-400"></div>
          </div>
          <div class="mb-1 w-full">
            <sidebar-item :item="item2" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.active {
  .icon {
    @apply text-primary-600;
  }

  .title {
    @apply font-medium;
  }
}
</style>
