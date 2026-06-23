<template>
  <AppLayout>
    <div class="page">
      <h1>我的课程</h1>
      <div class="course-grid" v-if="courses.length>0">
        <div v-for="c in courses" :key="c.id" class="course-card card" @click="$router.push(`/courses/${c.id}`)">
          <h3>{{ c.title }}</h3>
          <p class="desc">{{ c.description?.slice(0, 80) }}</p>
          <div class="meta"><span>{{ c.ownerName }}</span></div>
        </div>
      </div>
      <EmptyState v-else title="暂无已选课程" description="前往课程列表选课">
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
import type { Course } from '@/types'

const courses = ref<Course[]>([])

onMounted(async () => {
  try {
    const res = await getMyCourses()
    courses.value = res.data.data.items
  } catch {}
})
</script>

<style scoped>
.page { max-width: 900px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 20px; }
.course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.course-card { cursor: pointer; }
.course-card h3 { font-size: 15px; margin-bottom: 6px; }
.desc { font-size: 12px; color: var(--color-text-secondary); }
.meta { font-size: 12px; color: var(--color-text-muted); margin-top: 8px; }
</style>
