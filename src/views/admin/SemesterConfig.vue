<template>
  <AppLayout>
    <div class="page">
      <h1>学期配置</h1>
      <div class="card">
        <form @submit.prevent="save" class="form">
          <div class="form-group"><label>当前学期名称</label><input v-model="name" class="input" placeholder="如：2025春季学期" /></div>
          <div class="form-group"><label>开始日期</label><input v-model="startDate" type="date" class="input" /></div>
          <div class="form-group"><label>结束日期</label><input v-model="endDate" type="date" class="input" /></div>
          <button type="submit" class="btn btn-primary">保存配置</button>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const name = ref('')
const startDate = ref('')
const endDate = ref('')

function save() {
  alert('学期配置已保存（功能需对接后端）')
}
</script>

<style scoped>
.page { max-width: 600px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 20px; }
.form { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 13px; font-weight: 500; }
</style>
