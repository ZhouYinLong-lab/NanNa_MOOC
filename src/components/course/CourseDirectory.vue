<template>
  <div class="course-directory">
    <div class="directory-header">
      <h3>课程目录</h3>
      <div class="directory-actions">
        <button
          v-if="canEdit"
          class="btn btn-outline btn-sm"
          @click="$emit('edit')"
        >
          ✏️ 编辑
        </button>
        <button
          v-if="canTrackProgress"
          class="btn-text btn-sm"
          @click="$emit('progress')"
        >
          📊 进度 {{ progressPercent }}%
        </button>
      </div>
    </div>

    <div class="directory-body" v-if="tree.length > 0">
      <DirectoryTreeItem
        v-for="node in tree"
        :key="node.id"
        :node="node"
        :depth="0"
        :selected-id="selectedId"
        :completed-nodes="completedNodes"
        @select="$emit('select-node', $event)"
      />
    </div>
    <div v-else class="directory-empty">
      暂无课程内容
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ContentNode } from '@/types'
import DirectoryTreeItem from './DirectoryTreeItem.vue'

const props = defineProps<{
  tree: ContentNode[]
  selectedId: string | null
  canEdit: boolean
  canTrackProgress: boolean
  completedNodes: string[]
  totalNodes: number
}>()

defineEmits<{
  'select-node': [node: ContentNode]
  edit: []
  progress: []
}>()

const progressPercent = computed(() => {
  if (props.totalNodes === 0) return 0
  return Math.round((props.completedNodes.length / props.totalNodes) * 100)
})
</script>

<style scoped>
.course-directory {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border-light);
  background-color: var(--color-bg-white);
}

.directory-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.directory-header h3 {
  font-size: 15px;
}

.directory-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-text {
  color: var(--color-primary);
  font-size: 12px;
}

.directory-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.directory-empty {
  padding: 40px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 13px;
}
</style>
