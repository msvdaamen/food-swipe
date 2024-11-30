<script setup lang="ts">
const { disabled } = defineProps<{
  disabled?: boolean
}>()

const model = defineModel<boolean>()
</script>

<template>
  <label class="inline-flex cursor-pointer items-center">
    <input
      v-model="model"
      :disabled="disabled"
      class="h-5 w-5 appearance-none rounded border border-gray-300 transition-colors checked:bg-primary-600"
      type="checkbox"
    />
    <span class="ml-1"><slot /></span>
  </label>
</template>

<style scoped>
input:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}
</style>
