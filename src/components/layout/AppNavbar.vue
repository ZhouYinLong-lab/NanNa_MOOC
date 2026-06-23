<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/" class="navbar-brand">
        <img src="/logo.png" alt="南哪MOOC" class="brand-logo" />
        <span>南哪MOOC</span>
      </router-link>
      <div class="navbar-links" v-if="isLoggedIn">
        <router-link to="/courses" class="nav-link">课程</router-link>

        <!-- Admin menu -->
        <router-link v-if="hasRole('admin')" to="/admin" class="nav-link">管理后台</router-link>

        <!-- Teacher menu -->
        <router-link v-if="hasRole('admin', 'teacher')" to="/teacher" class="nav-link">教师工作台</router-link>

        <!-- Student menu -->
        <router-link v-if="hasRole('student')" to="/student" class="nav-link">学习中心</router-link>
      </div>
    </div>

    <div class="navbar-right" v-if="isLoggedIn && user?.role !== 'guest'">
      <!-- Notifications -->
      <div class="nav-icon-btn" @click="toggleNotifications" ref="notifRef">
        <span class="icon">🔔</span>
        <span v-if="unreadCount > 0" class="badge-count">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
      </div>
      <div v-if="showNotifications" class="dropdown notifications-dropdown">
        <div class="dropdown-header">
          <span>通知</span>
          <button v-if="unreadCount > 0" class="btn-text" @click="markAllRead">全部已读</button>
        </div>
        <div class="dropdown-body">
          <div v-if="notifications.length === 0" class="empty-text">暂无通知</div>
          <div
            v-for="notif in notifications"
            :key="notif.id"
            class="notif-item"
            :class="{ unread: !notif.read }"
            @click="onNotifClick(notif)"
          >
            <span class="notif-icon">{{ typeIcon(notif.type) }}</span>
            <div class="notif-content">
              <div class="notif-title">{{ notif.title }}</div>
              <div class="notif-message">{{ notif.message }}</div>
              <div class="notif-time">{{ formatDate(notif.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- User info -->
      <div class="nav-icon-btn" @click="toggleUserMenu" ref="userMenuRef">
        <span class="avatar">{{ userInitial }}</span>
        <span class="username">{{ user?.displayName }}</span>
        <span class="role-badge" :class="`badge-${user?.role}`">{{ roleLabel }}</span>
      </div>
      <div v-if="showUserMenu" class="dropdown user-dropdown">
        <router-link to="/profile" class="dropdown-item" @click="showUserMenu = false">
          ⚙️ 个人设置
        </router-link>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" @click="onLogout">🚪 退出登录</button>
      </div>
    </div>

    <div class="navbar-right" v-if="isLoggedIn && user?.role === 'guest'">
      <span class="guest-badge">👀 游客</span>
      <router-link to="/login" class="btn btn-outline btn-sm">登录</router-link>
    </div>

    <div class="navbar-right" v-else-if="!isLoggedIn">
      <router-link to="/login" class="btn btn-primary btn-sm">登录</router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotificationStore } from '@/stores/notification'
import type { Notification } from '@/stores/notification'

const router = useRouter()
const { user, isLoggedIn, hasRole, logout } = useAuth()
const notificationStore = useNotificationStore()

const showNotifications = ref(false)
const showUserMenu = ref(false)
const notifRef = ref<HTMLElement | null>(null)
const userMenuRef = ref<HTMLElement | null>(null)

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

const userInitial = computed(() => {
  if (!user.value?.displayName) return '?'
  return user.value.displayName.charAt(0).toUpperCase()
})

const roleLabel = computed(() => {
  const labels: Record<string, string> = {
    admin: '管理员',
    teacher: '教师',
    assistant: '助教',
    student: '学生',
    guest: '游客',
  }
  return labels[user.value?.role ?? ''] ?? ''
})

function typeIcon(type: string): string {
  const icons: Record<string, string> = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅',
  }
  return icons[type] ?? '📢'
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return date.toLocaleDateString('zh-CN')
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

function markAllRead() {
  notificationStore.markAllAsRead()
}

function onNotifClick(notif: Notification) {
  notificationStore.markAsRead(notif.id)
  if (notif.link) {
    router.push(notif.link)
  }
  showNotifications.value = false
}

function onLogout() {
  logout()
  router.push('/login')
}

function handleClickOutside(e: MouseEvent) {
  if (notifRef.value && !notifRef.value.contains(e.target as Node)) {
    showNotifications.value = false
  }
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--navbar-height);
  padding: 0 20px;
  background-color: var(--color-bg-white);
  border-bottom: 1px solid var(--color-border-light);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
}

.brand-logo {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: contain;
}

.navbar-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.15s;
}
.nav-link:hover,
.nav-link.router-link-active {
  background-color: var(--color-bg-hover);
  color: var(--color-primary);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.15s;
}
.nav-icon-btn:hover {
  background-color: var(--color-bg-hover);
}

.icon {
  font-size: 18px;
}

.badge-count {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--color-danger);
  color: #fff;
  font-size: 11px;
  padding: 1px 5px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}

.username {
  font-size: 14px;
  color: var(--color-text);
}

.role-badge {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 10px;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: var(--color-bg-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  z-index: 200;
  min-width: 240px;
}

.notifications-dropdown {
  width: 360px;
  right: auto;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-light);
  font-weight: 600;
}

.btn-text {
  color: var(--color-primary);
  font-size: 13px;
}

.dropdown-body {
  max-height: 400px;
  overflow-y: auto;
}

.notif-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background-color 0.15s;
}
.notif-item:hover {
  background-color: var(--color-bg-hover);
}
.notif-item.unread {
  background-color: #e8f0fe;
}

.notif-icon {
  margin-right: 8px;
  float: left;
}

.notif-title {
  font-weight: 500;
  font-size: 13px;
}
.notif-message {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}
.notif-time {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  color: var(--color-text);
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.1s;
}
.dropdown-item:hover {
  background-color: var(--color-bg-hover);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-border-light);
  margin: 4px 0;
}

.guest-badge {
  font-size: 13px;
  color: var(--color-text-secondary);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  background-color: var(--color-bg);
}

.empty-text {
  padding: 40px;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
