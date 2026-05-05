# YearBeat Frontend

Client web del joc YearBeat. Inclou pantalles de Home, Lobby, Gameplay i Resultats amb estil dark neon i suport PWA.

## Tech

- Vue 3 + Vite + TypeScript
- Tailwind CSS
- Pinia + pinia-plugin-persistedstate
- Vue Router
- Socket.io client
- Howler.js
- @vueuse/core + @vueuse/motion
- vite-plugin-pwa

## Scripts

Des de `apps/frontend`:

- `corepack pnpm dev` — entorn desenvolupament
- `corepack pnpm build` — build producció

Des de root:

- `corepack pnpm --filter @yearbeat/frontend dev`
- `corepack pnpm --filter @yearbeat/frontend build`

## Variables d'entorn

Fitxer: `apps/frontend/.env`

- `VITE_BACKEND_URL` (ex: `http://localhost:4000`)
- `VITE_APP_NAME` (ex: `YearBeat`)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

## Firebase Auth (Google)

1. Crea un projecte a Firebase Console.
2. A `Authentication > Sign-in method`, activa:
	- Google
3. A `Project settings > General > Your apps > Web app`, copia la config i omple `apps/frontend/.env`.

## Firebase Hosting (frontend)

Config preparada a:

- `apps/frontend/firebase.json`
- `apps/frontend/.firebaserc`
- `apps/frontend/.env.production.example`

Passos de deploy:

1. Copia `.env.production.example` a `.env.production` i posa el backend públic a `VITE_BACKEND_URL`.
2. Login Firebase:
	- `corepack pnpm --filter @yearbeat/frontend firebase:login`
3. Deploy Hosting:
	- `corepack pnpm --filter @yearbeat/frontend firebase:deploy`

Preview channel (opcional):

- `corepack pnpm --filter @yearbeat/frontend firebase:preview`

Notes:

- És una SPA: `firebase.json` ja inclou rewrite `** -> /index.html`.
- El projecte per defecte és `yearbeat-2fad8` (es pot canviar a `.firebaserc`).

## Estructura principal

- `src/views` — pantalles (`HomeView`, `LobbyView`, `GameView`, `ResultsView`)
- `src/components/game` — disc, timer, selector any, reveal, etc.
- `src/components/lobby` — codi de sala i llista jugadors
- `src/components/results` — podi, leaderboard
- `src/stores` — estat de joc, jugador, socket
- `src/composables` — socket, àudio, PWA, timer
- `src/assets/index.css` — tema i utilitats de disseny

## Flux de dades

1. L'usuari crea/entra a sala via REST (`/api/games/...`)
1.1. El client envia `Authorization: Bearer <firebase_id_token>`
2. El client es connecta per socket
3. Els events `game:*` actualitzen els stores Pinia
4. Les vistes reaccionen per fase (`listening`, `reveal`, `finished`)

## Identitat d'usuari

- L'usuari s'autentica només amb Google o Facebook (Firebase Auth)
- El nom de joc es pren del `displayName` del compte
- El backend valida el token Firebase i ignora noms enviats manualment

## Notes UI

- Disseny optimitzat per mòbil
- Botons tipus pill, gradients violeta, glow
- Countdown circular + disc rotant
- Reveal amb badge taronja i score list animada
- Resultats amb podi 3 columnes

## QA ràpid frontend

- [ ] Home renderitza igual al mockup
- [ ] Inputs de codi de sala fan auto-focus i paste
- [ ] Timer/slider/reaccions funcionen
- [ ] Reveal mostra any correcte i puntuacions
- [ ] Pantalla final mostra podi + leaderboard
- [ ] Build genera `dist/` i SW de PWA
