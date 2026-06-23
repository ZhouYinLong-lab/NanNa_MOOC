import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Post, Reply } from '@/types'
import * as discussionApi from '@/api/discussion'

export const useDiscussionStore = defineStore('discussion', () => {
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const replies = ref<Reply[]>([])
  const loading = ref(false)
  const totalPosts = ref(0)

  async function fetchPosts(courseId: string, page = 1, pageSize = 20) {
    loading.value = true
    try {
      const res = await discussionApi.getPosts(courseId, { page, pageSize })
      posts.value = res.data.data.items
      totalPosts.value = res.data.data.total
    } finally {
      loading.value = false
    }
  }

  async function fetchPostDetail(postId: string) {
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

  function reset() {
    posts.value = []
    currentPost.value = null
    replies.value = []
    totalPosts.value = 0
  }

  return {
    posts,
    currentPost,
    replies,
    loading,
    totalPosts,
    fetchPosts,
    fetchPostDetail,
    reset,
  }
})
