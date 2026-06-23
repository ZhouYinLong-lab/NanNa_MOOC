<template>
  <AppLayout>
    <div class="page">
      <h1>学生学习数据</h1>
      <div v-if="students.length > 0">
        <table class="data-table">
          <thead><tr><th>学生</th><th>进度</th><th>已完成节点</th><th>最后访问</th></tr></thead>
          <tbody>
            <tr v-for="s in students" :key="s.userId">
              <td>{{ s.userName }}</td>
              <td>
                <div class="progress-bar"><div class="progress-fill" :style="{width:s.overallProgress+'%'}"></div></div>
                <span>{{ s.overallProgress }}%</span>
              </td>
              <td>{{ s.completedNodes.length }} 个</td>
              <td>{{ s.lastAccessedAt ? formatDate(s.lastAccessedAt) : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-else title="暂无学生数据" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getStudentProgress } from '@/api/progress'
import type { StudentProgressRecord } from '@/types'

const route = useRoute()
const students = ref<StudentProgressRecord[]>([])

function formatDate(d: string) { return new Date(d).toLocaleDateString('zh-CN') }

onMounted(async () => {
  try {
    const res = await getStudentProgress(route.params.courseId as string)
    students.value = res.data.data
  } catch {}
})
</script>

<style scoped>
.page { max-width: 900px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 20px; }
.data-table { width: 100%; border-collapse: collapse; background: var(--color-bg-white); border: 1px solid var(--color-border-light); border-radius: var(--radius-md); overflow: hidden; }
.data-table th, .data-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--color-border-light); font-size: 13px; }
.data-table th { background: var(--color-bg); }
.progress-bar { width: 100px; height: 6px; background: var(--color-border-light); border-radius: 3px; display: inline-block; margin-right: 8px; vertical-align: middle; }
.progress-fill { height: 100%; background: var(--color-primary); border-radius: 3px; }
</style>
