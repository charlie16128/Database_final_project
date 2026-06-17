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
  max-width: 460px;
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

/* Fields */
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

.field.error input {
  border-color: var(--accent-color);
}

.field-error {
  display: block;
  min-height: 1.2rem;
  font-size: 0.82rem;
  color: var(--accent-color);
  margin-top: 0.5rem;
  font-weight: 600;
}

/* Button */
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

/* Spinner */
.spinner {
  width: 20px; height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Error banner */
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

/* Footer */
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
