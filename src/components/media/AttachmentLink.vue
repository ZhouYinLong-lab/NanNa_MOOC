<template>
  <div class="attachment-link">
    <div class="attachment-card">
      <span class="attachment-icon">{{ fileIcon }}</span>
      <div class="attachment-info">
        <span class="attachment-name">{{ displayName }}</span>
        <span v-if="formattedSize" class="attachment-size">{{ formattedSize }}</span>
      </div>
      <a :href="url" class="btn btn-primary btn-sm" :download="fileName" target="_blank">
        下载
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useContentRenderer } from '@/composables/useContentRenderer'

const props = defineProps<{
  url: string
  fileName?: string
  fileSize?: number
}>()

const { getFileIcon } = useContentRenderer()

const displayName = computed(() => props.fileName || props.url.split('/').pop() || '附件')
const fileIcon = computed(() => getFileIcon(props.fileName))

const formattedSize = computed(() => {
  if (!props.fileSize) return ''
  if (props.fileSize < 1024) return `${props.fileSize} B`
  if (props.fileSize < 1024 * 1024) return `${(props.fileSize / 1024).toFixed(1)} KB`
  return `${(props.fileSize / (1024 * 1024)).toFixed(1)} MB`
})
</script>

<style scoped>
.attachment-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  max-width: 400px;
}

.attachment-icon {
  font-size: 24px;
}

.attachment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.attachment-name {
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-size {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
