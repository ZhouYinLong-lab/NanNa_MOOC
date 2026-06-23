<template>
  <AppLayout>
    <div class="page">
      <h1>教师审批</h1>
      <div class="filters">
        <button v-for="f in filters" :key="f.value" class="btn" :class="activeFilter===f.value?'btn-primary':'btn-outline'" @click="setFilter(f.value)">{{ f.label }}</button>
      </div>
      <table class="data-table" v-if="applications.length>0">
        <thead><tr><th>申请人</th><th>邮箱</th><th>申请理由</th><th>状态</th><th>申请时间</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="a in applications" :key="a.id">
            <td>{{ a.displayName }}</td><td>{{ a.email }}</td><td>{{ a.reason }}</td>
            <td><span :class="`status-${a.status}`">{{ statusLabel(a.status) }}</span></td>
            <td>{{ formatDate(a.appliedAt) }}</td>
            <td v-if="a.status==='pending'">
              <button class="btn btn-primary btn-sm" @click="approve(a.id, true)">通过</button>
              <button class="btn btn-danger btn-sm" @click="approve(a.id, false)">拒绝</button>
            </td>
            <td v-else>-</td>
          </tr>
        </tbody>
      </table>
      <EmptyState v-else title="暂无申请" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getTeacherApplications, approveTeacherApplication } from '@/api/user'
import type { TeacherApplication } from '@/types'

const applications = ref<TeacherApplication[]>([])
const activeFilter = ref('pending')
const filters = [{ label: '待审批', value: 'pending' }, { label: '已通过', value: 'approved' }, { label: '已拒绝', value: 'rejected' }]

function statusLabel(s: string) { const m: Record<string,string> = { pending: '待审批', approved: '已通过', rejected: '已拒绝' }; return m[s]??s }

async function load() {
  try {
    const res = await getTeacherApplications({ status: activeFilter.value })
    applications.value = res.data.data.items
  } catch {}
}

async function approve(id: string, approved: boolean) {
  try {
    await approveTeacherApplication(id, approved)
    await load()
  } catch { alert('操作失败') }
}

function setFilter(v: string) { activeFilter.value = v; load() }
function formatDate(d: string) { return new Date(d).toLocaleDateString('zh-CN') }

onMounted(() => load())
</script>

<style scoped>
.page { max-width: 900px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 16px; }
.filters { display: flex; gap: 8px; margin-bottom: 16px; }
.data-table { width: 100%; border-collapse: collapse; background: var(--color-bg-white); border: 1px solid var(--color-border-light); border-radius: var(--radius-md); overflow: hidden; }
.data-table th, .data-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--color-border-light); font-size: 13px; }
.data-table th { background: var(--color-bg); font-weight: 600; }
.status-pending { color: #ea8600; }
.status-approved { color: #137333; }
.status-rejected { color: #c5221f; }
</style>
