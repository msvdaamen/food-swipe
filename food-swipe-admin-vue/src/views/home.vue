<script setup lang="ts">
import Sidebar from '@/components/sidebar/sidebar.vue'
</script>

<template>
  <div class="flex h-screen flex-row">
    <div class="w-64 min-w-64 border-r-2 bg-gray-100">
      <Sidebar />
    </div>
    <main class="grow overflow-auto">
      <div class="p-6">
        <Suspense>
          <router-view />
          <template #fallback>
            <div>Loading...</div>
          </template>
        </Suspense>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
