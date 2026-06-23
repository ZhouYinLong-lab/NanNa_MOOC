import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Course, ContentNode } from '@/types'
import * as courseApi from '@/api/course'
import * as contentApi from '@/api/content'

export const useCourseStore = defineStore('course', () => {
  const currentCourse = ref<Course | null>(null)
  const contentTree = ref<ContentNode[]>([])
  const selectedNodeId = ref<string | null>(null)
  const selectedNode = ref<ContentNode | null>(null)
  const loading = ref(false)

  async function fetchCourse(courseId: string) {
    loading.value = true
    try {
      const res = await courseApi.getCourseById(courseId)
      currentCourse.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  async function fetchContentTree(courseId: string) {
    const res = await contentApi.getContentTree(courseId)
    contentTree.value = res.data.data
  }

  function selectNode(node: ContentNode) {
    selectedNodeId.value = node.id
    selectedNode.value = node
  }

  function reset() {
    currentCourse.value = null
    contentTree.value = []
    selectedNodeId.value = null
    selectedNode.value = null
  }

  return {
    currentCourse,
    contentTree,
    selectedNodeId,
    selectedNode,
    loading,
    fetchCourse,
    fetchContentTree,
    selectNode,
    reset,
  }
})
