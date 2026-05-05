# ── YearBeat Backend — Cloud Run ─────────────────────────────
FROM node:20-slim

# OpenSSL is required by Prisma query engine
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# ── 1. Install dependencies (cached layer) ──────────────────
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/backend/package.json apps/backend/
COPY packages/shared-types/package.json packages/shared-types/

RUN pnpm install --frozen-lockfile

# ── 2. Copy source code ─────────────────────────────────────
COPY packages/shared-types/ packages/shared-types/
COPY apps/backend/ apps/backend/

# ── 3. Generate Prisma client for Linux ──────────────────────
RUN cd apps/backend && npx prisma generate

# ── 4. Run ───────────────────────────────────────────────────
ENV NODE_ENV=production

EXPOSE 8080

WORKDIR /app/apps/backend

CMD ["npx", "tsx", "src/index.ts"]
