<template>
  <div class="editor-node">
    <div class="editor-row" :style="{ paddingLeft: `${depth * 24 + 8}px` }">
      <span class="drag-handle">⠿</span>
      <input
        v-model="localTitle"
        class="input title-input"
        @blur="onTitleBlur"
        placeholder="节点标题"
      />
      <select v-model="localType" @change="onTypeChange" class="input type-select">
        <option value="chapter">章</option>
        <option value="section">节</option>
        <option value="lesson">课</option>
        <option value="resource">资源</option>
      </select>
      <button class="btn btn-outline btn-sm" @click="$emit('add-child', node.id)" title="添加子节点">
        + 子节点
      </button>
      <button class="btn btn-outline btn-sm" @click="$emit('delete', node.id)" title="删除">🗑</button>
    </div>
    <div v-if="node.children && node.children.length > 0">
      <EditorTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        @add-child="(id: string) => $emit('add-child', id)"
        @delete="(id: string) => $emit('delete', id)"
        @update="(id: string, data: any) => $emit('update', id, data)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ContentNode, ContentNodeType } from '@/types'

const props = defineProps<{
  node: ContentNode
  depth: number
}>()

const emit = defineEmits<{
  'add-child': [nodeId: string]
  delete: [nodeId: string]
  update: [nodeId: string, updates: Partial<ContentNode>]
}>()

const localTitle = ref(props.node.title)
const localType = ref<ContentNodeType>(props.node.type)

function onTitleBlur() {
  if (localTitle.value !== props.node.title) {
    emit('update', props.node.id, { title: localTitle.value })
  }
}

function onTypeChange() {
  emit('update', props.node.id, { type: localType.value })
}
</script>

<style scoped>
.editor-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
}

.drag-handle {
  cursor: grab;
  color: var(--color-text-muted);
  font-size: 14px;
}

.title-input {
  flex: 1;
  padding: 6px 8px;
  font-size: 13px;
}

.type-select {
  width: 80px;
  padding: 6px 4px;
  font-size: 12px;
}
</style>
