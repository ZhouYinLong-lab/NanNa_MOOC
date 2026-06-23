<template>
  <div class="audio-player">
    <audio ref="audioRef" :src="src" preload="metadata"></audio>

    <div class="audio-controls">
      <button class="ctrl-btn play-btn" @click="togglePlay">
        {{ isPlaying ? '⏸' : '▶' }}
      </button>

      <div class="audio-progress" @mousedown="onProgressDragStart" ref="progressRef">
        <div class="audio-progress-current" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <span class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>

      <button class="ctrl-btn" @click="toggleMute">
        {{ isMuted || volume === 0 ? '🔇' : '🔊' }}
      </button>

      <input
        type="range"
        class="volume-slider"
        min="0"
        max="1"
        step="0.05"
        :value="isMuted ? 0 : volume"
        @input="onVolumeChange"
      />

      <div class="speed-menu" ref="speedRef">
        <button class="ctrl-btn" @click="showSpeedMenu = !showSpeedMenu">{{ playbackRate }}x</button>
        <div v-if="showSpeedMenu" class="speed-options">
          <button
            v-for="rate in [0.5, 0.75, 1, 1.25, 1.5, 2]"
            :key="rate"
            class="speed-option"
            :class="{ active: playbackRate === rate }"
            @click="setPlaybackRate(rate); showSpeedMenu = false"
          >
            {{ rate }}x
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMediaPlayer } from '@/composables/useMediaPlayer'

defineProps<{
  src: string
  title?: string
}>()

const {
  isPlaying, currentTime, duration, volume, isMuted,
  playbackRate, bindMedia, togglePlay, seek, setVolume,
  toggleMute, setPlaybackRate, formatTime,
} = useMediaPlayer()

const audioRef = ref<HTMLAudioElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const showSpeedMenu = ref(false)

const progressPercent = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

function onVolumeChange(e: Event) {
  const target = e.target as HTMLInputElement
  setVolume(parseFloat(target.value))
}

function onProgressDragStart(e: MouseEvent) {
  const rect = progressRef.value?.getBoundingClientRect()
  if (!rect) return
  const x = e.clientX - rect.left
  seek(Math.max(0, Math.min(1, x / rect.width)) * duration.value)

  const onMove = (ev: MouseEvent) => {
    const r = progressRef.value?.getBoundingClientRect()
    if (!r) return
    seek(Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * duration.value)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', onMove)
  }, { once: true })
}

onMounted(() => {
  if (audioRef.value) bindMedia(audioRef.value)
})
</script>

<style scoped>
.audio-player {
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 16px;
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ctrl-btn {
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  transition: background-color 0.15s;
}
.ctrl-btn:hover {
  background-color: var(--color-bg-hover);
}

.play-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: #fff;
  font-size: 18px;
  flex-shrink: 0;
}
.play-btn:hover {
  background-color: var(--color-primary-hover);
}

.audio-progress {
  flex: 1;
  height: 4px;
  background-color: var(--color-border);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}
.audio-progress:hover {
  height: 6px;
}

.audio-progress-current {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: 2px;
  transition: width 0.25s linear;
}

.time-display {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
  min-width: 85px;
  flex-shrink: 0;
}

.volume-slider {
  width: 60px;
  height: 3px;
  accent-color: var(--color-primary);
}

.speed-menu {
  position: relative;
}

.speed-options {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  background-color: var(--color-bg-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  padding: 4px 0;
  min-width: 60px;
}

.speed-option {
  display: block;
  width: 100%;
  text-align: center;
  padding: 6px 12px;
  font-size: 13px;
  color: var(--color-text);
}
.speed-option:hover {
  background-color: var(--color-bg-hover);
}
.speed-option.active {
  color: var(--color-primary);
}
</style>
