<template>
  <AppLayout>
    <div class="page">
      <h1>个人设置</h1>
      <div class="card">
        <div class="profile-info" v-if="user">
          <div class="avatar-lg">{{ userInitial }}</div>
          <div class="info">
            <h3>{{ user.displayName }}</h3>
            <p>@{{ user.username }}</p>
            <p>{{ user.email }}</p>
            <RoleBadge :role="user.role" />
          </div>
        </div>
      </div>
      <div class="card" style="margin-top:16px">
        <h3>修改密码</h3>
        <form @submit.prevent="changePassword" class="form">
          <div class="form-group"><label>当前密码</label><input v-model="oldPw" type="password" class="input" /></div>
          <div class="form-group"><label>新密码</label><input v-model="newPw" type="password" class="input" /></div>
          <div class="form-group"><label>确认新密码</label><input v-model="confirmPw" type="password" class="input" /></div>
          <button type="submit" class="btn btn-primary">修改密码</button>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import RoleBadge from '@/components/common/RoleBadge.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const userInitial = computed(() => user.value?.displayName?.charAt(0).toUpperCase() ?? '?')
const oldPw = ref('')
const newPw = ref('')
const confirmPw = ref('')

function changePassword() {
  if (newPw.value !== confirmPw.value) { alert('两次密码不一致'); return }
  alert('密码修改功能需对接后端')
}
</script>

<style scoped>
.page { max-width: 600px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 20px; }
.profile-info { display: flex; gap: 16px; align-items: center; }
.avatar-lg { width: 64px; height: 64px; border-radius: 50%; background: var(--color-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; }
.info h3 { margin-bottom: 4px; }
.info p { font-size: 13px; color: var(--color-text-secondary); }
.form { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 13px; font-weight: 500; }
</style>
