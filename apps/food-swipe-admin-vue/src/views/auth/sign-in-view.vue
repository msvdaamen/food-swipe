<script setup lang="ts">
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/form/input.vue'
import { computed, ref } from 'vue'
import { z } from 'zod'
import { useAuthStore } from '@/modules/auth/auth.store'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useAuthStore()

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const form = ref({
  email: '',
  password: '',
})

const isValid = computed(() => schema.safeParse(form.value).success)
const error = ref(false)

const submit = async () => {
  if (!isValid.value) return
  error.value = false
  try {
    await store.signIn(form.value)
    await router.push('/')
  } catch {
    error.value = true
  }
}
</script>

<template>
  <div
    class="background flex min-h-screen flex-1 items-center justify-center bg-gray-50 text-white dark:bg-dark-900"
  >
    <div class="w-500 p-5">
      <h1 class="mb-3 text-center text-4xl">Food swipe admin</h1>

      <h2 class="mb-10 text-center text-2xl">Sign in to your account</h2>
      <div class="rounded-xl p-10 shadow backdrop-blur-xl dark:bg-dark-900 dark:bg-opacity-50">
        <form @submit.prevent="submit">
          <span class="text-red-500" v-if="error">Invalid email or password</span>
          <div class="mb-4">
            <Input placeholder="example@gmail.com" type="email" v-model="form.email">Email</Input>
          </div>

          <div class="mb-4">
            <Input placeholder="Password" type="password" v-model="form.password">Password</Input>

            <div class="mt-3 flex justify-end">
              <RouterLink to="/auth/forgot-password"> Forgot password? </RouterLink>
            </div>
          </div>
          <Button size="large" type="full" :disabled="!isValid"> Sign in </Button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background: url('/images/auth-background.jpg') no-repeat center left / cover;
}

.w-500 {
  width: 500px;
}
</style>
