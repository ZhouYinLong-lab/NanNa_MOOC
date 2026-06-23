<template>
  <div class="post-card" :class="{ pinned: post.isPinned, answer: post.isAnswer }">
    <div class="post-meta">
      <span v-if="post.isPinned" class="tag tag-pin">📌 置顶</span>
      <span v-if="post.isAnswer" class="tag tag-answer">✅ 答案</span>
    </div>
    <h4 class="post-title">
      <a @click="$emit('click', post.id)">{{ post.title }}</a>
    </h4>
    <p class="post-excerpt">{{ post.content.slice(0, 150) }}{{ post.content.length > 150 ? '...' : '' }}</p>
    <div class="post-footer">
      <div class="post-author">
        <span class="author-name">{{ post.authorName }}</span>
        <span class="post-time">{{ formatDate(post.createdAt) }}</span>
      </div>
      <div class="post-stats">
        <span>💬 {{ post.replyCount }}</span>
        <span>👁 {{ post.viewCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types'

defineProps<{
  post: Post
}>()

defineEmits<{
  click: [postId: string]
}>()

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
.post-card {
  padding: 16px;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background-color 0.15s;
}
.post-card:hover {
  background-color: var(--color-bg);
}
.post-card.pinned {
  background-color: #fef7e0;
}
.post-card.answer {
  border-left: 3px solid var(--color-success);
}

.post-meta {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.tag {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 8px;
}
.tag-pin {
  background-color: #fef7e0;
  color: #ea8600;
}
.tag-answer {
  background-color: #e6f4ea;
  color: #137333;
}

.post-title {
  font-size: 15px;
  margin-bottom: 6px;
}

.post-title a {
  color: var(--color-text);
  text-decoration: none;
}
.post-title a:hover {
  color: var(--color-primary);
}

.post-excerpt {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
  line-height: 1.6;
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-muted);
}

.post-author {
  display: flex;
  gap: 8px;
}

.author-name {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.post-stats {
  display: flex;
  gap: 12px;
}
</style>
