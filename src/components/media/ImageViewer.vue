<template>
  <div class="image-viewer">
    <div class="image-container" @click="toggleZoom" :class="{ zoomed: isZoomed }">
      <img :src="src" :alt="alt" @error="onError" @load="onLoad" />
    </div>
    <div class="image-toolbar" v-if="!hasError">
      <button class="btn btn-outline btn-sm" @click="toggleZoom">
        {{ isZoomed ? '缩小' : '放大' }}
      </button>
      <a :href="src" target="_blank" class="btn btn-outline btn-sm" download>
        下载原图
      </a>
    </div>
    <div v-if="hasError" class="image-error">
      <p>图片加载失败</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  src: string
  alt?: string
}>()

const isZoomed = ref(false)
const hasError = ref(false)

function toggleZoom() {
  isZoomed.value = !isZoomed.value
}

function onError() {
  hasError.value = true
}

function onLoad() {
  hasError.value = false
}
</script>

<style scoped>
.image-viewer {
  text-align: center;
}

.image-container {
  display: inline-block;
  cursor: zoom-in;
}

.image-container img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: var(--radius-sm);
  transition: transform 0.2s;
}

.image-container.zoomed {
  cursor: zoom-out;
}

.image-container.zoomed img {
  max-height: none;
  transform: scale(1.5);
}

.image-toolbar {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.image-error {
  padding: 40px;
  color: var(--color-text-muted);
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
}
</style>
