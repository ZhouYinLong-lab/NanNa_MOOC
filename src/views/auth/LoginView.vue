<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-logo">🎓 南哪MOOC</h1>
      <p class="login-subtitle">开放学习平台</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="input"
            placeholder="请输入用户名"
            required
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="input"
            placeholder="请输入密码"
            required
            autocomplete="current-password"
          />
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button type="submit" class="btn btn-primary btn-lg w-full" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>登录</span>
        </button>

        <div class="divider">
          <span>或</span>
        </div>

        <button type="button" class="btn btn-outline btn-lg w-full" @click="handleGuestBrowse" :disabled="guestLoading">
          <span v-if="guestLoading">...</span>
          <span v-else>👀 游客浏览</span>
        </button>
      </form>

      <div class="login-footer">
        <span>还没有账号？</span>
        <a href="#" @click.prevent="onRegister">注册新账号</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login, loginAsGuest } = useAuth()

const form = reactive({
  username: '',
  password: '',
})
const loading = ref(false)
const guestLoading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await login(form.username, form.password)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (e: any) {
    error.value = e?.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}

function handleGuestBrowse() {
  guestLoading.value = true
  loginAsGuest()
  const redirect = (route.query.redirect as string) || '/courses'
  router.push(redirect)
}

function onRegister() {
  // Placeholder for registration page
  error.value = '注册功能请联系管理员'
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.login-card {
  background-color: var(--color-bg-white);
  padding: 40px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 400px;
  max-width: 90vw;
}

.login-logo {
  font-size: 28px;
  text-align: center;
  margin-bottom: 4px;
}

.login-subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.error-msg {
  color: var(--color-danger);
  font-size: 13px;
  padding: 8px 12px;
  background-color: #fce8e6;
  border-radius: var(--radius-sm);
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-text-muted);
  font-size: 12px;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--color-border-light);
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
}
</style>
