<template>
  <AppLayout>
    <div class="page">
      <h1>题库练习</h1>
      <div class="filters">
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
        <button class="btn btn-primary btn-sm" @click="startPractice">开始练习</button>
      </div>

      <!-- Practice Mode -->
      <div v-if="practicing && currentQuestion" class="card practice-card">
        <div class="q-header">
          <span>第 {{ currentIndex + 1 }} / {{ questions.length }} 题</span>
          <span class="q-diff" :class="`diff-${currentQuestion.difficulty}`">{{ diffLabel(currentQuestion.difficulty) }}</span>
          <span>{{ typeLabel(currentQuestion.type) }}</span>
        </div>
        <div class="q-body">
          <h3>{{ currentQuestion.question }}</h3>
          <div v-if="currentQuestion.options" class="options">
            <label v-for="(opt, idx) in currentQuestion.options" :key="idx" class="option" :class="optionClass(idx)">
              <input
                :type="currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'"
                :value="idx"
                v-model="selectedAnswers"
                :disabled="submitted"
                @change="onOptionChange(idx)"
              />
              <span>{{ String.fromCharCode(65 + idx) }}. {{ opt }}</span>
            </label>
          </div>
          <div v-else class="fill-input">
            <input v-model="fillAnswer" class="input" placeholder="请输入答案" :disabled="submitted" />
          </div>

          <div v-if="submitted" class="result" :class="isCorrect ? 'result-correct' : 'result-wrong'">
            <p>{{ isCorrect ? '✅ 回答正确！' : `❌ 回答错误。正确答案：${correctAnswerStr}` }}</p>
            <p v-if="currentQuestion.analysis" class="analysis">解析：{{ currentQuestion.analysis }}</p>
          </div>
        </div>
        <div class="q-footer">
          <button v-if="!submitted" class="btn btn-primary" :disabled="!canSubmit" @click="submitAnswer">提交</button>
          <button v-else class="btn btn-primary" @click="nextQuestion">{{ isLast ? '完成' : '下一题' }}</button>
        </div>
      </div>

      <!-- Question List -->
      <div v-if="!practicing && questions.length > 0">
        <div v-for="q in questions" :key="q.id" class="question-item card">
          <span class="q-type">{{ typeLabel(q.type) }}</span>
          <span class="q-diff" :class="`diff-${q.difficulty}`">{{ diffLabel(q.difficulty) }}</span>
          <span>{{ q.question.slice(0, 80) }}...</span>
        </div>
      </div>
      <EmptyState v-if="!practicing && questions.length === 0" title="暂无题目" description="请选择题型与难度后开始练习" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getQuestionBank, addToErrorBook } from '@/api/progress'
import type { QuestionItem } from '@/types'

const filterType = ref('')
const filterDifficulty = ref('')
const questions = ref<QuestionItem[]>([])
const practicing = ref(false)
const currentIndex = ref(0)
const selectedAnswers = ref<number[]>([])
const fillAnswer = ref('')
const submitted = ref(false)

const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)
const isLast = computed(() => currentIndex.value >= questions.value.length - 1)
const isCorrect = computed(() => {
  if (!currentQuestion.value || !submitted.value) return false
  if (currentQuestion.value.type === 'fill') {
    return fillAnswer.value.trim() === (currentQuestion.value.answer as string).trim()
  }
  if (currentQuestion.value.type === 'multiple') {
    const correct = (currentQuestion.value.answer as string[]).map(Number).sort().join(',')
    return selectedAnswers.value.sort().join(',') === correct
  }
  return selectedAnswers.value[0] === Number(currentQuestion.value.answer)
})
const correctAnswerStr = computed(() => {
  if (!currentQuestion.value) return ''
  const answer = currentQuestion.value.answer
  if (typeof answer === 'string') return answer
  if (Array.isArray(answer)) {
    if (currentQuestion.value.options) {
      return answer.map((a: string) => String.fromCharCode(65 + Number(a))).join(', ')
    }
    return answer.join(', ')
  }
  return String(answer)
})
const canSubmit = computed(() => {
  if (!currentQuestion.value) return false
  if (currentQuestion.value.type === 'fill') return fillAnswer.value.trim().length > 0
  return selectedAnswers.value.length > 0
})

function typeLabel(t: string) { const m: Record<string,string> = { single:'单选', multiple:'多选', judge:'判断', fill:'填空' }; return m[t]??t }
function diffLabel(d: string) { const m: Record<string,string> = { easy:'简单', medium:'中等', hard:'困难' }; return m[d]??d }

function optionClass(idx: number) {
  if (!submitted.value || !currentQuestion.value) return ''
  const answer = currentQuestion.value.answer
  const isCorrectOpt = typeof answer === 'string' ? Number(answer) === idx
    : Array.isArray(answer) ? answer.map(Number).includes(idx) : false
  const isSelected = selectedAnswers.value.includes(idx)
  if (isCorrectOpt) return 'option-correct'
  if (isSelected && !isCorrectOpt) return 'option-wrong'
  return ''
}

function onOptionChange(idx: number) {
  if (currentQuestion.value?.type !== 'multiple') {
    selectedAnswers.value = [idx]
  }
}

async function load() {
  try {
    const res = await getQuestionBank({ type: filterType.value || undefined, difficulty: filterDifficulty.value || undefined, pageSize: 50 })
    questions.value = res.data.data.items
  } catch {}
}

function startPractice() {
  load().then(() => {
    if (questions.value.length > 0) {
      practicing.value = true
      currentIndex.value = 0
      selectedAnswers.value = []
      fillAnswer.value = ''
      submitted.value = false
    }
  })
}

async function submitAnswer() {
  submitted.value = true
  if (!isCorrect.value && currentQuestion.value) {
    try {
      await addToErrorBook(currentQuestion.value.id,
        currentQuestion.value.type === 'fill' ? fillAnswer.value : selectedAnswers.value.map(String))
    } catch {}
  }
}

function nextQuestion() {
  if (isLast.value) {
    practicing.value = false
    return
  }
  currentIndex.value++
  selectedAnswers.value = []
  fillAnswer.value = ''
  submitted.value = false
}
</script>

<style scoped>
.page { max-width: 800px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 16px; }
.filters { display: flex; gap: 8px; margin-bottom: 16px; }
.question-item { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; font-size: 13px; padding: 12px; }
.practice-card { min-height: 300px; }
.q-header { display: flex; gap: 12px; font-size: 13px; color: var(--color-text-secondary); margin-bottom: 20px; }
.q-diff { font-weight: 500; }
.diff-easy { color: #137333; } .diff-medium { color: #ea8600; } .diff-hard { color: #c5221f; }
.q-body h3 { margin-bottom: 16px; font-size: 16px; }
.options { display: flex; flex-direction: column; gap: 10px; }
.option { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 1px solid var(--color-border-light); border-radius: var(--radius-sm); cursor: pointer; transition: background-color 0.15s; }
.option:hover { background-color: var(--color-bg); }
.option-correct { background-color: #e6f4ea; border-color: #137333; }
.option-wrong { background-color: #fce8e6; border-color: #c5221f; }
.fill-input { margin-top: 8px; }
.result { margin-top: 16px; padding: 12px; border-radius: var(--radius-sm); }
.result-correct { background-color: #e6f4ea; }
.result-wrong { background-color: #fce8e6; }
.analysis { font-size: 13px; margin-top: 4px; }
.q-footer { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
