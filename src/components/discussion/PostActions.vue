<template>
  <div class="post-actions">
    <button
      v-if="canPin"
      class="action-btn"
      :class="{ active: isPinned }"
      @click="$emit('pin', !isPinned)"
      :title="isPinned ? '取消置顶' : '置顶'"
    >
      📌 {{ isPinned ? '已置顶' : '置顶' }}
    </button>
    <button
      v-if="canMarkAnswer"
      class="action-btn"
      :class="{ active: isAnswer }"
      @click="$emit('mark-answer', !isAnswer)"
      :title="isAnswer ? '取消标记' : '标记为答案'"
    >
      ✅ {{ isAnswer ? '已标答' : '标答' }}
    </button>
    <button
      v-if="canDelete"
      class="action-btn danger"
      @click="confirmDelete"
      title="删除"
    >
      🗑 删除
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  canDelete: boolean
  canPin: boolean
  canMarkAnswer: boolean
  isPinned: boolean
  isAnswer: boolean
}>()

const emit = defineEmits<{
  delete: []
  pin: [pinned: boolean]
  'mark-answer': [isAnswer: boolean]
}>()

function confirmDelete() {
  if (confirm('确定要删除吗？此操作不可恢复。')) {
    emit('delete')
  }
}
</script>

<style scoped>
.post-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  padding: 2px 8px;
  font-size: 12px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  transition: all 0.15s;
}
.action-btn:hover {
  background-color: var(--color-bg-hover);
}
.action-btn.active {
  color: var(--color-primary);
  background-color: #e8f0fe;
}
.action-btn.danger:hover {
  color: var(--color-danger);
  background-color: #fce8e6;
}
</style>
