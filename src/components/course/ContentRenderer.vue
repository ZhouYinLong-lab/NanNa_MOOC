<template>
  <div class="content-renderer">
    <!-- Markdown / Text / LaTeX -->
    <MarkdownViewer
      v-if="resource.contentType === 'markdown' || resource.contentType === 'text' || resource.contentType === 'latex'"
      :content="resource.content || ''"
    />

    <!-- Video -->
    <VideoPlayer
      v-else-if="resource.contentType === 'video'"
      :src="mediaUrl"
      :title="resource.mediaMeta?.mimeType ?? ''"
    />

    <!-- Audio -->
    <AudioPlayer
      v-else-if="resource.contentType === 'audio'"
      :src="mediaUrl"
      :title="resource.mediaMeta?.mimeType ?? ''"
    />

    <!-- Image -->
    <ImageViewer
      v-else-if="resource.contentType === 'image'"
      :src="mediaUrl"
      :alt="resource.mediaMeta?.mimeType ?? '图片'"
    />

    <!-- Attachment -->
    <AttachmentLink
      v-else-if="resource.contentType === 'attachment'"
      :url="mediaUrl"
      :fileName="resource.mediaMeta?.mimeType ?? '附件'"
      :fileSize="resource.mediaMeta?.fileSize"
    />

    <!-- Fallback -->
    <div v-else class="unsupported">
      <p>不支持的内容类型：{{ resource.contentType }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ContentResource } from '@/types'
import MarkdownViewer from '@/components/media/MarkdownViewer.vue'
import VideoPlayer from '@/components/media/VideoPlayer.vue'
import AudioPlayer from '@/components/media/AudioPlayer.vue'
import ImageViewer from '@/components/media/ImageViewer.vue'
import AttachmentLink from '@/components/media/AttachmentLink.vue'

const props = defineProps<{
  resource: ContentResource
}>()

const mediaUrl = computed(() => {
  if (!props.resource.mediaUrl) return ''
  if (props.resource.mediaUrl.startsWith('http')) return props.resource.mediaUrl
  return `/api/media/${props.resource.mediaUrl}`
})
</script>

<style scoped>
.content-renderer {
  width: 100%;
}

.unsupported {
  padding: 40px;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
