<template>
  <div class="discussion-thread" v-if="post">
    <!-- Back button -->
    <button class="btn btn-outline btn-sm back-btn" @click="$emit('back')">
      ← 返回列表
    </button>

    <!-- Post detail -->
    <div class="thread-post">
      <div class="thread-header">
        <h2>{{ post.title }}</h2>
        <PostActions
          v-if="perms.canDeletePost(currentUser, post) || perms.canPinPost(currentUser) || perms.canMarkAnswer(currentUser)"
          :can-delete="perms.canDeletePost(currentUser, post)"
          :can-pin="perms.canPinPost(currentUser)"
          :can-mark-answer="perms.canMarkAnswer(currentUser)"
          :is-pinned="post.isPinned"
          :is-answer="post.isAnswer"
          @delete="$emit('delete-post', post.id)"
          @pin="(val: boolean) => $emit('pin-post', post.id, val)"
          @mark-answer="(val: boolean) => $emit('mark-answer-post', post.id, val)"
        />
      </div>
      <div class="thread-author">
        <span class="author-name">{{ post.authorName }}</span>
        <span class="thread-time">{{ formatDate(post.createdAt) }}</span>
        <span v-if="post.updatedAt !== post.createdAt" class="edited-tag">（已编辑）</span>
      </div>
      <div class="thread-content">{{ post.content }}</div>
    </div>

    <!-- Replies -->
    <div class="thread-replies">
      <h3>回复 ({{ replies.length }})</h3>
      <div v-if="replies.length === 0" class="no-replies">
        暂无回复
      </div>
      <div v-else>
        <ReplyItem
          v-for="reply in topLevelReplies"
          :key="reply.id"
          :reply="reply"
          :depth="0"
          :can-manage="perms.canManageDiscussion(currentUser)"
          :current-user-id="currentUser?.id ?? ''"
          @delete-reply="(id: string) => $emit('delete-reply', id)"
          @mark-answer="(id: string, val: boolean) => $emit('mark-answer-reply', id, val)"
          @reply-added="$emit('refresh')"
        />
      </div>
    </div>

    <!-- Reply editor -->
    <div class="reply-editor-section">
      <PostEditor
        :show-title="false"
        placeholder="写下你的回复..."
        submit-label="发布回复"
        @submit="onReplySubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Post, Reply, User } from '@/types'
import { usePermission } from '@/composables/usePermission'
import PostActions from './PostActions.vue'
import ReplyItem from './ReplyItem.vue'
import PostEditor from './PostEditor.vue'

const props = defineProps<{
  post: Post | null
  replies: Reply[]
  currentUser: User | null
}>()

const emit = defineEmits<{
  back: []
  'delete-post': [postId: string]
  'pin-post': [postId: string, pinned: boolean]
  'mark-answer-post': [postId: string, isAnswer: boolean]
  'delete-reply': [replyId: string]
  'mark-answer-reply': [replyId: string, isAnswer: boolean]
  'reply-submit': [data: { content: string; parentReplyId?: string | null }]
  refresh: []
}>()

const perms = usePermission()

const topLevelReplies = computed(() => {
  return props.replies.filter((r) => !r.parentReplyId)
})

function onReplySubmit(data: { title: string; content: string }) {
  emit('reply-submit', { content: data.content })
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}
</script>

<style scoped>
.discussion-thread {
  background-color: var(--color-bg-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 20px;
}

.back-btn {
  margin-bottom: 16px;
}

.thread-post {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 20px;
}

.thread-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.thread-header h2 {
  font-size: 20px;
}

.thread-author {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.author-name {
  font-weight: 500;
  margin-right: 8px;
}

.thread-time {
  color: var(--color-text-muted);
}

.edited-tag {
  color: var(--color-text-muted);
  font-size: 12px;
}

.thread-content {
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.thread-replies {
  margin-bottom: 24px;
}

.thread-replies h3 {
  font-size: 16px;
  margin-bottom: 12px;
}

.no-replies {
  padding: 20px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 13px;
}

.reply-editor-section {
  border-top: 1px solid var(--color-border-light);
  padding-top: 20px;
}
</style>
