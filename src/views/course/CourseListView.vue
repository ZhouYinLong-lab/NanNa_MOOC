<template>
  <AppLayout>
    <div class="course-list-page">
      <div class="page-header">
        <h1>课程列表</h1>
        <div class="header-actions">
          <input
            v-model="keyword"
            class="input search-input"
            placeholder="搜索课程..."
            @keyup.enter="search"
          />
          <button class="btn btn-primary btn-sm" @click="search">搜索</button>
          <router-link
            v-if="perms.canCreateCourse(authStore.user)"
            to="/teacher/create-course"
            class="btn btn-primary btn-sm"
          >
            + 创建课程
          </router-link>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <button
          v-for="f in filters"
          :key="f.value"
          class="btn"
          :class="activeFilter === f.value ? 'btn-primary' : 'btn-outline'"
          @click="setFilter(f.value)"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Course grid -->
      <div v-if="courses.length > 0" class="course-grid">
        <div
          v-for="course in courses"
          :key="course.id"
          class="course-card card"
          @click="goToCourse(course.id)"
        >
          <div class="course-cover" :style="{ background: coverColor(course.id) }">
            <span>{{ course.title.charAt(0) }}</span>
          </div>
          <div class="course-info">
            <h3>{{ course.title }}</h3>
            <p class="desc">{{ course.description?.slice(0, 100) }}</p>
            <div class="meta">
              <span>{{ course.ownerName }}</span>
              <span class="status-badge" :class="`status-${course.status}`">{{ statusLabel(course.status) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading" class="empty-state">
        <p>暂无课程</p>
      </div>

      <div v-if="loading" class="loading-container">
        <span class="spinner"></span>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { usePermission } from '@/composables/usePermission'
import { getCourses } from '@/api/course'
import type { Course, CourseStatus } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const perms = usePermission()

const courses = ref<Course[]>([])
const loading = ref(false)
const keyword = ref('')
const activeFilter = ref('all')

const filters = [
  { label: '全部', value: 'all' },
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
]

function coverColor(id: string): string {
  const colors = ['#1a73e8', '#0d904f', '#f5a623', '#d93025', '#7b1fa2', '#00838f']
  const index = parseInt(id.replace(/\D/g, '').slice(0, 1) || '0', 10)
  return colors[index % colors.length]
}

function statusLabel(status: CourseStatus): string {
  const labels: Record<CourseStatus, string> = {
    draft: '草稿',
    published: '已发布',
    archived: '已归档',
  }
  return labels[status] ?? status
}

async function search() {
  loading.value = true
  try {
    const params: any = { keyword: keyword.value || undefined }
    if (activeFilter.value !== 'all') params.status = activeFilter.value
    const res = await getCourses(params)
    courses.value = res.data.data.items
  } finally {
    loading.value = false
  }
}

function setFilter(value: string) {
  activeFilter.value = value
  search()
}

function goToCourse(id: string) {
  router.push(`/courses/${id}`)
}

onMounted(() => {
  search()
})
</script>

<style scoped>
.course-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-header h1 {
  font-size: 24px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.search-input {
  width: 240px;
}

.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.course-card {
  cursor: pointer;
  padding: 0;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.15s;
}
.course-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.course-cover {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 700;
}

.course-info {
  padding: 16px;
}

.course-info h3 {
  font-size: 15px;
  margin-bottom: 6px;
}

.course-info .desc {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-info .meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}
.status-published { background-color: #e6f4ea; color: #137333; }
.status-draft { background-color: #fef7e0; color: #ea8600; }
.status-archived { background-color: #f1f3f4; color: #5f6368; }

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--color-text-muted);
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 40px;
}
</style>
