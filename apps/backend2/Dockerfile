FROM oven/bun

COPY package.json bun.lock ./
COPY /packages/ ./packages/
COPY /apps/food-swipe-backend/ ./apps/food-swipe-backend/

RUN bun install --filter 'food-swipe-backend'

CMD ["bun", "apps/food-swipe-backend/src/app.ts"]