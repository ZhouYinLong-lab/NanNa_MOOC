<template>
  <div class="course-content">
    <!-- Empty state -->
    <div v-if="!selectedNode" class="content-empty">
      <p>👈 请从左侧目录选择课程内容</p>
    </div>

    <!-- Node content -->
    <div v-else class="content-body">
      <div class="content-header">
        <h2>{{ selectedNode.title }}</h2>
        <div class="content-actions" v-if="canTrack">
          <button
            class="btn"
            :class="isCompleted ? 'btn-outline' : 'btn-primary'"
            @click="toggleComplete"
          >
            {{ isCompleted ? '✓ 已完成' : '标记完成' }}
          </button>
        </div>
      </div>

      <div class="content-main" v-if="selectedNode.resource">
        <ContentRenderer :resource="selectedNode.resource" />
      </div>
      <div class="content-main" v-else>
        <p class="no-resource">此节点暂无内容资源</p>
      </div>

      <!-- Navigation between nodes -->
      <div class="content-nav">
        <button
          class="btn btn-outline btn-sm"
          :disabled="!prevNode"
          @click="navigateTo(prevNode)"
        >
          ← 上一节
        </button>
        <button
          class="btn btn-outline btn-sm"
          :disabled="!nextNode"
          @click="navigateTo(nextNode)"
        >
          下一节 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ContentNode } from '@/types'
import ContentRenderer from './ContentRenderer.vue'

const props = defineProps<{
  selectedNode: ContentNode | null
  isCompleted: boolean
  canTrack: boolean
  prevNode: ContentNode | null
  nextNode: ContentNode | null
}>()

const emit = defineEmits<{
  'toggle-complete': []
  'navigate': [node: ContentNode]
}>()

function toggleComplete() {
  emit('toggle-complete')
}

function navigateTo(node: ContentNode | null) {
  if (node) emit('navigate', node)
}
</script>

<style scoped>
.course-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.content-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
  color: var(--color-text-muted);
}

.content-body {
  padding: 24px 32px;
  max-width: 900px;
  width: 100%;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.content-header h2 {
  font-size: 20px;
}

.content-main {
  min-height: 400px;
}

.no-resource {
  color: var(--color-text-muted);
  text-align: center;
  padding: 60px 0;
}

.content-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-light);
}
</style>
