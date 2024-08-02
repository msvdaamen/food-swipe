import { Hono } from 'hono'

type Bindings = {
  DATABASE_URL: string;
  STORAGE_PUBLIC_URL: string;
  UPLOADTHING_SECRET: string;
  UPLOADTHING_APP_ID: string;
}

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => {
  return c.text('Test 1')
});

app.get('/test', (c) => {
  return c.text('Test 2')
});


export default app
