# YearBeat

Joc multijugador de trivia musical on els jugadors han d'endevinar l'any de llançament d'una cançó a partir d'un preview de 20 segons.

**Demo:** https://yearbeat-2fad8.web.app/

## Stack

- Frontend: Vue 3 + Vite + TypeScript + Tailwind + Pinia + Socket.io client + PWA
- Backend: Node.js + Express + TypeScript + Socket.io + Prisma + PostgreSQL + Redis
- API externa: Deezer (previews de 30s, metadades de cançons i portades)
- Monorepo: Turborepo + pnpm workspaces
- Shared contracts: `packages/shared-types`

## Estructura

- `apps/frontend` — Aplicació client (UI i gameplay)
- `apps/backend` — API REST + WebSocket + lògica de joc
- `packages/shared-types` — Tipus compartits entre front i back

## Requisits previs

- Node.js 20+ (recomanat 22+)
- Corepack habilitat
- PostgreSQL en execució
- Redis en execució

## Configuració ràpida

1. Instal·lar dependències:

   - `corepack pnpm install`

2. Configurar variables d'entorn:

   - Backend: `apps/backend/.env`
   - Frontend: `apps/frontend/.env`

3. Generar Prisma client i aplicar schema:

   - `corepack pnpm --filter @yearbeat/backend prisma generate`
   - `corepack pnpm --filter @yearbeat/backend prisma db push`

## Execució en desenvolupament

Opció A (separat):

- Terminal 1: `corepack pnpm --filter @yearbeat/backend dev`
- Terminal 2: `corepack pnpm --filter @yearbeat/frontend dev`

Opció B (monorepo):

- `corepack pnpm dev`

> Si `turbo` falla al teu entorn, usa l'opció A.

## Build

- `corepack pnpm --filter @yearbeat/shared-types build`
- `corepack pnpm --filter @yearbeat/backend build`
- `corepack pnpm --filter @yearbeat/frontend build`

## Flux funcional (manual)

1. Obrir `http://localhost:5173`
2. Crear una sala
3. Obrir segona pestanya/dispositiu i unir-se amb codi
4. Iniciar partida (host)
5. Fer votacions, reveal i pantalla final

## Checklist QA (curt)

- [ ] Es pot crear i unir a partida
- [ ] El compte enrere baixa i fa reveal al final
- [ ] Puntuació correcta segons proximitat d'any
- [ ] Llista final i podi coherents
- [ ] Àudio preview reprodueix en mòbil i desktop
- [ ] PWA es genera en build

## Troubleshooting

- `pnpm not recognized`:
  - usa `corepack pnpm ...`
- Error Prisma client:
  - executa `corepack pnpm --filter @yearbeat/backend prisma generate`
- Error connexió BD/Redis:
  - revisa `apps/backend/.env` i serveis locals

## Documentació específica

- Frontend: `apps/frontend/README.md`
- Backend: `apps/backend/README.md`
