<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
    <router-link to="/" class="btn btn-primary">回到首页</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 12px;
}
.not-found h1 { font-size: 64px; color: var(--color-text-muted); }
.not-found p { font-size: 16px; color: var(--color-text-secondary); }
</style>
