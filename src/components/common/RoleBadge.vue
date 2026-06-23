<template>
  <span class="badge" :class="`badge-${role}`">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Role } from '@/types'

const props = defineProps<{
  role: Role
}>()

const label = computed(() => {
  const labels: Record<Role, string> = {
    admin: '管理员',
    teacher: '教师',
    assistant: '助教',
    student: '学生',
    guest: '游客',
  }
  return labels[props.role]
})
</script>
