<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>编辑课程目录</h3>
        <button class="btn btn-outline btn-sm" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <div class="editor-toolbar">
          <button class="btn btn-primary btn-sm" @click="addRootNode">+ 添加章节</button>
          <button class="btn btn-primary btn-sm" @click="saveAll">💾 保存</button>
        </div>

        <div class="editor-tree" v-if="editableTree.length > 0">
          <div v-for="node in editableTree" :key="node.id">
            <EditorTreeNode
              :node="node"
              :depth="0"
              @add-child="addChildNode"
              @delete="deleteNode"
              @update="updateNode"
            />
          </div>
        </div>
        <div v-else class="editor-empty">
          暂无目录，点击"添加章节"开始构建
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ContentNode } from '@/types'
import * as contentApi from '@/api/content'
import EditorTreeNode from './EditorTreeNode.vue'

const props = defineProps<{
  courseId: string
  tree: ContentNode[]
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const editableTree = ref<ContentNode[]>([])

onMounted(() => {
  // Deep clone the tree for editing
  editableTree.value = JSON.parse(JSON.stringify(props.tree))
})

function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function createEmptyNode(parentId: string | null): ContentNode {
  return {
    id: generateId(),
    courseId: props.courseId,
    parentId,
    title: '新节点',
    type: 'lesson',
    order: 0,
    children: [],
  }
}

function addRootNode() {
  editableTree.value.push(createEmptyNode(null))
}

function findAndAddChild(nodes: ContentNode[], targetId: string, newNode: ContentNode): boolean {
  for (const node of nodes) {
    if (node.id === targetId) {
      if (!node.children) node.children = []
      node.children.push(newNode)
      return true
    }
    if (node.children && findAndAddChild(node.children, targetId, newNode)) return true
  }
  return false
}

function addChildNode(parentId: string) {
  const newNode = createEmptyNode(parentId)
  findAndAddChild(editableTree.value, parentId, newNode)
}

function findAndDelete(nodes: ContentNode[], targetId: string): boolean {
  const index = nodes.findIndex((n) => n.id === targetId)
  if (index !== -1) {
    nodes.splice(index, 1)
    return true
  }
  for (const node of nodes) {
    if (node.children && findAndDelete(node.children, targetId)) return true
  }
  return false
}

function deleteNode(nodeId: string) {
  findAndDelete(editableTree.value, nodeId)
}

function findAndUpdate(nodes: ContentNode[], targetId: string, updates: Partial<ContentNode>): boolean {
  for (const node of nodes) {
    if (node.id === targetId) {
      Object.assign(node, updates)
      return true
    }
    if (node.children && findAndUpdate(node.children, targetId, updates)) return true
  }
  return false
}

function updateNode(nodeId: string, updates: Partial<ContentNode>) {
  findAndUpdate(editableTree.value, nodeId, updates)
}

async function saveAll() {
  try {
    // Reorder nodes
    const orderIds = editableTree.value.map((n) => n.id)
    await contentApi.reorderContentNodes(props.courseId, orderIds)

    // Save each node (create or update)
    for (const node of editableTree.value) {
      await saveNodeRecursive(node)
    }

    emit('saved')
  } catch {
    alert('保存失败，请重试')
  }
}

async function saveNodeRecursive(node: ContentNode) {
  if (node.id.startsWith('node_')) {
    // New node
    await contentApi.createContentNode(node)
  } else {
    await contentApi.updateContentNode(node.id, node)
  }
  if (node.children) {
    for (const child of node.children) {
      await saveNodeRecursive(child)
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: var(--color-bg-white);
  border-radius: var(--radius-lg);
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.editor-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.editor-tree {
  display: flex;
  flex-direction: column;
}

.editor-empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: 40px;
}
</style>
