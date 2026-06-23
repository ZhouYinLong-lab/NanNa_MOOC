import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { Role } from '@/types'

export function useAuth() {
  const authStore = useAuthStore()

  const user = computed(() => authStore.user)
  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const userRole = computed(() => authStore.userRole)
  const loading = computed(() => authStore.loading)

  function hasRole(...roles: Role[]): boolean {
    if (!user.value) return false
    return roles.includes(user.value.role)
  }

  function isAdmin(): boolean {
    return userRole.value === 'admin'
  }

  function isTeacher(): boolean {
    return userRole.value === 'teacher' || userRole.value === 'admin'
  }

  function isAssistant(): boolean {
    return userRole.value === 'assistant'
  }

  async function login(username: string, password: string) {
    await authStore.login({ username, password })
  }

  function loginAsGuest() {
    authStore.loginAsGuest()
  }

  function logout() {
    authStore.logout()
  }

  return {
    user,
    isLoggedIn,
    userRole,
    loading,
    hasRole,
    isAdmin,
    isTeacher,
    isAssistant,
    login,
    loginAsGuest,
    logout,
  }
}
