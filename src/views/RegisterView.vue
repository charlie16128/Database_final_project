<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/authService.js'

const router = useRouter()

const form = ref({ username: '', email: '', password: '', confirm: '' })
const error = ref('')
const loading = ref(false)

const rules = {
  username: v => v.trim() ? '' : '請輸入使用者名稱',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : '請輸入有效的 Email',
  password: v => v.length >= 6 ? '' : '密碼長度至少 6 碼',
  confirm: v => v === form.value.password ? '' : '兩次密碼不相同',
}

const fieldErrors = ref({ username: '', email: '', password: '', confirm: '' })

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
  if (!validateAll()) return
  loading.value = true
  try {
    await register({
      username: form.value.username.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
    })
    router.push('/login?registered=1')
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
      <h1 class="auth-title">建立帳號</h1>
      <p class="auth-sub">加入寵物用品循環平台</p>

      <form @submit.prevent="handleSubmit" novalidate>
        <!-- 使用者名稱 -->
        <div class="field" :class="{ error: fieldErrors.username }">
          <label for="reg-username">使用者名稱</label>
          <input
            id="reg-username"
            v-model="form.username"
            type="text"
            placeholder="請輸入使用者名稱"
            autocomplete="username"
            @blur="validateField('username')"
          />
          <span class="field-error">{{ fieldErrors.username }}</span>
        </div>

        <!-- Email -->
        <div class="field" :class="{ error: fieldErrors.email }">
          <label for="reg-email">Email</label>
          <input
            id="reg-email"
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
          <label for="reg-password">密碼</label>
          <input
            id="reg-password"
            v-model="form.password"
            type="password"
            placeholder="至少 6 碼"
            autocomplete="new-password"
            @blur="validateField('password')"
          />
          <span class="field-error">{{ fieldErrors.password }}</span>
        </div>

        <!-- 確認密碼 -->
        <div class="field" :class="{ error: fieldErrors.confirm }">
          <label for="reg-confirm">確認密碼</label>
          <input
            id="reg-confirm"
            v-model="form.confirm"
            type="password"
            placeholder="再輸入一次密碼"
            autocomplete="new-password"
            @blur="validateField('confirm')"
          />
          <span class="field-error">{{ fieldErrors.confirm }}</span>
        </div>

        <!-- 全域錯誤 -->
        <p v-if="error" class="global-error">{{ error }}</p>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? '處理中…' : '立即註冊' }}
        </button>
      </form>

      <p class="auth-footer">
        已有帳號？
        <router-link to="/login">前往登入</router-link>
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
  max-width: 420px;
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

/* Fields */
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

.field.error input {
  border-color: #e63946;
}

.field-error {
  display: block;
  min-height: 1.1rem;
  font-size: 0.78rem;
  color: #e63946;
  margin-top: 0.25rem;
}

/* Button */
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

/* Spinner */
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Error banner */
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

/* Footer */
.auth-footer { margin-top: 1.5rem; font-size: 0.88rem; color: #777; }
.auth-footer a { color: #40916c; font-weight: 600; text-decoration: none; }
.auth-footer a:hover { text-decoration: underline; }
</style>
