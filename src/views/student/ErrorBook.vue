<template>
  <AppLayout>
    <div class="page">
      <h1>错题本</h1>
      <div v-if="items.length > 0">
        <div v-for="item in items" :key="item.id" class="error-item card" :class="{ mastered: item.mastered }">
          <div class="item-header">
            <span class="q-type">{{ typeLabel(item.question.type) }}</span>
            <span class="q-diff" :class="`diff-${item.question.difficulty}`">{{ diffLabel(item.question.difficulty) }}</span>
            <span v-if="item.mastered" class="mastered-tag">✓ 已掌握</span>
            <span v-else class="wrong-count">错 {{ item.wrongCount }} 次</span>
          </div>
          <p class="q-text">{{ item.question.question }}</p>
          <div class="item-footer">
            <span class="last-wrong">最近错误：{{ formatDate(item.lastWrongAt) }}</span>
            <button v-if="!item.mastered" class="btn btn-primary btn-sm" @click="markMastered(item.id)">标记已掌握</button>
            <button class="btn btn-outline btn-sm" @click="handleRemove(item.id)">移除</button>
          </div>
        </div>
      </div>
      <EmptyState v-else icon="📝" title="错题本为空" description="做错的题目会自动加入错题本" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getErrorBook, removeFromErrorBook, markErrorMastered } from '@/api/progress'
import type { ErrorBookItem } from '@/types'

const items = ref<ErrorBookItem[]>([])

function typeLabel(t: string) { const m: Record<string,string> = { single:'单选', multiple:'多选', judge:'判断', fill:'填空' }; return m[t]??t }
function diffLabel(d: string) { const m: Record<string,string> = { easy:'简单', medium:'中等', hard:'困难' }; return m[d]??d }

async function load() {
  try {
    const res = await getErrorBook()
    items.value = res.data.data.items
  } catch {}
}

async function handleRemove(id: string) {
  try { await removeFromErrorBook(id); await load() } catch { alert('操作失败') }
}

async function markMastered(id: string) {
  try { await markErrorMastered(id); await load() } catch { alert('操作失败') }
}

function formatDate(d: string) { return new Date(d).toLocaleDateString('zh-CN') }

onMounted(() => load())
</script>

<style scoped>
.page { max-width: 800px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 20px; }
.error-item { margin-bottom: 12px; }
.error-item.mastered { opacity: 0.6; }
.item-header { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; font-size: 12px; }
.q-diff { font-weight: 500; }
.diff-easy { color: #137333; } .diff-medium { color: #ea8600; } .diff-hard { color: #c5221f; }
.mastered-tag { color: #137333; }
.wrong-count { color: #c5221f; }
.q-text { font-size: 14px; margin-bottom: 8px; }
.item-footer { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--color-text-muted); }
.last-wrong { flex: 1; }
</style>
