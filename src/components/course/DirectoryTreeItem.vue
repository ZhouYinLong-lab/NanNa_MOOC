<template>
  <div class="tree-item" :class="{ selected: isSelected }">
    <div
      class="tree-item-row"
      :style="{ paddingLeft: `${depth * 20 + 12}px` }"
      @click="onSelect"
    >
      <span class="tree-toggle" v-if="hasChildren" @click.stop="toggleExpand">
        {{ expanded ? '▾' : '▸' }}
      </span>
      <span v-else class="tree-toggle-placeholder"></span>
      <span class="tree-icon">{{ typeIcon }}</span>
      <span class="tree-label">{{ node.title }}</span>
      <span v-if="completed" class="tree-check">✓</span>
    </div>
    <div v-if="expanded && hasChildren" class="tree-children">
      <DirectoryTreeItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :selected-id="selectedId"
        :completed-nodes="completedNodes"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ContentNode } from '@/types'

const props = defineProps<{
  node: ContentNode
  depth: number
  selectedId: string | null
  completedNodes: string[]
}>()

defineEmits<{
  select: [node: ContentNode]
}>()

const expanded = ref(props.depth < 2) // Auto-expand first 2 levels

const hasChildren = computed(() => props.node.children && props.node.children.length > 0)
const isSelected = computed(() => props.selectedId === props.node.id)
const completed = computed(() => props.completedNodes.includes(props.node.id))

const typeIcon = computed(() => {
  const icons: Record<string, string> = {
    chapter: '📁',
    section: '📂',
    lesson: '📖',
    resource: '📄',
  }
  return icons[props.node.type] ?? '📄'
})

function toggleExpand() {
  expanded.value = !expanded.value
}

function onSelect() {
  if (!isSelected.value) {
    expanded.value = true
  }
  emit('select', props.node)
}
</script>

<style scoped>
.tree-item {
  user-select: none;
}

.tree-item-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.1s;
  border-radius: var(--radius-sm);
  margin: 1px 4px;
}
.tree-item-row:hover {
  background-color: var(--color-bg-hover);
}

.selected .tree-item-row {
  background-color: #e8f0fe;
  color: var(--color-primary);
  font-weight: 500;
}

.tree-toggle {
  width: 18px;
  font-size: 12px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.tree-toggle-placeholder {
  width: 18px;
  flex-shrink: 0;
}

.tree-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.tree-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.tree-check {
  color: var(--color-success);
  font-size: 12px;
  font-weight: 700;
}
</style>
