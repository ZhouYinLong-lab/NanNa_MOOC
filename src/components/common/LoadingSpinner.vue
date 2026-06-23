<template>
  <div class="loading-container" :class="{ inline }">
    <span class="spinner" :style="{ width: size + 'px', height: size + 'px' }"></span>
    <span v-if="text" class="loading-text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  text?: string
  size?: number
  inline?: boolean
}>(), {
  size: 24,
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
}

.loading-container.inline {
  flex-direction: row;
  padding: 8px;
}

.loading-text {
  font-size: 13px;
  color: var(--color-text-muted);
}

.spinner {
  border: 3px solid var(--color-border-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
