<template>
  <AppLayout>
    <div class="page">
      <h1>Roadmap 管理</h1>
      <p class="desc">管理平台学习路线和推荐路径</p>
      <EmptyState title="功能开发中" description="Roadmap 管理功能将在后续版本中实现" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import EmptyState from '@/components/common/EmptyState.vue'
</script>

<style scoped>
.page { max-width: 800px; margin: 0 auto; padding: 24px; }
.page h1 { margin-bottom: 8px; }
.desc { color: var(--color-text-secondary); margin-bottom: 24px; }
</style>
