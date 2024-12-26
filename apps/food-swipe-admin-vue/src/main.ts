import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import type { AppRouter } from 'food-swipe-admin-api';
import {createTRPCProxyClient, httpBatchLink} from "@trpc/client";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
      // You can pass any HTTP headers you wish here
      async headers() {
        return {
          authorization: '',
        };
      },
      fetch(url, options) {
        return fetch(url, options);
      },
    }),
  ],
});


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
