FROM oven/bun:latest AS base

FROM base AS builder

WORKDIR /api

COPY ./package.json ./bun.lock ./

RUN bun i --production=false

FROM base AS runner

COPY --from=builder /api/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

CMD ["bun", "run", "dev"]
