<template>
  <AppLayout>
    <div class="page" v-if="course">
      <h1>课程所有权转移</h1>
      <div class="card">
        <p>课程：<strong>{{ course.title }}</strong></p>
        <p>当前所有者：{{ course.ownerName }}</p>
        <div class="form-group" style="margin-top:16px">
          <label>选择新所有者（教师）</label>
          <select v-model="selectedTeacher" class="input">
            <option value="">-- 请选择 --</option>
            <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.displayName }} ({{ t.username }})</option>
          </select>
        </div>
        <button class="btn btn-primary" :disabled="!selectedTeacher" @click="handleTransfer" style="margin-top:16px">
          确认转移
        </button>
      </div>

      <!-- Transfer Records -->
      <div class="card" v-if="records.length > 0" style="margin-top:20px">
        <h3>转移记录</h3>
        <table class="data-table">
          <thead><tr><th>从</th><th>到</th><th>时间</th><th>操作人</th></tr></thead>
          <tbody>
            <tr v-for="r in records" :key="r.id">
              <td>{{ r.fromUserName }}</td><td>{{ r.toUserName }}</td>
              <td>{{ formatDate(r.transferredAt) }}</td><td>{{ r.transferredBy }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { getCourseById, transferCourseOwnership, getOwnershipRecords } from '@/api/course'
import { getTeachers } from '@/api/user'
import type { Course, CourseOwnershipRecord, User } from '@/types'

const route = useRoute()
const router = useRouter()
const course = ref<Course | null>(null)
const teachers = ref<User[]>([])
const selectedTeacher = ref('')
const records = ref<CourseOwnershipRecord[]>([])

async function handleTransfer() {
  if (!selectedTeacher.value || !course.value) return
  if (!confirm('确定要转移课程所有权吗？')) return
  try {
    await transferCourseOwnership(course.value.id, selectedTeacher.value)
    router.push(`/courses/${course.value.id}`)
  } catch { alert('转移失败') }
}

function formatDate(d: string) { return new Date(d).toLocaleString('zh-CN') }

onMounted(async () => {
  const courseId = route.params.id as string
  try {
    const [courseRes, teachersRes, recordsRes] = await Promise.all([
      getCourseById(courseId), getTeachers(), getOwnershipRecords(courseId),
    ])
    course.value = courseRes.data.data
    teachers.value = teachersRes.data.data.items.filter(t => t.id !== course.value?.ownerId)
    records.value = recordsRes.data.data
  } catch {}
})
</script>

<style scoped>
.page { max-width: 700px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 13px; font-weight: 500; }
.data-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
.data-table th, .data-table td { padding: 8px 12px; border-bottom: 1px solid var(--color-border-light); font-size: 13px; }
.data-table th { background: var(--color-bg); }
</style>
