FROM oven/bun

COPY bun.lockb .
COPY package.json .

RUN bun install

COPY src ./src

CMD ["bun", "src/app.ts"]