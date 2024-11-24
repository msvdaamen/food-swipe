<script setup lang="ts">
type InputType = 'number' | 'text' | 'email' | 'password' | 'file'

const { placeholder, disabled, type, iconSuffix } = defineProps<{
  placeholder?: string
  disabled?: boolean
  type?: InputType
  iconSuffix?: string
}>()

const model = defineModel<string | number>()
</script>

<template>
  <label>
    <p><slot /></p>
    <div
      class="invalid:border-danger-600 flex rounded border px-1.5 py-1 outline-0 transition-colors focus-within:border-primary-600 disabled:bg-gray-200"
    >
      <div class="grow">
        <input
          v-model="model"
          :placeholder="placeholder"
          :disabled="disabled"
          :type="type"
          class="w-full bg-transparent outline-none"
        />
      </div>
      <!--      @if (iconSuffix()) {-->
      <!--      <div class="px-2 text-gray-500">-->
      <!--        <fa-icon [icon]="iconSuffix()!"></fa-icon>-->
      <!--      </div>-->
      <!--      }-->
    </div>
  </label>
</template>

<style scoped></style>
