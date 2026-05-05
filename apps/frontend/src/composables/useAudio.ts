import { ref, watch } from 'vue'
import { Howl, Howler } from 'howler'

export function useAudio(urlRef: () => string | undefined) {
  const playing = ref(false)
  const error = ref<string | null>(null)
  let sound: Howl | null = null
  let cancelled = false

  function load(url: string, attempt = 0) {
    if (cancelled) return

    sound?.unload()
    sound = new Howl({
      src: [url],
      format: ['mp3'],
      html5: true,
      volume: 1,
      onplay: () => {
        playing.value = true
        error.value = null
      },
      onend: () => {
        playing.value = false
      },
      onstop: () => {
        playing.value = false
      },
      onloaderror: (_id, err) => {
        if (attempt < 1) {
          // Retry once after a short delay (handles transient CDN failures)
          console.warn('[Audio] Error carregant, reintentant en 2s...', url)
          setTimeout(() => load(url, attempt + 1), 2000)
        } else {
          // Fail silently so gameplay continues without audio
          console.error('[Audio] Error carregant (intent final):', url, err)
          playing.value = false
        }
      },
      onplayerror: (_id, _err) => {
        // Desbloqueja l'AudioContext bloquejat per Chrome (autoplay policy)
        Howler.ctx?.resume().then(() => {
          sound?.play()
        })
      },
    })
    sound.play()
  }

  watch(
    () => urlRef(),
    (url) => {
      cancelled = true
      sound?.stop()
      sound?.unload()
      sound = null
      error.value = null
      cancelled = false

      if (!url) return
      load(url)
    },
    { immediate: true },
  )

  return { playing, error }
}
