<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, logout, isLoggedIn } from '../services/authService.js'

const router = useRouter()
const loggedIn = ref(isLoggedIn())
const user = ref(getUser())
const menuOpen = ref(false)

// 每次路由切換後重新確認登入狀態
router.afterEach(() => {
  loggedIn.value = isLoggedIn()
  user.value = getUser()
  menuOpen.value = false
})

function handleLogout() {
  logout()
  loggedIn.value = false
  user.value = null
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-inner">
      <!-- Logo -->
      <router-link to="/" class="nav-logo">
        🐾 <span>循環寵物</span>
      </router-link>

      <!-- Hamburger (mobile) -->
      <button
        class="hamburger"
        :class="{ open: menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="Toggle menu"
      >
        <span></span><span></span><span></span>
      </button>

      <!-- Links -->
      <div class="nav-links" :class="{ open: menuOpen }">
        <router-link to="/items">商品列表</router-link>
        <router-link to="/guides">永續指南</router-link>
        <router-link to="/analytics">數據看板</router-link>

        <template v-if="loggedIn">
          <router-link to="/items/new">刊登商品</router-link>
          <router-link to="/my-items">我的商品</router-link>
          <router-link to="/messages">私訊</router-link>
          <div class="nav-divider"></div>
          <span class="nav-username">{{ user?.username }}</span>
          <button class="btn-logout" @click="handleLogout">登出</button>
        </template>

        <template v-else>
          <router-link to="/login" class="btn-login">登入</router-link>
          <router-link to="/register" class="btn-register">註冊</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.nav-logo {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--primary-dark);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.nav-logo span { 
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Links container */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-links a {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 1rem;
  color: var(--text-main);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}
.nav-links a:hover,
.nav-links a.router-link-active {
  background: var(--bg-color);
  color: var(--primary-color);
  font-weight: 700;
}

.nav-divider { width: 1px; height: 24px; background: var(--border-color); margin: 0 0.5rem; }

.nav-username {
  font-size: 0.95rem;
  color: var(--text-main);
  font-weight: 700;
  padding: 0 0.5rem;
  border-bottom: 2px solid var(--secondary-color);
}

/* Auth buttons */
.btn-login {
  color: var(--primary-color) !important;
  border: 2px solid var(--primary-color) !important;
}
.btn-login:hover { background: var(--bg-color) !important; }

.btn-register {
  background: var(--primary-color) !important;
  color: #fff !important;
}
.btn-register:hover { background: var(--primary-dark) !important; transform: translateY(-1px); }

.btn-logout {
  padding: 0.5rem 1rem;
  background: #fff;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-logout:hover { border-color: var(--accent-color); color: var(--accent-color); background: #fff8f8; }

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}
.hamburger span {
  width: 2rem;
  height: 0.25rem;
  background: var(--primary-dark);
  border-radius: 10px;
  transition: all 0.3s linear;
  position: relative;
  transform-origin: 1px;
}
.hamburger.open span:nth-child(1) { transform: rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: translateX(20px); }
.hamburger.open span:nth-child(3) { transform: rotate(-45deg); }

/* RWD */
@media (max-width: 900px) {
  .hamburger { display: flex; }

  .nav-links {
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 260px;
    background: white;
    box-shadow: -5px 0 15px rgba(0,0,0,0.05);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 1.5rem;
    transition: all 0.3s ease-in-out;
  }
  .nav-links.open { display: flex; }
  .nav-divider { display: none; }
  .nav-username { margin-bottom: 1rem; }
}
</style>
