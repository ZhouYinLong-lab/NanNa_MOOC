import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  // Set page title
  document.title = to.meta.title ? `${to.meta.title} - 南哪MOOC` : '南哪MOOC'

  const authStore = useAuthStore()

  // If route requires auth and user is not logged in
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // If route requires specific roles
  if (to.meta.roles && to.meta.roles.length > 0) {
    const userRole = authStore.user?.role
    if (!userRole || !to.meta.roles.includes(userRole)) {
      return next({ name: 'Home' })
    }
  }

  // If user is logged in (non-guest) and visiting login page, redirect to home
  if (to.name === 'Login' && authStore.isLoggedIn && authStore.user?.role !== 'guest') {
    return next({ name: 'Home' })
  }

  next()
})

export default router
