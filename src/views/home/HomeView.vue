<template>
  <AppLayout>
    <div class="home-page">
      <!-- Hero -->
      <section class="hero">
        <h1 class="hero-title">欢迎来到南哪MOOC</h1>
        <p class="hero-desc">开放、自由的在线学习平台，探索知识的无限可能</p>
        <div class="hero-actions">
          <router-link v-if="!isLoggedIn" to="/login" class="btn btn-primary btn-lg">立即登录</router-link>
          <button v-if="!isLoggedIn" class="btn btn-outline btn-lg" @click="handleGuestBrowse">👀 游客浏览</button>
          <router-link v-if="isLoggedIn" to="/courses" class="btn btn-primary btn-lg">浏览课程</router-link>
          <router-link v-if="isLoggedIn && canCreate" to="/teacher/create-course" class="btn btn-outline btn-lg">创建课程</router-link>
        </div>
      </section>

      <!-- Quick Links -->
      <section class="quick-links" v-if="isLoggedIn && userRole !== 'guest'">
        <div class="card" v-if="userRole === 'admin'">
          <h3>🔧 管理员快捷入口</h3>
          <div class="link-grid">
            <router-link to="/admin/users" class="link-item">用户管理</router-link>
            <router-link to="/admin/teachers/approval" class="link-item">教师审批</router-link>
            <router-link to="/admin/semester" class="link-item">学期配置</router-link>
            <router-link to="/admin/settings" class="link-item">系统设置</router-link>
          </div>
        </div>

        <div class="card" v-if="userRole === 'teacher' || userRole === 'admin'">
          <h3>📚 教师快捷入口</h3>
          <div class="link-grid">
            <router-link to="/teacher/create-course" class="link-item">创建课程</router-link>
            <router-link to="/teacher/question-bank" class="link-item">题库管理</router-link>
            <router-link to="/courses" class="link-item">我的课程</router-link>
          </div>
        </div>

        <div class="card" v-if="userRole === 'student'">
          <h3>📖 学生快捷入口</h3>
          <div class="link-grid">
            <router-link to="/courses" class="link-item">浏览课程</router-link>
            <router-link to="/student/courses" class="link-item">我的课程</router-link>
            <router-link to="/student/progress" class="link-item">学习进度</router-link>
            <router-link to="/student/practice" class="link-item">题库练习</router-link>
            <router-link to="/student/error-book" class="link-item">错题本</router-link>
          </div>
        </div>
      </section>

      <!-- Course Recommendations -->
      <section class="courses-section" v-if="isLoggedIn">
        <h2>推荐课程</h2>
        <div v-if="courses.length === 0" class="empty-text">暂无推荐课程</div>
        <div class="course-grid">
          <div v-for="course in courses" :key="course.id" class="course-card card" @click="goToCourse(course.id)">
            <div class="course-cover" :style="{ background: coverColor(course.id) }">
              <span class="course-cover-text">{{ course.title.charAt(0) }}</span>
            </div>
            <div class="course-info">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-desc">{{ course.description?.slice(0, 80) ?? '' }}</p>
              <div class="course-meta">
                <span>{{ course.ownerName }}</span>
                <span v-if="course.enrolledCount">{{ course.enrolledCount }} 人已选</span>
              </div>
            </div>
          </div>
        </div>
        <div class="section-footer">
          <router-link to="/courses" class="btn btn-outline">查看全部课程 →</router-link>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { usePermission } from '@/composables/usePermission'
import { getCourses } from '@/api/course'
import type { Course } from '@/types'

const router = useRouter()
const { isLoggedIn, userRole, loginAsGuest } = useAuth()
const { canCreateCourse } = usePermission()

const courses = ref<Course[]>([])

const canCreate = canCreateCourse({ role: userRole.value } as any)

function coverColor(id: string): string {
  const colors = ['#1a73e8', '#0d904f', '#f5a623', '#d93025', '#7b1fa2', '#00838f']
  const index = parseInt(id.replace(/\D/g, '').slice(0, 1) || '0', 10)
  return colors[index % colors.length]
}

function goToCourse(id: string) {
  router.push(`/courses/${id}`)
}

function handleGuestBrowse() {
  loginAsGuest()
  router.push('/courses')
}

onMounted(async () => {
  if (isLoggedIn.value) {
    try {
      const res = await getCourses({ pageSize: 6 })
      courses.value = res.data.data.items
    } catch {
      // Silently fail
    }
  }
})
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  text-align: center;
  padding: 60px 20px;
}

.hero-title {
  font-size: 36px;
  margin-bottom: 12px;
}

.hero-desc {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.quick-links .card h3 {
  margin-bottom: 12px;
  font-size: 16px;
}

.link-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.link-item {
  padding: 6px 14px;
  background-color: var(--color-bg);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.15s;
}
.link-item:hover {
  background-color: var(--color-primary);
  color: #fff;
}

.courses-section {
  margin-bottom: 40px;
}

.courses-section h2 {
  font-size: 20px;
  margin-bottom: 16px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.course-card {
  cursor: pointer;
  padding: 0;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.15s;
}
.course-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.course-cover {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-cover-text {
  font-size: 48px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 700;
}

.course-info {
  padding: 16px;
}

.course-title {
  font-size: 15px;
  margin-bottom: 6px;
}

.course-desc {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  font-size: 12px;
  color: var(--color-text-muted);
  display: flex;
  justify-content: space-between;
}

.section-footer {
  text-align: center;
  margin-top: 24px;
}

.empty-text {
  text-align: center;
  padding: 40px;
  color: var(--color-text-muted);
}
</style>
