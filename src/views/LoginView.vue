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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0faf4 0%, #fdf6ec 100%);
  padding: 1.5rem;
}

.auth-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.10);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.auth-logo { font-size: 2.8rem; margin-bottom: 0.5rem; }

.auth-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #2d6a4f;
  margin-bottom: 0.25rem;
}

.auth-sub { color: #888; margin-bottom: 1.8rem; font-size: 0.9rem; }

.field {
  text-align: left;
  margin-bottom: 1rem;
}

.field label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 0.35rem;
}

.field input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1.5px solid #ddd;
  border-radius: 0.6rem;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.field input:focus {
  border-color: #52b788;
  box-shadow: 0 0 0 3px rgba(82, 183, 136, 0.18);
}

.field.error input { border-color: #e63946; }

.field-error {
  display: block;
  min-height: 1.1rem;
  font-size: 0.78rem;
  color: #e63946;
  margin-top: 0.25rem;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #52b788, #40916c);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s, transform 0.1s;
}
.btn-primary:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.global-error {
  background: #fff0f0;
  color: #e63946;
  border: 1px solid #ffc0c4;
  border-radius: 0.5rem;
  padding: 0.6rem 0.9rem;
  font-size: 0.87rem;
  text-align: left;
  margin-bottom: 0.75rem;
}

.global-success {
  background: #edfaf3;
  color: #2d6a4f;
  border: 1px solid #b7e4c7;
  border-radius: 0.5rem;
  padding: 0.6rem 0.9rem;
  font-size: 0.87rem;
  text-align: left;
  margin-bottom: 1rem;
}

.auth-footer { margin-top: 1.5rem; font-size: 0.88rem; color: #777; }
.auth-footer a { color: #40916c; font-weight: 600; text-decoration: none; }
.auth-footer a:hover { text-decoration: underline; }
</style>
