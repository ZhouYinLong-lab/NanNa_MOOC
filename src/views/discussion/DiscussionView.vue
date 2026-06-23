<template>
  <AppLayout>
    <div class="discussion-page" v-if="courseId">
      <div class="page-header">
        <router-link :to="`/courses/${courseId}`" class="btn btn-outline btn-sm">
          ← 返回课程
        </router-link>
        <h2>课程讨论区</h2>
        <span class="text-secondary">{{ courseTitle }}</span>
      </div>

      <div class="discussion-body">
        <!-- Post List View -->
        <div v-if="!currentPostId">
          <div class="new-post-section">
            <PostEditor
              placeholder="分享你的想法、问题或笔记..."
              submit-label="发布帖子"
              @submit="handleCreatePost"
            />
          </div>

          <DiscussionList
            :posts="posts"
            :loading="loading"
            :current-page="currentPage"
            :total-pages="totalPages"
            @view-post="viewPost"
            @page-change="changePage"
          />
        </div>

        <!-- Thread Detail View -->
        <DiscussionThread
          v-else
          :post="currentPost"
          :replies="replies"
          :current-user="authStore.user"
          @back="currentPostId = null"
          @delete-post="handleDeletePost"
          @pin-post="handlePinPost"
          @mark-answer-post="handleMarkAnswerPost"
          @delete-reply="handleDeleteReply"
          @mark-answer-reply="handleMarkAnswerReply"
          @reply-submit="handleCreateReply"
          @refresh="loadPostDetail(currentPostId!)"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import DiscussionList from '@/components/discussion/DiscussionList.vue'
import DiscussionThread from '@/components/discussion/DiscussionThread.vue'
import PostEditor from '@/components/discussion/PostEditor.vue'
import { useAuthStore } from '@/stores/auth'
import { useDiscussionStore } from '@/stores/discussion'
import * as discussionApi from '@/api/discussion'
import * as courseApi from '@/api/course'
import type { Post, Reply } from '@/types'

const route = useRoute()
const authStore = useAuthStore()
const discussionStore = useDiscussionStore()

const courseId = ref(route.params.id as string)
const courseTitle = ref('')
const currentPostId = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = 20

const posts = ref<Post[]>([])
const currentPost = ref<Post | null>(null)
const replies = ref<Reply[]>([])
const loading = ref(false)
const totalPosts = ref(0)
const totalPages = ref(1)

async function loadPosts() {
  loading.value = true
  try {
    const res = await discussionApi.getPosts(courseId.value, currentPage.value, pageSize)
    posts.value = res.data.data.items
    totalPosts.value = res.data.data.total
    totalPages.value = res.data.data.totalPages
  } finally {
    loading.value = false
  }
}

async function loadPostDetail(postId: string) {
  loading.value = true
  try {
    const [postRes, repliesRes] = await Promise.all([
      discussionApi.getPostDetail(postId),
      discussionApi.getReplies(postId),
    ])
    currentPost.value = postRes.data.data
    replies.value = repliesRes.data.data
  } finally {
    loading.value = false
  }
}

function viewPost(postId: string) {
  currentPostId.value = postId
  loadPostDetail(postId)
}

function changePage(page: number) {
  currentPage.value = page
  loadPosts()
}

async function handleCreatePost(data: { title: string; content: string }) {
  try {
    await discussionApi.createPost({ courseId: courseId.value, ...data })
    await loadPosts()
  } catch {
    alert('发帖失败')
  }
}

async function handleDeletePost(postId: string) {
  try {
    await discussionApi.deletePost(postId)
    currentPostId.value = null
    await loadPosts()
  } catch {
    alert('删除失败')
  }
}

async function handlePinPost(postId: string, pinned: boolean) {
  try {
    await discussionApi.pinPost(postId, pinned)
    await loadPostDetail(postId)
  } catch {
    alert('操作失败')
  }
}

async function handleMarkAnswerPost(postId: string, isAnswer: boolean) {
  try {
    await discussionApi.markPostAsAnswer(postId, isAnswer)
    await loadPostDetail(postId)
  } catch {
    alert('操作失败')
  }
}

async function handleDeleteReply(replyId: string) {
  try {
    await discussionApi.deleteReply(replyId)
    await loadPostDetail(currentPostId.value!)
  } catch {
    alert('删除失败')
  }
}

async function handleMarkAnswerReply(replyId: string, isAnswer: boolean) {
  try {
    await discussionApi.markReplyAsAnswer(replyId, isAnswer)
    await loadPostDetail(currentPostId.value!)
  } catch {
    alert('操作失败')
  }
}

async function handleCreateReply(data: { content: string }) {
  if (!currentPostId.value) return
  try {
    await discussionApi.createReply({
      postId: currentPostId.value,
      content: data.content,
    })
    await loadPostDetail(currentPostId.value)
  } catch {
    alert('回复失败')
  }
}

onMounted(async () => {
  await loadPosts()
  try {
    const courseRes = await courseApi.getCourseById(courseId.value)
    courseTitle.value = courseRes.data.data.title
  } catch {
    // Ignore
  }
})
</script>

<style scoped>
.discussion-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 20px;
}

.text-secondary {
  color: var(--color-text-muted);
  font-size: 13px;
}

.discussion-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.new-post-section {
  margin-bottom: 8px;
}
</style>
