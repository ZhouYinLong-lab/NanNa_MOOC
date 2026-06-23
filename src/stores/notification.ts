import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  createdAt: string
  link?: string
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)

  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

  function addNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
    notifications.value.unshift({
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      read: false,
      createdAt: new Date().toISOString(),
    })
  }

  function markAsRead(notificationId: string) {
    const n = notifications.value.find((item) => item.id === notificationId)
    if (n) n.read = true
  }

  function markAllAsRead() {
    notifications.value.forEach((n) => (n.read = true))
  }

  function removeNotification(notificationId: string) {
    notifications.value = notifications.value.filter((n) => n.id !== notificationId)
  }

  function clearAll() {
    notifications.value = []
  }

  return {
    notifications,
    loading,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  }
})
