FROM node:lts-alpine AS base

FROM base AS builder

WORKDIR /api

COPY ./package.json .

RUN npm i

FROM base AS runner

COPY . .

CMD ["npm", "run", "start"]