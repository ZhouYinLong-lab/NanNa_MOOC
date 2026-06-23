<template>
  <AppLayout>
    <div class="page">
      <h1>用户管理</h1>
      <div class="toolbar">
        <input v-model="keyword" class="input search-input" placeholder="搜索用户..." @keyup.enter="search" />
        <select v-model="roleFilter" class="input filter-select" @change="search">
          <option value="">全部角色</option>
          <option value="admin">管理员</option>
          <option value="teacher">教师</option>
          <option value="assistant">助教</option>
          <option value="student">学生</option>
        </select>
        <button class="btn btn-primary btn-sm" @click="search">搜索</button>
      </div>
      <table class="data-table" v-if="users.length > 0">
        <thead>
          <tr>
            <th>用户名</th><th>显示名</th><th>角色</th><th>邮箱</th><th>注册时间</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.username }}</td>
            <td>{{ u.displayName }}</td>
            <td><RoleBadge :role="u.role" /></td>
            <td>{{ u.email }}</td>
            <td>{{ formatDate(u.createdAt) }}</td>
            <td>
              <select v-model="roleEdits[u.id]" class="input" style="width:100px" @change="updateRole(u.id)">
                <option value="admin">管理员</option>
                <option value="teacher">教师</option>
                <option value="assistant">助教</option>
                <option value="student">学生</option>
              </select>
              <button class="btn btn-danger btn-sm" @click="handleDelete(u.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <EmptyState v-else title="暂无用户数据" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import RoleBadge from '@/components/common/RoleBadge.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getUsers, updateUserRole, deleteUser } from '@/api/user'
import type { User } from '@/types'

const users = ref<User[]>([])
const keyword = ref('')
const roleFilter = ref('')
const roleEdits = reactive<Record<string, string>>({})

async function search() {
  try {
    const res = await getUsers({ keyword: keyword.value || undefined, role: roleFilter.value || undefined })
    users.value = res.data.data.items
    users.value.forEach(u => { roleEdits[u.id] = u.role })
  } catch { /* ignore */ }
}

async function updateRole(userId: string) {
  try {
    await updateUserRole(userId, roleEdits[userId])
  } catch { alert('修改失败') }
}

async function handleDelete(userId: string) {
  if (!confirm('确定删除此用户？')) return
  try {
    await deleteUser(userId)
    users.value = users.value.filter(u => u.id !== userId)
  } catch { alert('删除失败') }
}

function formatDate(d: string) { return new Date(d).toLocaleDateString('zh-CN') }

onMounted(() => search())
</script>

<style scoped>
.page { max-width: 1100px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 16px; }
.toolbar { display: flex; gap: 8px; margin-bottom: 16px; }
.search-input { width: 240px; }
.filter-select { width: 120px; }
.data-table { width: 100%; border-collapse: collapse; background: var(--color-bg-white); border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border-light); }
.data-table th, .data-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--color-border-light); font-size: 13px; }
.data-table th { background: var(--color-bg); font-weight: 600; }
.data-table td { vertical-align: middle; }
.data-table td .input, .data-table td .btn { display: inline-block; margin-right: 4px; }
</style>
