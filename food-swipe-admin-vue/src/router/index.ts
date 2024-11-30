import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@/modules/auth/guards/auth.guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home.vue'),
      beforeEnter: authGuard,
      children: [
        {
          path: '',
          name: 'recipes',
          component: () => import('../views/recipes/recipes.vue'),
        },
        {
          path: ':id',
          name: 'recipe',
          component: () => import('../views/recipes/recipe.vue'),
          props: (route) => ({ id: Number(route.params.id) }),
        },
      ],
    },
    {
      path: '/auth',
      children: [
        {
          path: 'sign-in',
          component: () => import('../views/auth/sign-in.vue'),
        },
      ],
    },
  ],
})

export default router
