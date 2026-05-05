# YearBeat Backend

Servidor API + WebSocket per gestionar sales, rondes, puntuacions i sincronització de partida.

## Tech

- Node.js + Express + TypeScript
- Socket.io
- Prisma ORM
- PostgreSQL
- Redis (ioredis)
- Axios (Deezer API)
- Zod (validació)

## Scripts

Des de `apps/backend`:

- `corepack pnpm dev` — mode watch (`tsx`)
- `corepack pnpm build` — compilació TypeScript
- `corepack pnpm prisma generate`

Des de root:

- `corepack pnpm --filter @yearbeat/backend dev`
- `corepack pnpm --filter @yearbeat/backend build`
- `corepack pnpm --filter @yearbeat/backend prisma generate`
- `corepack pnpm --filter @yearbeat/backend prisma db push`

## Variables d'entorn

Fitxer: `apps/backend/.env`

- `NODE_ENV=development`
- `PORT=4000`
- `DATABASE_URL=postgresql://...`
- `DIRECT_URL=postgresql://...` (opcional, Prisma)
- `REDIS_URL=redis://...`
- `FRONTEND_URL=http://localhost:5173`
- `FIREBASE_PROJECT_ID=...`

## Prisma

Schema: `apps/backend/prisma/schema.prisma`

Models principals:

- `Game`
- `Player`
- `Song`
- `GameSong`
- `Answer`

Comandes habituals:

- Generar client: `corepack pnpm prisma generate`
- Aplicar schema: `corepack pnpm prisma db push`

## API REST

Base path: `/api`

- `POST /games/create`
- `POST /games/join`
- `GET /games/:code`
- `GET /deezer/sample`

### Auth requerida a `POST /games/create` i `POST /games/join`

- Header obligatori: `Authorization: Bearer <firebase_id_token>`
- El nom de jugador es força des del compte Firebase (`displayName`)
- Proveïdors permesos al frontend: Google i Facebook

## Socket events

Client → Server:

- `game:join`
- `game:start`
- `game:submitAnswer`
- `game:nextSong`
- `game:reaction`

Server → Client:

- `game:playerJoined`
- `game:started`
- `game:songPlaying`
- `game:timerUpdate`
- `game:answerReceived`
- `game:reaction`
- `game:showAnswers`
- `game:finished`
- `game:error`

## Lògica de score

Funció a `src/services/scoreService.ts`:

- exacte → 1000
- ±1 → 800
- ±3 → 600
- ±5 → 400
- ±10 → 200
- ±20 → 50
- resta → 0

## QA ràpid backend

- [ ] `prisma generate` funciona
- [ ] `prisma db push` aplica schema
- [ ] `dev` arrenca a `PORT`
- [ ] Crear sala retorna joc + host
- [ ] Join actualitza jugadors i sockets
- [ ] Timer/reveal/final scores es propaguen

## Problemes freqüents

- Prisma no troba client:
  - torna a generar: `corepack pnpm prisma generate`
- Connexió a BD fallida:
  - comprova `DATABASE_URL`
- Connexió Redis fallida:
  - comprova `REDIS_URL`
