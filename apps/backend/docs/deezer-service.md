# Deezer Service — Documentació

**Fitxer:** `src/services/deezerService.ts`  
**Responsabilitat:** Obtenir previews de 30 segons de cançons conegudes via l'API pública de Deezer, amb cache a Redis.

---

## Flux general

```
generateGameSongs(total)
        │
        ▼
Redis: existeix "curated-pool"?
  ├─ SÍ  → retorna subconjunt aleatori del pool cached
  └─ NO  → fetchCuratedSong() × N (en paral·lel)
                │
                ▼
        Deezer Search API
        q: track:"títol" artist:"artista"
                │
                ▼
        Filtra: necessita camp preview (URL mp3)
        Guarda cançó individual a Redis (24h)
                │
                ▼
        Agrega resultats vàlids → pool complet
        Guarda pool a Redis (24h)
                │
                ▼
        Retorna `total` cançons aleatòries del pool
```

---

## API de Deezer utilitzada

**Endpoint:** `GET https://api.deezer.com/search`  
**Autenticació:** Cap. API pública, sense clau.  
**Límit:** ~50 req/seg per IP (suficient per ús normal).

### Query de cerca per cançó curada

```
q=track:"Hey Jude" artist:"The Beatles"&limit=5
```

- Es pren el primer resultat que tingui camp `preview` (URL mp3 de 30s).
- Si cap resultat té preview, la cançó s'ignora (`null`).
- Timeout per petició: **8 segons**.

### Resposta rellevant

```jsonc
{
  "data": [
    {
      "id": 12345,
      "title": "Hey Jude",
      "preview": "https://cdns-preview-X.dzcdn.net/stream/...mp3",
      "artist": { "name": "The Beatles" },
      "album": {
        "cover_xl": "https://e-cdns-images.dzcdn.net/images/cover/.../1000x1000.jpg"
      },
      "release_date": "1968-08-26"
    }
  ]
}
```

---

## Estratègia de cache (Redis)

| Clau Redis | Contingut | TTL |
|---|---|---|
| `curated:<slug-titol>:<slug-artista>` | Objecte `Song` individual | 24h |
| `curated-pool:<total>` | Array de `Song[]` (pool complet) | 24h |

**Primer arrencada** (~30–60s): totes les peticions a Deezer es fan en paral·lel.  
**Arrencades posteriors** (<1ms): tot prové de Redis.

> ⚠️ Per forçar una recàrrega de la llista (per afegir cançons noves), elimina les claus `curated-*` a Redis amb:
> ```bash
> redis-cli KEYS "curated*" | xargs redis-cli DEL
> # Upstash: usa la consola web → Data Browser → Delete by prefix
> ```

---

## Llista curada — Resum per dècada

70 cançons icòniques distribuïdes de la dècada dels 50 als 2020s:

| Dècada | Núm. cançons | Exemples |
|--------|-------------|----------|
| 50–60s | 8  | Hey Jude, Respect, Good Vibrations, Johnny B. Goode |
| 70s    | 9  | Bohemian Rhapsody, Hotel California, Dancing Queen, Stayin' Alive |
| 80s    | 11 | Billie Jean, Sweet Child O' Mine, Take On Me, Livin' on a Prayer |
| 90s    | 10 | Smells Like Teen Spirit, Wonderwall, Wannabe, Baby One More Time |
| 2000s  | 10 | Crazy in Love, Lose Yourself, Rehab, Mr Brightside |
| 2010s  | 12 | Rolling in the Deep, Shape of You, Uptown Funk, Shallow |
| 2020s  | 8  | Blinding Lights, As It Was, Anti-Hero, Flowers |

---

## Tipus exportats

```typescript
// packages/shared-types/src/game.types.ts
interface Song {
  id: string            // String(deezerTrackId) o ID local
  deezerTrackId: number // ID únic de Deezer (o ID de fallback)
  title: string
  artist: string
  year: number          // Any REAL de llançament (de CURATED_SONGS, no de Deezer)
  previewUrl: string    // URL mp3 de 30s de Deezer CDN
  coverUrl: string      // URL portada (1000×1000 si disponible)
}
```

> **Important:** L'any (`year`) sempre prové de `CURATED_SONGS` (valor manual verificat), **no** del camp `release_date` de Deezer, que pot ser incorrecte (reedicions, compilacions, etc.).

---

## Funció principal

### `deezerService.generateGameSongs(total?: number): Promise<Song[]>`

| Paràmetre | Tipus | Default | Descripció |
|---|---|---|---|
| `total` | `number` | `10` | Nombre de cançons a retornar per partida |

**Retorna:** Array de `Song` barrejat aleatòriament.  
**Llança error** si cap cançó de la llista curada retorna preview (Deezer caigut i cache buida).

---

## Funció interna

### `fetchCuratedSong(entry): Promise<Song | null>`

- Comprova cache Redis primer.
- Si no, cerca a Deezer per `track:` + `artist:`.
- Retorna `null` si no troba preview (cançó ignorada silenciosament).
- Guarda a Redis amb TTL 24h si té èxit.

---

## Endpoint de test

```
GET /api/deezer/sample
```

Retorna 10 cançons aleatòries del pool (útil per verificar que el servei funciona).

**Exemple de crida:**
```bash
curl http://localhost:4000/api/deezer/sample
```

**Resposta esperada:**
```jsonc
[
  {
    "id": "123456",
    "deezerTrackId": 123456,
    "title": "Bohemian Rhapsody",
    "artist": "Queen",
    "year": 1975,
    "previewUrl": "https://cdns-preview-X.dzcdn.net/stream/...mp3",
    "coverUrl": "https://e-cdns-images.dzcdn.net/images/cover/.../1000x1000.jpg"
  },
  ...
]
```

---

## Logs de diagnòstic

En la primera arrencada sense cache, el backend mostra:

```
[deezer] fetchant 70 cançons curades...
[deezer] 63/70 cançons obtingudes amb preview
```

Si el nombre de cançons obtingudes és 0, revisar:
- Connexió a internet del servidor.
- Que Deezer no hagi bloquejat la IP (poc probable, API pública).
- Que Redis estigui actiu i accessible.

---

## Manteniment — Afegir noves cançons

1. Afegir entrada a `CURATED_SONGS` a `deezerService.ts`:
   ```typescript
   { title: 'Espresso', artist: 'Sabrina Carpenter', year: 2024 },
   ```
2. Invalidar cache a Redis (vegeu secció cache).
3. Reiniciar backend — es tornarà a fer fetch de totes les cançons.

---

## Limitacions conegudes

| Limitació | Causa | Solució |
|---|---|---|
| Algunes cançons no tenen preview | Deezer no sempre té drets per tots els mercats | S'ignoren silenciosament |
| Pool buit en primera arrencada lenta | N peticions en paral·lel (~30-60s) | Esperar; un cop cached és instant |
| Preview de 30s (no cançó completa) | Limitació de l'API pública de Deezer | Acceptable per al joc; preview és suficient |
| Deezer API fora de servei | Infraestructura externa | Si cache Redis vàlida, no afecta; si no, el joc llança error |
