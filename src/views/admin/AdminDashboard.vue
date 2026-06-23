<template>
  <AppLayout>
    <div class="admin-page">
      <h1>管理后台</h1>
      <div class="admin-grid">
        <router-link to="/admin/users" class="admin-card card">👥 用户管理</router-link>
        <router-link to="/admin/teachers/approval" class="admin-card card">✅ 教师审批</router-link>
        <router-link to="/admin/semester" class="admin-card card">📅 学期配置</router-link>
        <router-link to="/admin/roadmap" class="admin-card card">🗺️ Roadmap 管理</router-link>
        <router-link to="/admin/settings" class="admin-card card">⚙️ 系统设置</router-link>
        <router-link to="/courses" class="admin-card card">📚 所有课程</router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<style scoped>
.admin-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}
.admin-page h1 { margin-bottom: 20px; }
.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.admin-card {
  padding: 24px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  transition: box-shadow 0.2s, transform 0.15s;
}
.admin-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
</style>
