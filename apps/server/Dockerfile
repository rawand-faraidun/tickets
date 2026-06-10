FROM node:24-slim

WORKDIR /app

RUN corepack enable
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN DATABASE_URL=file:/tmp/local.db CI=true pnpm install --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "--filter", "server", "dev"]
