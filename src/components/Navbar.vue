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
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e8f5ee;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.25rem;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* Logo */
.nav-logo {
  font-size: 1.2rem;
  font-weight: 800;
  color: #2d6a4f;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}
.nav-logo span { letter-spacing: -0.01em; }

/* Links container */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.nav-links a {
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #444;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.nav-links a:hover,
.nav-links a.router-link-active {
  background: #edfaf3;
  color: #2d6a4f;
  font-weight: 600;
}

.nav-divider { width: 1px; height: 22px; background: #ddd; margin: 0 0.25rem; }

.nav-username {
  font-size: 0.85rem;
  color: #555;
  padding: 0 0.25rem;
}

/* Auth buttons */
.btn-login {
  padding: 0.4rem 0.9rem !important;
  border: 1.5px solid #52b788 !important;
  color: #40916c !important;
  border-radius: 0.5rem;
  font-weight: 600 !important;
}
.btn-login:hover { background: #edfaf3 !important; }

.btn-register {
  padding: 0.4rem 0.9rem !important;
  background: linear-gradient(135deg, #52b788, #40916c) !important;
  color: #fff !important;
  border-radius: 0.5rem;
  font-weight: 600 !important;
}
.btn-register:hover { opacity: 0.88; }

.btn-logout {
  padding: 0.4rem 0.75rem;
  background: none;
  border: 1.5px solid #ddd;
  border-radius: 0.5rem;
  font-size: 0.87rem;
  color: #888;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.btn-logout:hover { border-color: #e63946; color: #e63946; }

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #444;
  border-radius: 2px;
  transition: transform 0.25s, opacity 0.2s;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* RWD */
@media (max-width: 768px) {
  .hamburger { display: flex; }

  .nav-links {
    display: none;
    position: absolute;
    top: 62px;
    left: 0; right: 0;
    background: #fff;
    border-top: 1px solid #e8f5ee;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.25rem;
    gap: 0.5rem;
  }
  .nav-links.open { display: flex; }
  .nav-divider { display: none; }
}
</style>
