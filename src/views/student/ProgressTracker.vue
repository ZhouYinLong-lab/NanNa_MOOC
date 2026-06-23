<template>
  <AppLayout>
    <div class="page">
      <h1>学习进度</h1>
      <div v-if="progressList.length > 0">
        <div v-for="p in progressList" :key="p.courseId" class="progress-card card">
          <div class="progress-info">
            <h3>
              <router-link :to="`/courses/${p.courseId}`">{{ p.courseTitle }}</router-link>
            </h3>
            <div class="progress-bar-container">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: p.overallProgress + '%' }"></div>
              </div>
              <span class="progress-text">{{ p.overallProgress }}%</span>
            </div>
            <p class="completed-count">已完成 {{ p.completedNodes.length }} 个学习节点</p>
            <p v-if="p.lastAccessedAt" class="last-access">上次学习：{{ formatDate(p.lastAccessedAt) }}</p>
          </div>
        </div>
      </div>
      <EmptyState v-else title="暂无学习进度" description="选择课程开始学习吧">
        <router-link to="/courses" class="btn btn-primary">浏览课程</router-link>
      </EmptyState>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getMyCourses } from '@/api/course'
import { getMyProgress } from '@/api/progress'
import type { Course, LearningProgress } from '@/types'

interface ProgressWithCourse extends LearningProgress {
  courseTitle: string
}

const progressList = ref<ProgressWithCourse[]>([])

function formatDate(d: string) { return new Date(d).toLocaleString('zh-CN') }

onMounted(async () => {
  try {
    const coursesRes = await getMyCourses()
    const courses: Course[] = coursesRes.data.data.items
    const progressItems: ProgressWithCourse[] = []
    for (const course of courses) {
      try {
        const progressRes = await getMyProgress(course.id)
        progressItems.push({ ...progressRes.data.data, courseTitle: course.title })
      } catch {
        // Not enrolled or no progress yet
      }
    }
    progressList.value = progressItems
  } catch {}
})
</script>

<style scoped>
.page { max-width: 800px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 20px; }
.progress-card { margin-bottom: 16px; }
.progress-card h3 { font-size: 16px; margin-bottom: 8px; }
.progress-card h3 a { color: var(--color-text); }
.progress-bar-container { display: flex; align-items: center; gap: 12px; margin: 8px 0; }
.progress-bar { flex: 1; height: 8px; background: var(--color-border-light); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-primary); border-radius: 4px; transition: width 0.3s; }
.progress-text { font-size: 14px; font-weight: 600; color: var(--color-primary); min-width: 40px; }
.completed-count, .last-access { font-size: 12px; color: var(--color-text-muted); }
</style>
