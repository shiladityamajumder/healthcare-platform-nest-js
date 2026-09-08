FROM node:24-alpine AS build
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile=false && pnpm build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD ["node", "dist/apps/api/main.js"]
