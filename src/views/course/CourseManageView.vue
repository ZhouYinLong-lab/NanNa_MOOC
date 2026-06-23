<template>
  <AppLayout>
    <div class="manage-page" v-if="course">
      <div class="page-header">
        <router-link :to="`/courses/${course.id}`" class="btn btn-outline btn-sm">← 返回课程</router-link>
        <h1>课程管理：{{ course.title }}</h1>
      </div>

      <div class="manage-sections">
        <!-- Basic Info -->
        <section class="card">
          <h3>基本信息</h3>
          <form @submit.prevent="saveBasicInfo" class="info-form">
            <div class="form-group">
              <label>课程标题</label>
              <input v-model="editForm.title" class="input" required />
            </div>
            <div class="form-group">
              <label>课程描述</label>
              <textarea v-model="editForm.description" class="input" rows="4"></textarea>
            </div>
            <div class="form-group">
              <label>状态</label>
              <select v-model="editForm.status" class="input">
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="archived">已归档</option>
              </select>
            </div>
            <div class="form-group">
              <label>学期</label>
              <input v-model="editForm.semester" class="input" placeholder="如：2025春季学期" />
            </div>
            <button type="submit" class="btn btn-primary">保存修改</button>
          </form>
        </section>

        <!-- Ownership -->
        <section class="card" v-if="perms.canTransferCourse(authStore.user, course)">
          <h3>课程所有权</h3>
          <p class="section-desc">当前所有者：{{ course.ownerName }}</p>
          <button class="btn btn-outline" @click="$router.push(`/teacher/courses/${course.id}/transfer`)">
            转移所有权
          </button>
        </section>

        <!-- Danger Zone -->
        <section class="card danger-zone">
          <h3>危险操作</h3>
          <p class="section-desc">删除课程将同时删除所有相关数据，此操作不可恢复。</p>
          <button class="btn btn-danger" @click="handleDelete">删除课程</button>
        </section>
      </div>
    </div>
    <div v-else-if="loading" class="loading-container">
      <span class="spinner"></span>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { usePermission } from '@/composables/usePermission'
import * as courseApi from '@/api/course'
import type { Course } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const perms = usePermission()
const course = ref<Course | null>(null)
const loading = ref(true)

const editForm = reactive({
  title: '',
  description: '',
  status: 'draft' as string,
  semester: '',
})

onMounted(async () => {
  const courseId = route.params.id as string
  try {
    const res = await courseApi.getCourseById(courseId)
    course.value = res.data.data
    editForm.title = course.value.title
    editForm.description = course.value.description
    editForm.status = course.value.status
    editForm.semester = course.value.semester ?? ''
  } finally {
    loading.value = false
  }
})

async function saveBasicInfo() {
  if (!course.value) return
  try {
    await courseApi.updateCourse(course.value.id, { ...editForm })
    alert('保存成功')
  } catch {
    alert('保存失败')
  }
}

async function handleDelete() {
  if (!course.value) return
  if (!confirm(`确定要删除课程「${course.value.title}」吗？此操作不可恢复。`)) return
  try {
    await courseApi.deleteCourse(course.value.id)
    router.push('/courses')
  } catch {
    alert('删除失败')
  }
}
</script>

<style scoped>
.manage-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 20px;
}

.manage-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.manage-sections .card h3 {
  margin-bottom: 12px;
  font-size: 16px;
}

.info-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
}

.section-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}

.danger-zone {
  border-color: var(--color-danger);
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 80px;
}
</style>
