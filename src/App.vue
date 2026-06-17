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

:root {
  --primary-color: #52b788;
  --primary-dark: #2d6a4f;
  --secondary-color: #b7e4c7;
  --accent-color: #ff9f1c; /* 活力橘，代表寵物 */
  --bg-color: #f8fbfa;
  --card-bg: #ffffff;
  --text-main: #2d3436;
  --text-light: #636e72;
  --border-color: #e8f5ee;
  --error-color: #e76f51;
  --success-color: #40916c;
}

body {
  font-family: 'Inter', 'Noto Sans TC', system-ui, -apple-system, sans-serif;
  background: var(--bg-color);
  color: var(--text-main);
  line-height: 1.6;
  min-height: 100vh;
}

.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
  min-height: calc(100vh - 62px);
}

a { 
  color: inherit; 
  text-decoration: none;
  transition: color 0.2s ease;
}

button {
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

/* ── Common Components ───────────────────────────────────── */
.btn-primary {
  background: var(--primary-color);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.card {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.placeholder-view {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text-light);
  font-size: 1.1rem;
}
</style>
