<template>
  <AppLayout>
    <div class="course-detail" v-if="course">
      <!-- Header -->
      <CourseHeader
        :course="course"
        :can-manage="perms.canEditCourse(authStore.user, course)"
        :can-enroll="authStore.user?.role === 'student'"
        :is-enrolled="isEnrolled"
        @manage="goToManage"
        @discussion="goToDiscussion"
        @enroll="handleEnroll"
        @unenroll="handleUnenroll"
      />

      <!-- Body: Sidebar + Content -->
      <div class="course-body">
        <aside class="course-sidebar">
          <CourseDirectory
            :tree="contentTree"
            :selected-id="selectedNodeId"
            :can-edit="perms.canEditDirectory(authStore.user, course)"
            :can-track-progress="authStore.user?.role === 'student'"
            :completed-nodes="completedNodes"
            :total-nodes="totalLeafNodes"
            @select-node="onSelectNode"
            @edit="showDirectoryEditor = true"
            @progress="goToProgress"
          />
        </aside>

        <section class="course-main">
          <CourseContent
            :selected-node="selectedNode"
            :is-completed="currentNodeCompleted"
            :can-track="authStore.user?.role === 'student'"
            :prev-node="flatNodes[flatIndex - 1] ?? null"
            :next-node="flatNodes[flatIndex + 1] ?? null"
            @toggle-complete="toggleNodeComplete"
            @navigate="onSelectNode"
          />
        </section>
      </div>

      <!-- Directory Editor Modal -->
      <DirectoryEditor
        v-if="showDirectoryEditor"
        :course-id="course.id"
        :tree="contentTree"
        @close="showDirectoryEditor = false"
        @saved="onDirectorySaved"
      />
    </div>

    <!-- Loading / Error -->
    <div v-else-if="loading" class="loading-container">
      <span class="spinner"></span>
      <p>加载课程...</p>
    </div>
    <div v-else class="error-container">
      <p>课程不存在或无法访问</p>
      <router-link to="/courses" class="btn btn-primary">返回课程列表</router-link>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import CourseHeader from '@/components/course/CourseHeader.vue'
import CourseDirectory from '@/components/course/CourseDirectory.vue'
import CourseContent from '@/components/course/CourseContent.vue'
import DirectoryEditor from '@/components/course/DirectoryEditor.vue'
import { useAuthStore } from '@/stores/auth'
import { useCourseStore } from '@/stores/course'
import { usePermission } from '@/composables/usePermission'
import * as courseApi from '@/api/course'
import * as contentApi from '@/api/content'
import * as progressApi from '@/api/progress'
import type { ContentNode } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const courseStore = useCourseStore()
const perms = usePermission()

const course = computed(() => courseStore.currentCourse)
const contentTree = computed(() => courseStore.contentTree)
const selectedNodeId = computed(() => courseStore.selectedNodeId)
const selectedNode = computed(() => courseStore.selectedNode)
const loading = ref(true)
const isEnrolled = ref(false)
const completedNodes = ref<string[]>([])
const showDirectoryEditor = ref(false)

// Flatten the tree for prev/next navigation
const flatNodes = computed<ContentNode[]>(() => {
  const result: ContentNode[] = []
  function walk(nodes: ContentNode[]) {
    for (const node of nodes) {
      result.push(node)
      if (node.children) walk(node.children)
    }
  }
  walk(contentTree.value)
  return result
})

const flatIndex = computed(() => flatNodes.value.findIndex((n) => n.id === selectedNodeId.value))

const totalLeafNodes = computed(() => {
  let count = 0
  function walk(nodes: ContentNode[]) {
    for (const node of nodes) {
      if (!node.children || node.children.length === 0) count++
      else walk(node.children)
    }
  }
  walk(contentTree.value)
  return count
})

const currentNodeCompleted = computed(() =>
  selectedNodeId.value ? completedNodes.value.includes(selectedNodeId.value) : false
)

function onSelectNode(node: ContentNode) {
  courseStore.selectNode(node)
}

function goToManage() {
  router.push(`/courses/${route.params.id}/manage`)
}

function goToDiscussion() {
  router.push(`/courses/${route.params.id}/discussion`)
}

function goToProgress() {
  router.push('/student/progress')
}

async function handleEnroll() {
  try {
    await courseApi.enrollCourse(route.params.id as string)
    isEnrolled.value = true
  } catch {
    // Handle error
  }
}

async function handleUnenroll() {
  try {
    await courseApi.unenrollCourse(route.params.id as string)
    isEnrolled.value = false
  } catch {
    // Handle error
  }
}

async function toggleNodeComplete() {
  if (!selectedNodeId.value) return
  try {
    if (currentNodeCompleted.value) {
      await progressApi.markNodeIncomplete(route.params.id as string, selectedNodeId.value)
      completedNodes.value = completedNodes.value.filter((id) => id !== selectedNodeId.value)
    } else {
      await progressApi.markNodeCompleted(route.params.id as string, selectedNodeId.value)
      completedNodes.value.push(selectedNodeId.value!)
    }
  } catch {
    // Handle error
  }
}

async function onDirectorySaved() {
  showDirectoryEditor.value = false
  await courseStore.fetchContentTree(route.params.id as string)
}

async function loadCourse() {
  const courseId = route.params.id as string
  loading.value = true
  try {
    await courseStore.fetchCourse(courseId)
    await courseStore.fetchContentTree(courseId)

    // Load progress if student
    if (authStore.user?.role === 'student') {
      try {
        const progressRes = await progressApi.getMyProgress(courseId)
        completedNodes.value = progressRes.data.data.completedNodes
      } catch {
        // Might not be enrolled yet
      }
    }

    // Auto-select first node
    if (contentTree.value.length > 0) {
      const firstLeaf = findFirstLeaf(contentTree.value)
      if (firstLeaf) courseStore.selectNode(firstLeaf)
    }
  } catch {
    // Course not found
  } finally {
    loading.value = false
  }
}

function findFirstLeaf(nodes: ContentNode[]): ContentNode | null {
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      const found = findFirstLeaf(node.children)
      if (found) return found
    }
    return node
  }
  return null
}

// Watch route param changes
watch(() => route.params.id, () => {
  if (route.params.id) loadCourse()
})

onMounted(() => {
  loadCourse()
})
</script>

<style scoped>
.course-detail {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--navbar-height));
}

.course-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.course-sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  overflow-y: auto;
}

.course-main {
  flex: 1;
  overflow-y: auto;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 20px;
  color: var(--color-text-secondary);
}
</style>
