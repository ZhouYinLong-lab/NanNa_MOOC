<template>
  <div class="course-header">
    <div class="header-top">
      <div class="header-info">
        <h1 class="course-title">{{ course?.title ?? '加载中...' }}</h1>
        <p class="course-desc">{{ course?.description }}</p>
        <div class="course-meta">
          <span>主讲：{{ course?.ownerName }}</span>
          <span v-if="course?.semester">{{ course.semester }}</span>
          <span v-if="course?.enrolledCount !== undefined">{{ course.enrolledCount }} 人选课</span>
        </div>
      </div>
      <div class="header-actions">
        <button
          v-if="canManage"
          class="btn btn-outline btn-sm"
          @click="$emit('manage')"
        >
          管理课程
        </button>
        <button
          class="btn btn-outline btn-sm"
          @click="$emit('discussion')"
        >
          课程讨论
        </button>
        <button
          v-if="canEnroll && !isEnrolled"
          class="btn btn-primary btn-sm"
          @click="$emit('enroll')"
        >
          选课
        </button>
        <button
          v-if="canEnroll && isEnrolled"
          class="btn btn-outline btn-sm"
          @click="$emit('unenroll')"
        >
          退课
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from '@/types'

defineProps<{
  course: Course | null
  canManage: boolean
  canEnroll: boolean
  isEnrolled: boolean
}>()

defineEmits<{
  manage: []
  discussion: []
  enroll: []
  unenroll: []
}>()
</script>

<style scoped>
.course-header {
  padding: 20px 24px;
  background-color: var(--color-bg-white);
  border-bottom: 1px solid var(--color-border-light);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.header-info {
  flex: 1;
}

.course-title {
  font-size: 22px;
  margin-bottom: 6px;
}

.course-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.course-meta {
  font-size: 13px;
  color: var(--color-text-muted);
  display: flex;
  gap: 16px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
</style>
