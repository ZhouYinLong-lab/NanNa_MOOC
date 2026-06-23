<template>
  <div class="pagination" v-if="totalPages > 1">
    <button
      class="btn btn-outline btn-sm"
      :disabled="currentPage <= 1"
      @click="$emit('change', currentPage - 1)"
    >
      上一页
    </button>

    <template v-for="page in visiblePages" :key="page">
      <button
        v-if="page !== '...'"
        class="btn btn-sm"
        :class="page === currentPage ? 'btn-primary' : 'btn-outline'"
        @click="$emit('change', page)"
      >
        {{ page }}
      </button>
      <span v-else class="ellipsis">...</span>
    </template>

    <button
      class="btn btn-outline btn-sm"
      :disabled="currentPage >= totalPages"
      @click="$emit('change', currentPage + 1)"
    >
      下一页
    </button>

    <span class="total-info">共 {{ total }} 条</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  total: number
}>()

defineEmits<{
  change: [page: number]
}>()

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (current > 3) pages.push('...')

  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }

  if (current < total - 2) pages.push('...')
  pages.push(total)

  return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px;
}

.ellipsis {
  padding: 0 4px;
  color: var(--color-text-muted);
}

.total-info {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-left: 12px;
}
</style>
