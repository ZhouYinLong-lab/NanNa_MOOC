<template>
  <div class="discussion-list">
    <div v-if="posts.length === 0 && !loading" class="empty-state">
      <p>暂无讨论帖</p>
      <p class="empty-hint">成为第一个发帖的人吧</p>
    </div>

    <!-- Pinned posts first -->
    <template v-for="post in sortedPosts" :key="post.id">
      <PostCard :post="post" @click="(id: string) => $emit('view-post', id)" />
    </template>

    <div v-if="loading" class="loading-container">
      <span class="spinner"></span>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        class="btn btn-outline btn-sm"
        :disabled="currentPage <= 1"
        @click="$emit('page-change', currentPage - 1)"
      >
        上一页
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        class="btn btn-outline btn-sm"
        :disabled="currentPage >= totalPages"
        @click="$emit('page-change', currentPage + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/types'
import PostCard from './PostCard.vue'

const props = defineProps<{
  posts: Post[]
  loading: boolean
  currentPage: number
  totalPages: number
}>()

defineEmits<{
  'view-post': [postId: string]
  'page-change': [page: number]
}>()

const sortedPosts = computed(() => {
  return [...props.posts].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})
</script>

<style scoped>
.discussion-list {
  background-color: var(--color-bg-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-muted);
}

.empty-hint {
  font-size: 13px;
  margin-top: 4px;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--color-border-light);
}

.page-info {
  font-size: 13px;
  color: var(--color-text-secondary);
}
</style>
