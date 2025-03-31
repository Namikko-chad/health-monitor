FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist

RUN pnpm install

ENV SERVER_PORT=3060 \
  DOMAIN_NAME=localhost \
  SLACK_BOT_TOKEN="" \
  SLACK_DEFAULT_CHANNEL="" \
  TELEGRAM_BOT_TOKEN="" \
  MAIL_HOST="" \
  MAIL_USER="" \
  MAIL_PASSWORD="" \
  MAIL_FROM="" \
  RESOURCES="" \
  DEBUG=false \
  NODE_ENV=Production

EXPOSE ${SERVER_PORT}

CMD ["pnpm", "start"]

LABEL maintainer="Leonhard Schmidt <bloodheavendevelop@gmail.com>"
LABEL version="1.0"
LABEL description="Health Monitor"