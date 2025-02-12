FROM oven/bun

COPY bun.lockb .
COPY package.json .

RUN bun install

COPY ./ ./

CMD ["bun", "run", "migrate"]