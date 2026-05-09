import axios from 'axios'
import type { Song } from '@yearbeat/shared-types'
import { cacheService } from './cacheService'

interface DeezerTrack {
  id: number
  title: string
  preview: string
  artist?: { name: string }
  album?: { cover_xl?: string; cover_big?: string }
  release_date?: string
}

interface DeezerSearchResponse {
  data?: DeezerTrack[]
}

const API_URL = 'https://api.deezer.com/search'
const PREVIEW_TTL = 60 * 30 // 30 minuts — els tokens de Deezer CDN expiren en ~1h
const DEEZER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
}

// Llista curada de cançons conegudes per dècada
// Busquem cada cançó per nom+artista a Deezer → 30s preview garantit
const CURATED_SONGS: { title: string; artist: string; year: number }[] = [
  // --- 60s ---
  { title: 'Hey Jude',                 artist: 'The Beatles',      year: 1968 },
  { title: 'Let It Be',                artist: 'The Beatles',      year: 1970 },
  { title: 'Yesterday',                artist: 'The Beatles',      year: 1965 },
  { title: 'Paint It Black',           artist: 'Rolling Stones',   year: 1966 },
  { title: 'Respect',                  artist: 'Aretha Franklin',  year: 1967 },
  { title: 'Good Vibrations',          artist: 'The Beach Boys',   year: 1966 },
  { title: 'Johnny B. Goode',          artist: 'Chuck Berry',      year: 1958 },
  { title: 'What a Wonderful World',   artist: 'Louis Armstrong',  year: 1967 },
  // --- 70s ---
  { title: 'Bohemian Rhapsody',        artist: 'Queen',            year: 1975 },
  { title: 'Hotel California',         artist: 'Eagles',           year: 1977 },
  { title: 'Dancing Queen',            artist: 'ABBA',             year: 1976 },
  { title: 'Stayin Alive',             artist: 'Bee Gees',         year: 1977 },
  { title: 'We Will Rock You',         artist: 'Queen',            year: 1977 },
  { title: 'Roxanne',                  artist: 'The Police',       year: 1978 },
  { title: 'September',               artist: 'Earth Wind Fire',  year: 1978 },
  { title: 'Go Your Own Way',          artist: 'Fleetwood Mac',    year: 1977 },
  { title: 'Dream On',                 artist: 'Aerosmith',        year: 1973 },
  // --- 80s ---
  { title: 'Billie Jean',              artist: 'Michael Jackson',  year: 1983 },
  { title: 'Like a Prayer',            artist: 'Madonna',          year: 1989 },
  { title: 'Sweet Child O Mine',       artist: "Guns N' Roses",    year: 1987 },
  { title: 'Every Breath You Take',    artist: 'The Police',       year: 1983 },
  { title: 'Take On Me',               artist: 'a-ha',             year: 1985 },
  { title: 'Africa',                   artist: 'Toto',             year: 1982 },
  { title: 'Girls Just Want to Have Fun', artist: 'Cyndi Lauper',  year: 1983 },
  { title: 'When Doves Cry',           artist: 'Prince',           year: 1984 },
  { title: 'Livin on a Prayer',        artist: 'Bon Jovi',         year: 1986 },
  { title: 'Come On Eileen',           artist: 'Dexys Midnight Runners', year: 1982 },
  { title: 'Don\'t You Forget About Me', artist: 'Simple Minds',   year: 1985 },
  // --- 90s ---
  { title: 'Smells Like Teen Spirit',  artist: 'Nirvana',          year: 1991 },
  { title: 'Wonderwall',               artist: 'Oasis',            year: 1995 },
  { title: 'Wannabe',                  artist: 'Spice Girls',      year: 1996 },
  { title: 'Losing My Religion',       artist: 'R.E.M.',           year: 1991 },
  { title: 'Baby One More Time',       artist: 'Britney Spears',   year: 1998 },
  { title: 'No Scrubs',                artist: 'TLC',              year: 1999 },
  { title: 'Creep',                    artist: 'Radiohead',        year: 1992 },
  { title: 'Everybody',               artist: 'Backstreet Boys',  year: 1999 },
  { title: 'I Will Always Love You',   artist: 'Whitney Houston',  year: 1992 },
  { title: 'Under the Bridge',         artist: 'Red Hot Chili Peppers', year: 1992 },
  // --- 2000s ---
  { title: 'Crazy in Love',            artist: 'Beyonce',          year: 2003 },
  { title: 'Lose Yourself',            artist: 'Eminem',           year: 2002 },
  { title: 'In Da Club',               artist: '50 Cent',          year: 2003 },
  { title: 'Beautiful Day',            artist: 'U2',               year: 2000 },
  { title: 'Rehab',                    artist: 'Amy Winehouse',    year: 2006 },
  { title: 'Hey Ya',                   artist: 'OutKast',          year: 2003 },
  { title: 'Since U Been Gone',        artist: 'Kelly Clarkson',   year: 2004 },
  { title: 'Hips Don\'t Lie',          artist: 'Shakira',          year: 2006 },
  { title: 'B.O.B.',                   artist: 'OutKast',          year: 2000 },
  { title: 'Mr Brightside',            artist: 'The Killers',      year: 2003 },
  // --- 2010s ---
  { title: 'Rolling in the Deep',      artist: 'Adele',            year: 2010 },
  { title: 'Shape of You',             artist: 'Ed Sheeran',       year: 2017 },
  { title: 'Uptown Funk',              artist: 'Mark Ronson',      year: 2014 },
  { title: 'Happy',                    artist: 'Pharrell Williams', year: 2013 },
  { title: 'Blurred Lines',            artist: 'Robin Thicke',     year: 2013 },
  { title: 'Thinking Out Loud',        artist: 'Ed Sheeran',       year: 2014 },
  { title: 'Shallow',                  artist: 'Lady Gaga',        year: 2018 },
  { title: 'Old Town Road',            artist: 'Lil Nas X',        year: 2019 },
  { title: 'God\'s Plan',              artist: 'Drake',            year: 2018 },
  { title: 'Someone Like You',         artist: 'Adele',            year: 2011 },
  { title: 'Royals',                   artist: 'Lorde',            year: 2013 },
  { title: 'Chandelier',               artist: 'Sia',              year: 2014 },
  // --- 2020s ---
  { title: 'Blinding Lights',          artist: 'The Weeknd',       year: 2019 },
  { title: 'drivers license',          artist: 'Olivia Rodrigo',   year: 2021 },
  { title: 'Levitating',               artist: 'Dua Lipa',         year: 2020 },
  { title: 'As It Was',                artist: 'Harry Styles',     year: 2022 },
  { title: 'Anti-Hero',                artist: 'Taylor Swift',     year: 2022 },
  { title: 'Heat Waves',               artist: 'Glass Animals',    year: 2020 },
  { title: 'Stay',                     artist: 'Kid LAROI',        year: 2021 },
  { title: 'Flowers',                  artist: 'Miley Cyrus',      year: 2023 },
]

