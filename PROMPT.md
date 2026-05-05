# YearBeat — Music Trivia Game (Full Stack)

## PROJECT OVERVIEW
Create a full-stack multiplayer music trivia game called **YearBeat** where 
players guess the release year of songs. Up to 10 players join a room, 
listen to 20-second song previews from Deezer API, and score points based 
on how close their year guess is to the correct answer.

---

## TECH STACK

### Frontend
- Vue 3 + Vite + TypeScript
- PWA (vite-plugin-pwa)
- Tailwind CSS
- Shadcn-vue (components)
- Pinia (state management)
- Vue Router 4
- Socket.io-client
- Howler.js (audio)
- @vueuse/core + @vueuse/motion

### Backend
- Node.js + Express + TypeScript
- Socket.io (WebSockets)
- Prisma ORM + PostgreSQL
- Redis (ioredis)
- Axios (Deezer API calls)
- Zod (validation)

### Monorepo
- Turborepo + pnpm workspaces
- packages/shared-types (shared TypeScript types)

---

## DESIGN SYSTEM

### Colors (Tailwind config)
```typescript
colors: {
  'game-bg':       '#0f0f1a',  // Main background
  'game-card':     '#1a1a2e',  // Card background
  'game-card-alt': '#16213e',  // Alternative card
  'game-accent':   '#7c3aed',  // Primary violet
  'game-accent-2': '#a855f7',  // Light violet
  'game-success':  '#10b981',  // Correct answer green
  'game-warning':  '#f59e0b',  // Close answer amber
  'game-danger':   '#ef4444',  // Wrong answer red
  'game-reveal':   '#f97316',  // Reveal orange (like image)
  'game-text':     '#ffffff',  // Primary text
  'game-muted':    '#94a3b8',  // Secondary text
}
```

### Typography
- Font: Inter (Google Fonts)
- Year display: 900 weight, 80px (giant number on game screen)
- Titles: 700 weight
- Body: 400 weight
- Buttons: 600 weight, uppercase, letter-spacing

### Component Style Rules
- Border radius: 16px cards, 999px buttons (pill shape)
- Buttons: gradient background (violet → purple), full width on mobile
- Glow effects: box-shadow with rgba(124, 58, 237, 0.4)
- Glassmorphism on overlays: backdrop-blur-md + bg-white/10
- All dark theme, no light mode needed

---

## FOLDER STRUCTURE

```
yearbeat/
├── apps/
│   ├── frontend/
│   │   ├── public/
│   │   │   └── icons/ (PWA icons 192x192, 512x512)
│   │   └── src/
│   │       ├── main.ts
│   │       ├── App.vue
│   │       ├── router/
│   │       │   └── index.ts
│   │       ├── stores/
│   │       │   ├── gameStore.ts
│   │       │   ├── playerStore.ts
│   │       │   └── socketStore.ts
│   │       ├── composables/
│   │       │   ├── useSocket.ts
│   │       │   ├── useAudio.ts
│   │       │   ├── useTimer.ts
│   │       │   └── usePWA.ts
│   │       ├── views/
│   │       │   ├── HomeView.vue
│   │       │   ├── LobbyView.vue
│   │       │   ├── GameView.vue
│   │       │   └── ResultsView.vue
│   │       ├── components/
│   │       │   ├── ui/ (Shadcn-vue generated)
│   │       │   ├── game/
│   │       │   │   ├── TheDisc.vue
│   │       │   │   ├── YearSelector.vue
│   │       │   │   ├── CountdownTimer.vue
│   │       │   │   ├── PlayerOrbit.vue
│   │       │   │   ├── RoundReveal.vue
│   │       │   │   ├── ScoreCard.vue
│   │       │   │   └── ReactionBar.vue
│   │       │   ├── lobby/
│   │       │   │   ├── PlayerList.vue
│   │       │   │   └── RoomCode.vue
│   │       │   ├── results/
│   │       │   │   ├── Podium.vue
│   │       │   │   ├── Leaderboard.vue
│   │       │   │   └── ShareCard.vue
│   │       │   └── shared/
│   │       │       ├── InstallPWA.vue
│   │       │       └── OfflineBanner.vue
│   │       ├── assets/
│   │       │   └── index.css
│   │       └── lib/
│   │           └── utils.ts
│   │
│   └── backend/
│       ├── src/
│       │   ├── index.ts
│       │   ├── config/
│       │   │   ├── env.ts
│       │   │   └── redis.ts
│       │   ├── routes/
│       │   │   ├── index.ts
│       │   │   ├── game.routes.ts
│       │   │   └── deezer.routes.ts
│       │   ├── socket/
│       │   │   ├── index.ts
│       │   │   └── handlers/
│       │   │       ├── gameHandler.ts
│       │   │       └── playerHandler.ts
│       │   ├── services/
│       │   │   ├── deezerService.ts
│       │   │   ├── gameService.ts
│       │   │   ├── scoreService.ts
│       │   │   └── cacheService.ts
│       │   ├── models/
│       │   │   └── types.ts
│       │   └── middleware/
│       │       ├── errorHandler.ts
│       │       └── validate.ts
│       └── prisma/
│           └── schema.prisma
│
└── packages/
    └── shared-types/
        └── src/
            ├── game.types.ts
            └── socket.types.ts
```

