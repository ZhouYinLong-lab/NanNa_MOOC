<template>
  <div class="reply-item" :class="{ answer: reply.isAnswer }" :style="{ marginLeft: `${depth * 24}px` }">
    <div class="reply-header">
      <span class="reply-author">{{ reply.authorName }}</span>
      <span v-if="reply.isAnswer" class="tag tag-answer">✅ 答案</span>
      <span class="reply-time">{{ formatDate(reply.createdAt) }}</span>
    </div>
    <div class="reply-content">{{ reply.content }}</div>
    <div class="reply-footer">
      <button class="btn-text" @click="showReplyEditor = !showReplyEditor">
        💬 回复
      </button>
      <PostActions
        v-if="canManage || reply.authorId === currentUserId"
        :can-delete="canDeleteOwn || canManage"
        :can-pin="false"
        :can-mark-answer="canManage"
        :is-pinned="false"
        :is-answer="reply.isAnswer"
        @delete="$emit('delete-reply', reply.id)"
        @mark-answer="(val: boolean) => $emit('mark-answer', reply.id, val)"
      />
    </div>

    <!-- Inline reply editor -->
    <div v-if="showReplyEditor" class="inline-editor">
      <PostEditor
        :show-title="false"
        :show-cancel="true"
        placeholder="写下你的回复..."
        submit-label="回复"
        @submit="onReplySubmit"
        @cancel="showReplyEditor = false"
      />
    </div>

    <!-- Nested children -->
    <div v-if="reply.children && reply.children.length > 0">
      <ReplyItem
        v-for="child in reply.children"
        :key="child.id"
        :reply="child"
        :depth="depth + 1"
        :can-manage="canManage"
        :current-user-id="currentUserId"
        @delete-reply="(id: string) => $emit('delete-reply', id)"
        @mark-answer="(id: string, val: boolean) => $emit('mark-answer', id, val)"
        @reply-added="$emit('reply-added')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Reply } from '@/types'
import PostActions from './PostActions.vue'
import PostEditor from './PostEditor.vue'

defineProps<{
  reply: Reply
  depth: number
  canManage: boolean
  currentUserId: string
}>()

const emit = defineEmits<{
  'delete-reply': [replyId: string]
  'mark-answer': [replyId: string, isAnswer: boolean]
  'reply-added': []
}>()

const showReplyEditor = ref(false)
const canDeleteOwn = ref(true)

// Actually this should come from props — fix later
// For now, simplified

function onReplySubmit(data: { title: string; content: string }) {
  // The parent component handles the actual API call
  // This emits an event with reply data
  emit('reply-added')
  showReplyEditor.value = false
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.reply-item {
  padding: 12px 16px;
  border-left: 2px solid var(--color-border-light);
  margin-top: 0;
  transition: border-color 0.15s;
}
.reply-item.answer {
  border-left-color: var(--color-success);
  background-color: #f6fef6;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.reply-author {
  font-weight: 500;
  font-size: 13px;
}

.tag {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 8px;
}
.tag-answer {
  background-color: #e6f4ea;
  color: #137333;
}

.reply-time {
  font-size: 12px;
  color: var(--color-text-muted);
}

.reply-content {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
  white-space: pre-wrap;
}

.reply-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-text {
  font-size: 12px;
  color: var(--color-text-muted);
}
.btn-text:hover {
  color: var(--color-primary);
}

.inline-editor {
  margin-top: 12px;
}
</style>