async function fetchCuratedSong(entry: { title: string; artist: string; year: number }): Promise<Song | null> {
  const cacheKey = `curated-v2:${entry.title.toLowerCase().replace(/\s+/g, '-')}:${entry.artist.toLowerCase().replace(/\s+/g, '-')}`
  const cached = await cacheService.get<Song>(cacheKey)
  if (cached) return cached

  try {
    const { data } = await axios.get<DeezerSearchResponse>(API_URL, {
      params: { q: `track:"${entry.title}" artist:"${entry.artist}"`, limit: 5 },
      headers: DEEZER_HEADERS,
      timeout: 8000,
    })

    if (!data?.data) {
      console.warn(`[deezer] resposta sense data per: ${entry.title} - ${entry.artist}`)
      return null
    }

    const track = data.data.find((t) => t.preview)
    if (!track) return null

    const song: Song = {
      id: String(track.id),
      deezerTrackId: track.id,
      title: entry.title,
      artist: entry.artist,
      year: entry.year,
      previewUrl: track.preview.replace(/^http:\/\//, 'https://'),
      coverUrl: track.album?.cover_xl || track.album?.cover_big || '',
    }

    await cacheService.set(cacheKey, song, PREVIEW_TTL)
    return song
  } catch (err) {
    console.warn(`[deezer] error fetchant "${entry.title}":`, err instanceof Error ? err.message : err)
    return null
  }
}

export const deezerService = {
  async generateGameSongs(total = 10): Promise<Song[]> {    const cacheKey = `curated-pool-v2:${total}`
    const cached = await cacheService.get<Song[]>(cacheKey)
    if (cached) {
      // retorna un subconjunt aleatori diferent cada cop
      return [...cached].sort(() => Math.random() - 0.5).slice(0, total)
    }

    // Barreja la llista i intenta obtenir el màxim de cançons possibles
    const shuffled = [...CURATED_SONGS].sort(() => Math.random() - 0.5)

    console.log(`[deezer] fetchant ${shuffled.length} cançons curades en lots...`)
    const valid: Song[] = []
    const BATCH = 5
    for (let i = 0; i < shuffled.length; i += BATCH) {
      const batch = shuffled.slice(i, i + BATCH)
      const results = await Promise.all(batch.map(fetchCuratedSong))
      valid.push(...(results.filter(Boolean) as Song[]))
      if (i + BATCH < shuffled.length) await new Promise((r) => setTimeout(r, 300))
    }

    console.log(`[deezer] ${valid.length}/${shuffled.length} cançons obtingudes amb preview`)

    if (valid.length === 0) throw new Error('No s\'han pogut carregar cançons de Deezer')

    // Guarda el pool complet en cache 30 minuts
    await cacheService.set(cacheKey, valid, PREVIEW_TTL)

    return [...valid].sort(() => Math.random() - 0.5).slice(0, total)
  },

  async fetchFreshPreviewUrl(deezerTrackId: number): Promise<string | null> {
    try {
      const { data } = await axios.get<DeezerSearchResponse>(`https://api.deezer.com/track/${deezerTrackId}`, {
        timeout: 6000,
      })
      const track = data as unknown as DeezerTrack
      if (track?.preview) {
        return track.preview.replace(/^http:\/\//, 'https://')
      }
    } catch { /* silenci */ }
    return null
  },
}
