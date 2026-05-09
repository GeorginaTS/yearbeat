# YearBeat

![Logo](apps/frontend/public/img/logo.png)

Multiplayer musical trivia game where players must guess the release year of a song from a 20-second preview.

**Demo:** https://yearbeat-2fad8.web.app/

## Stack

- Frontend: Vue 3 + Vite + TypeScript + Tailwind + Pinia + Socket.io client + PWA
- Backend: Node.js + Express + TypeScript + Socket.io + Prisma + PostgreSQL + Redis
- External API: Deezer (30s previews, song metadata and covers)
- Monorepo: Turborepo + pnpm workspaces
- Shared contracts: `packages/shared-types`

## Structure

- `apps/frontend` — Client application (UI and gameplay)
- `apps/backend` — REST API + WebSocket + game logic
- `packages/shared-types` — Shared types between frontend and backend

## Prerequisites

- Node.js 20+ (22+ recommended)
- Corepack enabled
- PostgreSQL running
- Redis running

## Quick Setup

1. Install dependencies:

   - `corepack pnpm install`

2. Configure environment variables:

   - Backend: `apps/backend/.env`
   - Frontend: `apps/frontend/.env`

3. Generate Prisma client and apply schema:

   - `corepack pnpm --filter @yearbeat/backend prisma generate`
   - `corepack pnpm --filter @yearbeat/backend prisma db push`

## Development

Option A (separate):

- Terminal 1: `corepack pnpm --filter @yearbeat/backend dev`
- Terminal 2: `corepack pnpm --filter @yearbeat/frontend dev`

Option B (monorepo):

- `corepack pnpm dev`

> If `turbo` fails in your environment, use Option A.

## Build

- `corepack pnpm --filter @yearbeat/shared-types build`
- `corepack pnpm --filter @yearbeat/backend build`
- `corepack pnpm --filter @yearbeat/frontend build`

## Functional Flow (manual)

1. Open `http://localhost:5173`
2. Create a room
3. Open a second tab/device and join with the room code
4. Start the game (host)
5. Vote, reveal, and view the final screen

## QA Checklist (short)

- [ ] Can create and join a game
- [ ] Countdown decreases and reveals at the end
- [ ] Score is correct based on year proximity
- [ ] Final leaderboard and podium are consistent
- [ ] Audio preview plays on mobile and desktop
- [ ] PWA is generated on build

## Troubleshooting

- `pnpm not recognized`:
  - use `corepack pnpm ...`
- Prisma client error:
  - run `corepack pnpm --filter @yearbeat/backend prisma generate`
- DB/Redis connection error:
  - check `apps/backend/.env` and local services

## Specific Documentation

- Frontend: `apps/frontend/README.md`
- Backend: `apps/backend/README.md`
