<script setup lang="ts">
type Color = 'primary' | 'secondary' | 'default' | 'transparent' | 'danger'
type Size = 'default' | 'small' | 'medium' | 'large' | 'icon'
type Type = 'normal' | 'icon' | 'full'

const {
  icon,
  color = 'primary',
  size = 'default',
  type = 'normal',
  rounded,
  disabled,
  mobileText,
} = defineProps<{
  icon?: string | null
  color?: Color
  size?: Size
  type?: Type
  rounded?: boolean
  disabled?: boolean
  mobileText?: boolean
}>()
</script>

<template>
  <button
    :class="{
      primary: color === 'primary',
      secondary: color === 'secondary',
      default: color === 'default',
      danger: color === 'danger',
      'bg-transparent': color === 'transparent',
      'w-full': type === 'full',
      'btn-small': size === 'small',
      'btn-large': size === 'large',
      btn: size === 'default',
      'rounded-full': rounded,
      'icon-only': type === 'icon',
      'text-white': color !== 'transparent',
    }"
    class="relative select-none overflow-hidden rounded text-white outline-none transition-colors"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.primary {
  @apply bg-primary-600;

  &:hover:not([disabled]) {
    @apply bg-primary-700;
  }
  &:active:not([disabled]) {
    @apply bg-primary-700;
  }
  &:disabled {
    @apply opacity-50;
  }
}
.secondary {
  @apply bg-secondary-600;

  &:hover:not([disabled]) {
    @apply bg-secondary-700;
  }
  &:active:not([disabled]) {
    @apply bg-secondary-700;
  }
  &:disabled {
    @apply opacity-50;
  }
}
.danger {
  @apply bg-red-600;

  &:hover:not([disabled]) {
    @apply bg-red-700;
  }
  &:active:not([disabled]) {
    @apply bg-red-700;
  }
  &:disabled {
    @apply opacity-50;
  }
}

.default {
  @apply bg-gray-200 text-black;

  &:hover {
    @apply bg-gray-300;
  }
  &:active {
    @apply bg-gray-300;
  }
  &:disabled {
    @apply bg-gray-100;
  }
}
.danger {
  @apply bg-red-600;

  &:hover:not([disabled]) {
    @apply bg-red-700;
  }
  &:active:not([disabled]) {
    @apply bg-red-700;
  }
  &:disabled {
    @apply opacity-50;
  }
}
.btn:not(.icon-only) {
  @apply px-2 py-1.5;
}

.btn-small:not(.icon-only) {
  @apply px-3 py-1 text-sm;
}

.btn-large:not(.icon-only) {
  @apply px-4 py-2 text-lg;
}

.icon-only {
  @apply flex items-center justify-center;
  width: 40px;
  height: 40px;
}

.icon-only.btn-large {
  width: 50px;
  height: 50px;
}

.icon-only.btn-small {
  width: 30px;
  height: 30px;
}
</style>
