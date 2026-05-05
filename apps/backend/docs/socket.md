# Socket.io — YearBeat

Documentació del sistema de WebSockets: events, payloads i flux de partida.

## Connexió

El servidor Socket.io s'inicialitza a `src/socket/index.ts` i s'adjunta al servidor HTTP d'Express.

- **CORS**: accepta connexions des de `FRONTEND_URL` (env)
- **Transport**: el client frontend força `websocket` (sense polling)
- **URL frontend**: `VITE_BACKEND_URL` (ex: `http://localhost:4000`)

Cada connexió registra dos grups de handlers:
- `registerGameHandlers` — tota la lògica de partida
- `registerPlayerHandlers` — gestió de desconnexió

### Dades per socket (`socket.data`)

Quan un jugador fa `game:join`, el socket emmagatzema:

| Camp | Contingut |
|------|-----------|
| `socket.data.playerId` | ID del jugador a la BD |
| `socket.data.gameId` | ID de la partida |
| `socket.data.roomCode` | Codi de sala (room de Socket.io) |

---

## Events client → servidor (`ClientToServerEvents`)

### `game:join`
El client s'uneix a una sala existent.

```ts
{ code: string; playerName: string }
```

- Crida `gameService.joinGame` i afegeix el socket a la room `code`
- Emet `game:playerJoined` a tots els de la sala

### `game:start`
L'host inicia la partida.

```ts
{ gameId: string }
```

- Canvia l'estat del joc a `PLAYING`
- Inicia la primera ronda (timer de 20s) i emet `game:started`

### `game:submitAnswer`
Un jugador envia la seva resposta d'any.

```ts
{ gameSongId: string; yearGuess: number }
```

- Guarda la resposta i emet `game:answerReceived` a la sala
- Si tots han respost, cancel·la el timer i emet `game:showAnswers` immediatament

### `game:nextSong`
L'host avança a la cançó següent (s'envia des del reveal).

```ts
{ gameId: string }
```

- Si hi ha cançó següent: emet `game:songPlaying` i reinicia el timer
- Si no n'hi ha: calcula puntuacions finals i emet `game:finished`

### `game:reaction`
Un jugador envia una reacció emoji.

```ts
{ gameId: string; emoji: string }
```

- Re-emet `game:reaction` a tota la sala amb `playerId` afegit

---

## Events servidor → client (`ServerToClientEvents`)

### `game:playerJoined`
Llista de jugadors actualitzada (inclou el nou).

```ts
{ players: Player[] }
```

### `game:started`
Primera cançó de la partida llesta per reproduir.

```ts
{ firstSong: ActiveSong; songNumber: number }
```

- El client navega a `/game/:code` en rebre aquest event

### `game:songPlaying`
Cançó següent (ronda 2+).

```ts
{ song: ActiveSong; songNumber: number }
```

### `game:timerUpdate`
Tick del compte enrere (cada segon, de 20 a 0).

```ts
{ secondsLeft: number }
```

### `game:answerReceived`
Notifica que un jugador ha respost (sense revelar la resposta).

```ts
{ playerId: string; answered: boolean }
```

### `game:showAnswers`
Reveal de la ronda: respostes de tots els jugadors i any correcte.

```ts
{
  answers: RoundAnswer[]  // { playerId, playerName, avatarColor, yearGuess, diff, score }
  correctYear: number
}
```

### `game:reaction`
Reacció emoji propagada a la sala.

```ts
{ playerId: string; emoji: string }
```

### `game:finished`
Fi de partida amb puntuacions definitives.

```ts
{
  finalScores: PlayerScore[]  // { playerId, playerName, avatarColor, totalScore, position, badge }
}
```

- El client navega a `/results/:code` en rebre aquest event

### `game:error`
Error de qualsevol operació. Només s'emet al socket que l'ha causat.

```ts
{ message: string }
```

---

## Flux complet d'una partida

```
Client (host)          Servidor              Clients (tots)
─────────────────────────────────────────────────────────
game:join ──────────►  joinGame()
                       socket.join(room)
                       ◄──────────────────── game:playerJoined

game:start ─────────►  startGame()
                       startRound(song=1)
                       ◄──────────────────── game:started
                       ◄──────────────────── game:timerUpdate (×20)

game:submitAnswer ──►  submitAnswer()
                       ◄──────────────────── game:answerReceived
                    [si tots han respost → cancel·la timer]
                       ◄──────────────────── game:showAnswers

game:nextSong ──────►  nextSong()
                    [si hi ha més cançons]
                       ◄──────────────────── game:songPlaying
                       ◄──────────────────── game:timerUpdate (×20)
                    [si és l'última]
                       ◄──────────────────── game:finished
```

---

## Timer i cancel·lació anticipada

El servidor manté un `Map<gameId, NodeJS.Timeout>` amb els timers actius.

- El timer emet `game:timerUpdate` cada segon durant 20 ticks
- En arribar a 0, emet `game:showAnswers` automàticament
- Si tots els jugadors responen abans que acabi el compte, el timer es cancel·la i el reveal s'emet immediatament

---

## Desconnexió

`playerHandler` escolta `disconnect` i crida `gameService.setPlayerSocket(playerId, null)` per marcar el jugador com a desconnectat a la BD. No s'expulsa el jugador de la partida.

---

## Fitxers rellevants

| Fitxer | Responsabilitat |
|--------|----------------|
| `src/socket/index.ts` | Creació del servidor i registre de handlers |
| `src/socket/handlers/gameHandler.ts` | Tots els events de partida |
| `src/socket/handlers/playerHandler.ts` | Desconnexió |
| `packages/shared-types/src/socket.types.ts` | Contracte tipat dels events |
| `apps/frontend/src/stores/socketStore.ts` | Connexió i emit des del frontend |
| `apps/frontend/src/composables/useSocket.ts` | Listeners i actualització de stores Pinia |
