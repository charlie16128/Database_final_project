<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()
// 登入/註冊頁不需要 Navbar，也不需要 main 容器限制
const isAuthPage = computed(() =>
  ['/login', '/register'].includes(route.path)
)
</script>

<template>
  <Navbar v-if="!isAuthPage" />
  <main :class="isAuthPage ? '' : 'main-content'">
    <RouterView />
  </main>
</template>

<style>
/* ── Global Reset & Base ─────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', 'Noto Sans TC', sans-serif;
  background: #f5f9f6;
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
}

.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
}

a { color: inherit; }

.placeholder-view {
  padding: 3rem 1rem;
  text-align: center;
  color: #999;
  font-size: 1.1rem;
}
</style>