---

## SCREENS TO BUILD

### SCREEN 1: HomeView.vue
Based on the design:
- Dark background (#0f0f1a) with animated music notes floating
- App logo "YearBeat" centered top with musical note icon and glow
- Subtitle: "Endevina l'any de la cançó"
- Input field: "NOM D'USUARI" with user icon, dark card background
- Primary button: "CREAR PARTIDA" → full width, violet gradient, pill shape
- Divider: "O" text between buttons
- Room code input: "CODI DE SALA" label + 4 individual character boxes
  (each box: dark rounded square, large monospace font, auto-focus next)
- Secondary button: "UNIR-SE A PARTIDA" → outline violet, pill shape
- Stats bar at bottom: "1.2k ONLINE | 450 PARTIDES | 85% MATCH"
- Bottom navigation: LOBBY | RÀNQUING | ACTIVITAT | AJUSTOS icons

```vue
<!-- HomeView.vue key elements -->
<template>
  <!-- Animated background with floating music notes -->
  <!-- Logo section with glow effect -->
  <!-- Username input with validation -->
  <!-- Create game CTA button (violet gradient) -->
  <!-- OR divider -->
  <!-- 4-digit room code input (individual boxes, auto-tab) -->
  <!-- Join game button (outline style) -->
  <!-- Live stats bar -->
  <!-- Bottom nav tabs -->
</template>
```

### SCREEN 2: LobbyView.vue
- Room code displayed large at top (monospace, violet badge)
- Share/copy button next to code
- Player list: avatars with colors + names + HOST badge for first player
- Empty slots shown as dashed placeholders
- Player count "X / 10"
- "INICIAR PARTIDA" button (only for host, disabled < 2 players)
- Waiting animation "..."

### SCREEN 3: GameView.vue — 3 phases

#### Phase A: LISTENING + VOTING (left image)
```
Layout (top to bottom):
1. Header: [X] "CANÇÓ 5/25" [chat icon] + violet progress bar
2. THE DISC component (center):
   - Circular album cover (rotating animation)
   - Countdown timer overlay (top-right of disc): 
     circular progress ring, number inside, 
     red when < 5s with pulse animation
   - Song title and artist BLURRED below disc
3. YEAR SELECTOR:
   - Giant year number: "1994" (80px, weight 900, white)
   - Horizontal slider (violet thumb, dark track)
   - Labels: "1960" left, "2024" right
   - Genre hints: "Disco 🕺 | Grunge 🎸 | Pop2000s 🎧 | Reggaeton 🔥"
4. DECADE BUTTONS grid (2 rows x 4 cols):
   [60s][70s][80s][90s]  ← active one is violet filled
   [00s][10s][20s][↺]
5. REACTION BAR: emoji buttons [😄][😱][🔥][🤯]
6. PLAYER AVATARS ROW:
   - Small circular avatars
   - Green checkmark overlay if voted
   - Gray dot if waiting
7. CONFIRM BUTTON: "CONFIRMAR →" full width, violet gradient pill
```

#### Phase B: REVEAL (center image)
```
Layout:
1. Album cover revealed (no blur, large, centered)
2. Song title + artist name visible
3. "ANY CORRECTE" badge → orange/amber gradient, large
4. Correct year number: "1982" very large inside badge
5. Round results list (animated, one by one):
   Each row: [Avatar][Name + voted year + diff] [+score]
   - Green row if exact/close
   - Marc_92 · Vot: 1982 (Exacte!) · +1000  ← green, "3 EN RATXA!" badge
   - Laia_Music · Vot: 1984 (+2 anys) · +600 ← yellow
   - Pau_Retro · Vot: 1975 (-7 anys) · +100  ← red/orange
6. "SEGÜENT CANÇÓ" button (host) / "Esperant que l'host..." (others)
```

#### Phase C: FINAL RESULTS (right image)
```
Layout:
1. Header: YearBeat logo + "PARTIDA ACABADA 🎉"
2. PODIUM component:
   - Position 2 (SARAH): medium height, silver, avatar, "LA NOSTÀLGICA" title
   - Position 1 (ALEX): tallest, gold, avatar + star icon, "DJ DEL GRUP 🎧" title
   - Position 3 (MIKE): shortest, bronze, avatar, "L'ALEATURI" title
3. Victory message box:
   - "COMPARTEIX LA TEVA VICTÒRIA"
   - Personalized message: "Ets l'amo de la pista! 🎧"
   - "GENERA TARGETA DE RESULTATS" button (share card)
4. Full leaderboard:
   Each row: [#][Avatar][Name + badge][Score]
   1. Alex CHAMPION 🏆 · 2,450
   2. Sarah · 2,120
   3. Mike · 1,980
5. Action buttons:
   - "JUGAR DE NOU" → violet gradient, full width
   - "TORNAR A L'INICI" → dark, outline, full width
```

---

## KEY COMPONENTS IMPLEMENTATION

### TheDisc.vue
```vue
<!--
Circular album cover with:
- CSS animation: rotation 20s linear infinite (while playing)
- Blurred when listening phase, revealed on reveal phase
- Vinyl groove rings overlay
- Timer circle overlay (SVG stroke-dasharray animated)
- Glow effect matching album cover dominant color
  (use fast-average-color or color-thief-ts library)
-->
```

### YearSelector.vue
```vue
<!--
Props: modelValue (year), disabled
Emits: update:modelValue, confirm

Features:
- Giant year display (v-motion animate on change)
- Shadcn Slider component (customized violet)
- Decade quick-select buttons (auto-set slider)
- Genre hint labels along the timeline
- Confirm button (disabled after voting)
- Haptic feedback on decade change (navigator.vibrate)
-->
```

### CountdownTimer.vue
```vue
<!--
Props: seconds, total
- SVG circular progress ring
- Color transitions: green > yellow > red
- Pulse animation when seconds < 5
- Smooth interpolation between server ticks
-->
```

### RoomCode.vue
```vue
<!--
4 individual input boxes for room code
- Auto-focus next box on input
- Auto-uppercase
- Paste support (distribute chars across boxes)
- Backspace goes to previous box
- Violet border glow when active
-->
```

---

## BACKEND IMPLEMENTATION

### Deezer Service
```typescript
// GET https://api.deezer.com/search?q=year:"1980-1989"&limit=25&order=RANKING
// Filter tracks: must have preview URL
// Map to Song type: { id, title, artist, year, previewUrl, coverUrl }
// Cache results in Redis for 24h
// Generate 25 songs mixing multiple decades
// No API key required!
```

### Score Calculation
```typescript
function calculateScore(correct: number, guess: number): number {
  const diff = Math.abs(correct - guess)
  if (diff === 0)  return 1000  // Exacte!
  if (diff <= 1)   return 800
  if (diff <= 3)   return 600
  if (diff <= 5)   return 400
  if (diff <= 10)  return 200
  if (diff <= 20)  return 50
  return 0
}
```

### Socket.io Events
```typescript
// CLIENT → SERVER
'game:join'         → { code: string, playerName: string }
'game:start'        → { gameId: string }
'game:submitAnswer' → { gameSongId: string, yearGuess: number }
'game:nextSong'     → { gameId: string }  // host only
'game:reaction'     → { gameId: string, emoji: string }

// SERVER → CLIENT  
'game:playerJoined'   → { players: Player[] }
'game:started'        → { firstSong: Song, songNumber: number }
'game:songPlaying'    → { song: Song, songNumber: number }
'game:timerUpdate'    → { secondsLeft: number }
'game:answerReceived' → { playerId: string, answered: boolean }
'game:reaction'       → { playerId: string, emoji: string }
'game:showAnswers'    → { answers: RoundAnswer[], correctYear: number }
'game:finished'       → { finalScores: PlayerScore[] }
'game:error'          → { message: string }
```

### Prisma Schema
```prisma
model Game {
  id          String     @id @default(cuid())
  code        String     @unique
  status      String     @default("LOBBY")
  currentSong Int        @default(0)
  config      Json
  createdAt   DateTime   @default(now())
  players     Player[]
  gameSongs   GameSong[]
}
model Player {
  id         String   @id @default(cuid())
  name       String
  isHost     Boolean  @default(false)
  totalScore Int      @default(0)
  gameId     String
  socketId   String?
  game       Game     @relation(fields: [gameId], references: [id])
  answers    Answer[]
}
model Song {
  id            String     @id @default(cuid())
  deezerTrackId Int        @unique
  title         String
  artist        String
  year          Int
  previewUrl    String
  coverUrl      String
  gameSongs     GameSong[]
}
model GameSong {
  id      String   @id @default(cuid())
  order   Int
  gameId  String
  songId  String
  game    Game     @relation(fields: [gameId], references: [id])
  song    Song     @relation(fields: [songId], references: [id])
  answers Answer[]
  @@unique([gameId, order])
}
model Answer {
  id         String   @id @default(cuid())
  yearGuess  Int
  score      Int      @default(0)
  diff       Int
  playerId   String
  gameSongId String
  player     Player   @relation(fields: [playerId], references: [id])
  gameSong   GameSong @relation(fields: [gameSongId], references: [id])
  @@unique([playerId, gameSongId])
}
```

---

## PINIA STORES

### gameStore.ts
```typescript
// State: currentGame, players, currentSong, songNumber,
//        phase ('listening'|'voting'|'reveal'|'finished'),
//        timeLeft, roundAnswers, myAnswer

// Getters: isHost, hasAnswered, progress (0-100), totalSongs

// Actions: setGame, updatePlayers, startSong, submitAnswer,
//          showReveal, updateTimer, finishGame, reset
```

### playerStore.ts
```typescript
// State: myId, myName, myScore
// Persisted with pinia-plugin-persistedstate
// Actions: setPlayer, updateScore, reset
```

---

## ANIMATIONS (using @vueuse/motion)

```typescript
// Year number change: scale 0.8 → 1.1 → 1.0 (bounce)
// Score reveal: slide up from bottom + fade in
// Player avatars: staggered entrance in lobby
// Podium: columns grow from 0 height with spring
// Page transitions: fade + translateY(20px)
// Disc rotation: CSS transform rotate, paused when not playing
// Countdown pulse: when < 5s, scale 1 → 1.05 → 1 every second
```

---

## ENV VARIABLES

```bash
# Backend
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://user:pass@localhost:5432/yearbeat"
REDIS_URL="redis://localhost:6379"
FRONTEND_URL="http://localhost:5173"

# Frontend
VITE_BACKEND_URL="http://localhost:4000"
VITE_APP_NAME="YearBeat"
```

---

## TASK

Generate the complete project following ALL specifications above.

Start with:
1. Monorepo setup (turbo.json, root package.json, pnpm-workspace.yaml)
2. shared-types package (all TypeScript interfaces)
3. Backend: Express server + Prisma schema + DeezerService + GameService + 
   ScoreService + Socket.io handlers
4. Frontend: Vue 3 app with all views and components matching the provided 
   UI design exactly — dark theme, violet accents, pill buttons, 
   giant year number, circular disc with timer, decade buttons grid,
   reveal screen with orange badge, podium results screen

Match the UI designs pixel-perfect:
- HomeView: floating notes background, individual code boxes, stats bar, bottom nav
- GameView listening: rotating disc + circular timer + giant year + decade grid
- GameView reveal: orange "ANY CORRECTE" badge + animated score list
- ResultsView: 3-column podium + leaderboard + share card button