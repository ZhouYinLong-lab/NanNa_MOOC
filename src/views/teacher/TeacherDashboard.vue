<template>
  <AppLayout>
    <div class="page">
      <h1>教师工作台</h1>
      <div class="grid">
        <router-link to="/teacher/create-course" class="card-link card">📖 创建课程</router-link>
        <router-link to="/courses" class="card-link card">📚 我的课程</router-link>
        <router-link to="/teacher/question-bank" class="card-link card">📝 题库管理</router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<style scoped>
.page { max-width: 800px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.card-link { padding: 24px; text-align: center; font-size: 16px; font-weight: 500; color: var(--color-text); text-decoration: none; }
.card-link:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
</style>
