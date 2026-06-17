<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '../services/authService.js'

const router = useRouter()
const route  = useRoute()

const form    = ref({ email: '', password: '' })
const error   = ref('')
const loading = ref(false)
const success  = ref(route.query.registered === '1')

const fieldErrors = ref({ email: '', password: '' })

const rules = {
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : '請輸入有效的 Email',
  password: v => v.length > 0 ? '' : '請輸入密碼',
}

function validateField(field) {
  fieldErrors.value[field] = rules[field](form.value[field])
}

function validateAll() {
  let valid = true
  for (const key of Object.keys(rules)) {
    fieldErrors.value[key] = rules[key](form.value[key])
    if (fieldErrors.value[key]) valid = false
  }
  return valid
}

async function handleSubmit() {
  error.value = ''
  success.value = false
  if (!validateAll()) return
  loading.value = true
  try {
    await login({ email: form.value.email.trim(), password: form.value.password })
    // 若有 redirect 參數則跳回原頁面，否則到首頁
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">🐾</div>
      <h1 class="auth-title">歡迎回來</h1>
      <p class="auth-sub">登入寵物用品循環平台</p>

      <!-- 來自註冊頁的成功提示 -->
      <p v-if="success" class="global-success">✅ 註冊成功！請登入繼續使用。</p>

      <form @submit.prevent="handleSubmit" novalidate>
        <!-- Email -->
        <div class="field" :class="{ error: fieldErrors.email }">
          <label for="login-email">Email</label>
          <input
            id="login-email"
            v-model="form.email"
            type="email"
            placeholder="example@mail.com"
            autocomplete="email"
            @blur="validateField('email')"
          />
          <span class="field-error">{{ fieldErrors.email }}</span>
        </div>

        <!-- 密碼 -->
        <div class="field" :class="{ error: fieldErrors.password }">
          <label for="login-password">密碼</label>
          <input
            id="login-password"
            v-model="form.password"
            type="password"
            placeholder="請輸入密碼"
            autocomplete="current-password"
            @blur="validateField('password')"
          />
          <span class="field-error">{{ fieldErrors.password }}</span>
        </div>

        <!-- 全域錯誤 -->
        <p v-if="error" class="global-error">{{ error }}</p>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? '登入中…' : '登入' }}
        </button>
      </form>

      <p class="auth-footer">
        還沒有帳號？
        <router-link to="/register">立即註冊</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  padding: 2rem;
}

.auth-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
  padding: 3.5rem 2.5rem;
  width: 100%;
  max-width: 440px;
  text-align: center;
  border: 1px solid var(--border-color);
}

.auth-logo { font-size: 4rem; margin-bottom: 1.25rem; }

.auth-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
}

.auth-sub { color: var(--text-light); margin-bottom: 2.5rem; font-size: 1.05rem; }

.field {
  text-align: left;
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.6rem;
}

.field input {
  width: 100%;
  padding: 0.9rem 1.1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1.05rem;
  transition: all 0.2s;
  outline: none;
  color: var(--text-main);
}

.field input:focus {
  border-color: var(--primary-color);
  background: #fdfdfd;
  box-shadow: 0 0 0 4px rgba(82, 183, 136, 0.1);
}

.field.error input { border-color: var(--accent-color); }

.field-error {
  display: block;
  min-height: 1.2rem;
  font-size: 0.82rem;
  color: var(--accent-color);
  margin-top: 0.5rem;
  font-weight: 600;
}

.btn-primary {
  width: 100%;
  padding: 1.1rem;
  margin-top: 1rem;
  background: var(--primary-color);
  color: #fff;
  font-size: 1.15rem;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.2s;
}
.btn-primary:hover:not(:disabled) { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(82, 183, 136, 0.3); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.spinner {
  width: 20px; height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.global-error {
  background: #fff8f8;
  color: var(--accent-color);
  border: 1px solid #ffeded;
  border-radius: 10px;
  padding: 0.8rem 1rem;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.global-success {
  background: var(--bg-color);
  color: var(--primary-color);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.8rem 1rem;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.auth-footer { 
  margin-top: 2.5rem; 
  font-size: 1rem; 
  color: var(--text-light); 
}
.auth-footer a { 
  color: var(--primary-color); 
  font-weight: 700; 
  text-decoration: none; 
  margin-left: 0.5rem;
}
.auth-footer a:hover { text-decoration: underline; }
</style>
