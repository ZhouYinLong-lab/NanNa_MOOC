import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest } from '@/types'
import * as authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role ?? null)

  function initFromStorage() {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch {
        clearAuth()
      }
    }
  }

  async function login(data: LoginRequest) {
    loading.value = true
    try {
      const res = await authApi.login(data)
      const { token: t, user: u } = res.data.data
      token.value = t
      user.value = u
      localStorage.setItem('token', t)
      localStorage.setItem('user', JSON.stringify(u))
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    try {
      const res = await authApi.getCurrentUser()
      user.value = res.data.data
      localStorage.setItem('user', JSON.stringify(res.data.data))
    } catch {
      clearAuth()
      throw new Error('Failed to fetch user')
    }
  }

  function loginAsGuest() {
    const guestUser: User = {
      id: 'guest',
      username: 'guest',
      displayName: '游客',
      email: '',
      role: 'guest',
      createdAt: new Date().toISOString(),
    }
    const guestToken = 'guest-token'
    token.value = guestToken
    user.value = guestUser
    localStorage.setItem('token', guestToken)
    localStorage.setItem('user', JSON.stringify(guestUser))
  }

  function logout() {
    authApi.logout().catch(() => {})
    clearAuth()
  }

  function clearAuth() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Initialize on store creation
  initFromStorage()

  return {
    user,
    token,
    loading,
    isLoggedIn,
    userRole,
    login,
    loginAsGuest,
    logout,
    fetchUser,
    clearAuth,
  }
})
