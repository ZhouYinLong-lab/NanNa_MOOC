<template>
  <div class="video-player" ref="containerRef">
    <video
      ref="videoRef"
      :src="src"
      class="video-element"
      :poster="poster"
      preload="metadata"
      crossorigin="anonymous"
      @click="togglePlay"
      @dblclick="toggleFullscreen(containerRef)"
    ></video>

    <!-- Big play button (when paused) -->
    <div v-if="!isPlaying" class="video-overlay" @click="togglePlay">
      <button class="play-btn-big">▶</button>
    </div>

    <!-- Controls -->
    <div class="video-controls" :class="{ 'controls-visible': showControls }">
      <!-- Progress bar -->
      <div class="progress-bar" @mousedown="onProgressDragStart" ref="progressRef">
        <div class="progress-buffered" :style="{ width: bufferedPercent + '%' }"></div>
        <div class="progress-current" :style="{ width: progressPercent + '%' }"></div>
        <div class="progress-thumb" :style="{ left: progressPercent + '%' }"></div>
      </div>

      <div class="controls-row">
        <div class="controls-left">
          <!-- Play/Pause -->
          <button class="ctrl-btn" @click="togglePlay" :title="isPlaying ? '暂停' : '播放'">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>

          <!-- Time -->
          <span class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>

          <!-- Volume -->
          <button class="ctrl-btn" @click="toggleMute" :title="isMuted ? '取消静音' : '静音'">
            {{ isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊' }}
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
        </div>

        <div class="controls-right">
          <!-- Playback Rate -->
          <div class="speed-menu" ref="speedRef">
            <button class="ctrl-btn" @click="showSpeedMenu = !showSpeedMenu" title="播放速度">
              {{ playbackRate }}x
            </button>
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

          <!-- Settings -->
          <button class="ctrl-btn" @click="showSettingsMenu = !showSettingsMenu" title="设置">
            ⚙️
          </button>

          <!-- Picture-in-Picture -->
          <button v-if="supportsPiP" class="ctrl-btn" @click="togglePiP" title="画中画">
            🖼️
          </button>

          <!-- Fullscreen -->
          <button class="ctrl-btn" @click="toggleFullscreen(containerRef)" title="全屏">
            {{ isFullscreen ? '↙️' : '🗖' }}
          </button>
        </div>
      </div>

      <!-- Settings dropdown -->
      <div v-if="showSettingsMenu" class="settings-dropdown">
        <div class="settings-item">
          <span>播放速度</span>
          <select v-model.number="playbackRate" @change="setPlaybackRate(playbackRate)">
            <option v-for="rate in [0.5, 0.75, 1, 1.25, 1.5, 2]" :key="rate" :value="rate">{{ rate }}x</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useMediaPlayer } from '@/composables/useMediaPlayer'

const props = defineProps<{
  src: string
  poster?: string
  title?: string
}>()

const {
  isPlaying, currentTime, duration, volume, isMuted,
  isFullscreen, playbackRate, buffered,
  bindMedia, togglePlay, seek, setVolume, toggleMute,
  setPlaybackRate, toggleFullscreen, togglePiP, formatTime,
} = useMediaPlayer()

const videoRef = ref<HTMLVideoElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const showControls = ref(true)
const showSpeedMenu = ref(false)
const showSettingsMenu = ref(false)
const supportsPiP = ref(true) // Will be checked on mount
let hideControlsTimer: ReturnType<typeof setTimeout> | null = null

const progressPercent = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const bufferedPercent = computed(() => {
  if (duration.value === 0) return 0
  return (buffered.value / duration.value) * 100
})

function onVolumeChange(e: Event) {
  const target = e.target as HTMLInputElement
  setVolume(parseFloat(target.value))
}

function onProgressDragStart(e: MouseEvent) {
  const rect = progressRef.value?.getBoundingClientRect()
  if (!rect) return
  const x = e.clientX - rect.left
  const percent = Math.max(0, Math.min(1, x / rect.width))
  seek(percent * duration.value)

  const onMove = (ev: MouseEvent) => {
    const r = progressRef.value?.getBoundingClientRect()
    if (!r) return
    const px = ev.clientX - r.left
    const pct = Math.max(0, Math.min(1, px / r.width))
    seek(pct * duration.value)
  }

  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function resetControlsTimer() {
  showControls.value = true
  if (hideControlsTimer) clearTimeout(hideControlsTimer)
  if (isPlaying.value) {
    hideControlsTimer = setTimeout(() => {
      showControls.value = false
    }, 3000)
  }
}

// Click outside to close settings
function handleClickOutside(e: MouseEvent) {
  if (showSettingsMenu.value) {
    showSettingsMenu.value = false
  }
  if (showSpeedMenu.value) {
    showSpeedMenu.value = false
  }
}

watch(isPlaying, () => {
  resetControlsTimer()
})

onMounted(() => {
  if (videoRef.value) {
    bindMedia(videoRef.value)
  }
  supportsPiP.value = 'pictureInPictureEnabled' in document && document.pictureInPictureEnabled
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.video-player {
  position: relative;
  width: 100%;
  max-width: 100%;
  background-color: #000;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.video-element {
  width: 100%;
  display: block;
  cursor: pointer;
}

.video-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.play-btn-big {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
}
.play-btn-big:hover {
  transform: scale(1.1);
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 36px 12px 8px;
  opacity: 0;
  transition: opacity 0.3s;
}
.video-controls.controls-visible,
.video-player:hover .video-controls {
  opacity: 1;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  margin-bottom: 8px;
  transition: height 0.15s;
}
.progress-bar:hover {
  height: 6px;
}

.progress-buffered {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
}

.progress-current {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: var(--color-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.15s;
}
.progress-bar:hover .progress-thumb {
  opacity: 1;
}

.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ctrl-btn {
  color: #fff;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  line-height: 1;
  transition: background-color 0.15s;
}
.ctrl-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.time-display {
  color: #fff;
  font-size: 12px;
  font-family: var(--font-mono);
  min-width: 90px;
}

.volume-slider {
  width: 60px;
  height: 3px;
  accent-color: #fff;
  cursor: pointer;
}

.speed-menu {
  position: relative;
}

.speed-options {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  background: rgba(0, 0, 0, 0.9);
  border-radius: var(--radius-sm);
  padding: 4px 0;
  min-width: 60px;
}

.speed-option {
  display: block;
  width: 100%;
  text-align: center;
  padding: 6px 12px;
  color: #fff;
  font-size: 13px;
  transition: background-color 0.1s;
}
.speed-option:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.speed-option.active {
  color: var(--color-primary);
}

.settings-dropdown {
  position: absolute;
  bottom: 100%;
  right: 40px;
  margin-bottom: 8px;
  background: rgba(0, 0, 0, 0.9);
  border-radius: var(--radius-sm);
  padding: 8px;
  min-width: 160px;
  color: #fff;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
}

.settings-item select {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 4px 8px;
  font-size: 12px;
}
</style>
