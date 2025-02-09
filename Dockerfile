FROM node:20 AS base
WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .
RUN pnpm build

FROM node:20-alpine3.19 as release
WORKDIR /app
RUN npm i -g pnpm

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/.next ./.next

COPY --from=base /app/next.config.mjs ./next.config.mjs
COPY --from=base /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=base /app/tailwind.config.ts ./tailwind.config.ts

EXPOSE 3000

CMD ["pnpm", "start"]