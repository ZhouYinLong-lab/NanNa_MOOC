<template>
  <AppLayout>
    <div class="page">
      <h1>创建课程</h1>
      <div class="card">
        <form @submit.prevent="handleCreate" class="form">
          <div class="form-group"><label>课程标题 *</label><input v-model="form.title" class="input" required /></div>
          <div class="form-group"><label>课程描述</label><textarea v-model="form.description" class="input" rows="4"></textarea></div>
          <div class="form-group"><label>学期</label><input v-model="form.semester" class="input" placeholder="如：2025春季学期" /></div>
          <button type="submit" class="btn btn-primary btn-lg">创建课程</button>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { createCourse } from '@/api/course'

const router = useRouter()
const form = reactive({ title: '', description: '', semester: '' })

async function handleCreate() {
  try {
    const res = await createCourse(form)
    router.push(`/courses/${res.data.data.id}`)
  } catch { alert('创建失败') }
}
</script>

<style scoped>
.page { max-width: 600px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 20px; }
.form { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 13px; font-weight: 500; }
</style>
