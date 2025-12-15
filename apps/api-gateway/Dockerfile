FROM oven/bun

COPY package.json bun.lock ./
COPY /packages/ ./packages/
COPY /apps/food-swipe-admin-backend/ ./apps/food-swipe-admin-backend/

RUN bun install --filter 'food-swipe-admin-backend'

CMD ["bun", "apps/food-swipe-admin-backend/src/app.ts"]