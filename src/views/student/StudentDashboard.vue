<template>
  <AppLayout>
    <div class="page">
      <h1>学习中心</h1>
      <div class="grid">
        <router-link to="/courses" class="card-link card">📚 浏览课程</router-link>
        <router-link to="/student/courses" class="card-link card">📖 我的课程</router-link>
        <router-link to="/student/progress" class="card-link card">📊 学习进度</router-link>
        <router-link to="/student/practice" class="card-link card">✏️ 题库练习</router-link>
        <router-link to="/student/error-book" class="card-link card">📝 错题本</router-link>
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
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
.card-link { padding: 28px 20px; text-align: center; font-size: 15px; font-weight: 500; color: var(--color-text); text-decoration: none; }
.card-link:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
</style>
