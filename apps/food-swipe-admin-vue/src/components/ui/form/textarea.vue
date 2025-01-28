<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'
import { watch } from 'vue'

const {
  placeholder,
  disabled,
  rows = 3,
  autoRows,
} = defineProps<{
  placeholder?: string
  disabled?: boolean
  rows?: number
  autoRows?: boolean
}>()

const model = defineModel<string | number>()

const { textarea, triggerResize } = useTextareaAutosize({ styleProp: 'minHeight' })

watch(model, () => {
  if (autoRows) {
    triggerResize()
  }
})
</script>

<template>
  <label>
    <p><slot /></p>
    <div
      class="invalid:border-danger-600 flex w-full rounded-sm border border-gray-200 px-1.5 py-1 transition-colors focus-within:border-primary-600 disabled:bg-gray-200"
    >
      <textarea
        ref="textarea"
        v-model="model"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full outline-0"
      ></textarea>
    </div>
  </label>
</template>

<style scoped></style>
