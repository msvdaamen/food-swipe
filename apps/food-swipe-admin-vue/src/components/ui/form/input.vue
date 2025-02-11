<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

type InputType = 'number' | 'text' | 'email' | 'password' | 'file'

const { placeholder, disabled, type, iconSuffix } = defineProps<{
  placeholder?: string
  disabled?: boolean
  type?: InputType
  iconSuffix?: IconDefinition
}>()

const model = defineModel<string | number>()
</script>

<template>
  <label>
    <p><slot /></p>
    <div
      class="invalid:border-danger-600 focus-within:border-primary-600 flex rounded-sm border border-gray-200 px-1.5 py-1 outline-0 transition-colors disabled:bg-gray-200"
    >
      <div class="grow">
        <input
          v-model="model"
          :placeholder="placeholder"
          :disabled="disabled"
          :type="type"
          class="w-full bg-transparent outline-hidden"
          v-bind="$attrs"
        />
      </div>
      <div v-if="iconSuffix" class="px-2 text-gray-500">
        <FontAwesomeIcon :icon="iconSuffix" />
      </div>
    </div>
  </label>
</template>

<style scoped></style>
