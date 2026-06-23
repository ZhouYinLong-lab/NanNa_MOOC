<template>
  <AppLayout>
    <div class="page">
      <h1>题库管理</h1>
      <div class="toolbar">
        <button class="btn btn-primary btn-sm" @click="showEditor = true">+ 添加题目</button>
        <select v-model="filterType" class="input" style="width:120px" @change="load">
          <option value="">全部类型</option>
          <option value="single">单选题</option>
          <option value="multiple">多选题</option>
          <option value="judge">判断题</option>
          <option value="fill">填空题</option>
        </select>
        <select v-model="filterDifficulty" class="input" style="width:120px" @change="load">
          <option value="">全部难度</option>
          <option value="easy">简单</option>
          <option value="medium">中等</option>
          <option value="hard">困难</option>
        </select>
      </div>
      <div v-if="questions.length>0">
        <div v-for="q in questions" :key="q.id" class="question-item card">
          <div class="q-header">
            <span class="q-type">{{ typeLabel(q.type) }}</span>
            <span class="q-diff" :class="`diff-${q.difficulty}`">{{ diffLabel(q.difficulty) }}</span>
            <span class="q-tags" v-if="q.tags">{{ q.tags.join(', ') }}</span>
            <div>
              <button class="btn btn-outline btn-sm" @click="editQuestion(q)">编辑</button>
              <button class="btn btn-danger btn-sm" @click="handleDelete(q.id)">删除</button>
            </div>
          </div>
          <p class="q-text">{{ q.question }}</p>
        </div>
      </div>
      <EmptyState v-else title="题库为空" description="点击上方按钮添加题目" />

      <!-- Question Editor Modal (simplified) -->
      <div v-if="showEditor" class="modal-overlay" @click.self="showEditor = false">
        <div class="modal">
          <div class="modal-header"><h3>{{ editingId ? '编辑题目' : '添加题目' }}</h3><button class="btn btn-outline btn-sm" @click="showEditor=false">✕</button></div>
          <div class="modal-body">
            <form @submit.prevent="saveQuestion" class="form">
              <div class="form-group"><label>类型</label><select v-model="editForm.type" class="input"><option value="single">单选题</option><option value="multiple">多选题</option><option value="judge">判断题</option><option value="fill">填空题</option></select></div>
              <div class="form-group"><label>题目</label><textarea v-model="editForm.question" class="input" rows="3" required></textarea></div>
              <div class="form-group"><label>选项（每行一个）</label><textarea v-model="optionsText" class="input" rows="4" v-if="editForm.type!=='fill'"></textarea></div>
              <div class="form-group"><label>答案</label><input v-model="editForm.answer" class="input" /></div>
              <div class="form-group"><label>解析</label><textarea v-model="editForm.analysis" class="input" rows="2"></textarea></div>
              <div class="form-group"><label>难度</label><select v-model="editForm.difficulty" class="input"><option value="easy">简单</option><option value="medium">中等</option><option value="hard">困难</option></select></div>
              <button type="submit" class="btn btn-primary">保存</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getQuestionBank, createQuestion, updateQuestion, deleteQuestion } from '@/api/progress'
import type { QuestionItem } from '@/types'

const questions = ref<QuestionItem[]>([])
const filterType = ref('')
const filterDifficulty = ref('')
const showEditor = ref(false)
const editingId = ref<string | null>(null)
const optionsText = ref('')

const editForm = reactive<Partial<QuestionItem>>({
  type: 'single', question: '', answer: '', analysis: '', difficulty: 'medium',
})

function typeLabel(t: string) { const m: Record<string,string> = { single:'单选', multiple:'多选', judge:'判断', fill:'填空' }; return m[t]??t }
function diffLabel(d: string) { const m: Record<string,string> = { easy:'简单', medium:'中等', hard:'困难' }; return m[d]??d }

async function load() {
  try {
    const res = await getQuestionBank({ type: filterType.value || undefined, difficulty: filterDifficulty.value || undefined })
    questions.value = res.data.data.items
  } catch {}
}

async function saveQuestion() {
  const data = { ...editForm }
  if (editForm.type !== 'fill') {
    data.options = optionsText.value.split('\n').filter(o => o.trim())
  }
  try {
    if (editingId.value) {
      await updateQuestion(editingId.value, data)
    } else {
      await createQuestion(data)
    }
    showEditor.value = false
    await load()
  } catch { alert('保存失败') }
}

function editQuestion(q: QuestionItem) {
  editingId.value = q.id
  Object.assign(editForm, q)
  optionsText.value = q.options?.join('\n') ?? ''
  showEditor.value = true
}

async function handleDelete(id: string) {
  if (!confirm('确定删除？')) return
  try { await deleteQuestion(id); await load() } catch { alert('删除失败') }
}

onMounted(() => load())
</script>

<style scoped>
.page { max-width: 900px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 16px; }
.toolbar { display: flex; gap: 8px; margin-bottom: 16px; }
.question-item { margin-bottom: 12px; }
.q-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 12px; }
.q-text { font-size: 14px; }
.diff-easy { color: #137333; } .diff-medium { color: #ea8600; } .diff-hard { color: #c5221f; }
.modal-overlay { position: fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
.modal { background:var(--color-bg-white); border-radius:var(--radius-lg); width:600px; max-width:90vw; max-height:80vh; overflow-y:auto; }
.modal-header { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--color-border-light); }
.modal-body { padding:20px; }
.form { display:flex; flex-direction:column; gap:14px; }
.form-group { display:flex; flex-direction:column; gap:4px; }
.form-group label { font-size:13px; font-weight:500; }
</style>
