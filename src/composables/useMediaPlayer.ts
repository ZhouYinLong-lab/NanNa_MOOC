import { ref, onUnmounted } from 'vue'

export function useMediaPlayer() {
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(1)
  const isMuted = ref(false)
  const isFullscreen = ref(false)
  const isPiP = ref(false)
  const playbackRate = ref(1)
  const buffered = ref(0)

  let mediaElement: HTMLMediaElement | null = null
  let progressInterval: ReturnType<typeof setInterval> | null = null

  function bindMedia(el: HTMLMediaElement) {
    mediaElement = el

    el.addEventListener('loadedmetadata', () => {
      duration.value = el.duration
    })

    el.addEventListener('play', () => {
      isPlaying.value = true
      startProgressTracking()
    })

    el.addEventListener('pause', () => {
      isPlaying.value = false
      stopProgressTracking()
    })

    el.addEventListener('ended', () => {
      isPlaying.value = false
      stopProgressTracking()
    })

    el.addEventListener('volumechange', () => {
      volume.value = el.volume
      isMuted.value = el.muted
    })

    el.addEventListener('ratechange', () => {
      playbackRate.value = el.playbackRate
    })

    el.addEventListener('progress', () => {
      if (el.buffered.length > 0) {
        buffered.value = el.buffered.end(el.buffered.length - 1)
      }
    })
  }

  function startProgressTracking() {
    stopProgressTracking()
    progressInterval = setInterval(() => {
      if (mediaElement) {
        currentTime.value = mediaElement.currentTime
      }
    }, 250)
  }

  function stopProgressTracking() {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
  }

  function togglePlay() {
    if (!mediaElement) return
    if (mediaElement.paused) {
      mediaElement.play()
    } else {
      mediaElement.pause()
    }
  }

  function seek(time: number) {
    if (!mediaElement) return
    mediaElement.currentTime = time
    currentTime.value = time
  }

  function setVolume(vol: number) {
    if (!mediaElement) return
    mediaElement.volume = Math.max(0, Math.min(1, vol))
    mediaElement.muted = vol === 0
  }

  function toggleMute() {
    if (!mediaElement) return
    mediaElement.muted = !mediaElement.muted
  }

  function setPlaybackRate(rate: number) {
    if (!mediaElement) return
    mediaElement.playbackRate = rate
  }

  async function toggleFullscreen(containerEl?: HTMLElement) {
    const el = containerEl ?? mediaElement?.parentElement
    if (!el) return

    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen()
        isFullscreen.value = true
      } else {
        await document.exitFullscreen()
        isFullscreen.value = false
      }
    } catch {
      // Fullscreen may not be supported
    }
  }

  async function togglePiP() {
    if (!mediaElement || !(mediaElement instanceof HTMLVideoElement)) return

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
        isPiP.value = false
      } else {
        await mediaElement.requestPictureInPicture()
        isPiP.value = true
      }
    } catch {
      // PiP may not be supported
    }
  }

  function formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '0:00'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  function unbind() {
    stopProgressTracking()
    mediaElement = null
  }

  onUnmounted(() => {
    unbind()
  })

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    isPiP,
    playbackRate,
    buffered,
    bindMedia,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleFullscreen,
    togglePiP,
    formatTime,
  }
}
