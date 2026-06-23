<template>
  <AppLayout>
    <div class="page">
      <h1>系统设置</h1>
      <div class="card">
        <form @submit.prevent="save" class="form">
          <div class="form-group"><label>平台名称</label><input v-model="platformName" class="input" /></div>
          <div class="form-group"><label>允许自主注册</label><input type="checkbox" v-model="allowRegister" /></div>
          <div class="form-group"><label>教师申请开放</label><input type="checkbox" v-model="allowTeacherApply" /></div>
          <button type="submit" class="btn btn-primary">保存</button>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const platformName = ref('南哪MOOC')
const allowRegister = ref(true)
const allowTeacherApply = ref(true)

function save() {
  alert('系统设置已保存（功能需对接后端）')
}
</script>

<style scoped>
.page { max-width: 600px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 20px; }
.form { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; align-items: center; gap: 8px; }
.form-group label { font-size: 13px; font-weight: 500; width: 140px; flex-shrink: 0; }
.form-group .input { flex: 1; }
</style>
