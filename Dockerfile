FROM oven/bun:1.4.2 AS bun-runtime
FROM node:22-bookworm-slim AS build
COPY --from=bun-runtime /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build

FROM nginx:stable-alpine
COPY configs/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist/client /usr/share/nginx/html
EXPOSE 80
