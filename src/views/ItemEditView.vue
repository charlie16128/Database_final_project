<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemForm from '../components/ItemForm.vue'
import { fetchItem, updateItem } from '../services/itemService.js'
import { getUser } from '../services/authService.js'

const route  = useRoute()
const router = useRouter()

const item    = ref(null)
const loading = ref(false)
const fetching = ref(true)
const error   = ref('')

async function loadItem() {
  try {
    const data = await fetchItem(route.params.id)
    // 確認是商品擁有者
    const me = getUser()
    if (!me || data.user_id !== me.id) {
      router.replace('/')
      return
    }
    item.value = data
  } catch (e) {
    error.value = e.message
  } finally {
    fetching.value = false
  }
}

async function handleSubmit(formData) {
  loading.value = true
  error.value   = ''
  try {
    await updateItem(item.value.id, formData)
    router.push(`/items/${item.value.id}`)
  } catch (e) {
    error.value = e.message
    loading.value = false
  }
}

onMounted(loadItem)
</script>

<template>
  <div class="form-page">
    <div class="form-card">
      <h1 class="form-title">✏️ 修改商品</h1>

      <div v-if="fetching" class="state-box"><div class="loader"></div></div>
      <div v-else-if="error && !item" class="global-error">{{ error }}</div>

      <template v-else-if="item">
        <p v-if="error" class="global-error">{{ error }}</p>
        <ItemForm
          :is-edit="true"
          :initial-data="item"
          :loading="loading"
          @submit="handleSubmit"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.form-page { 
  display: flex; 
  justify-content: center; 
  padding: 3rem 1.5rem; 
  background: var(--bg-color);
  min-height: calc(100vh - 80px);
}

.form-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.05);
  padding: 2.5rem;
  width: 100%; 
  max-width: 600px;
  border: 1px solid var(--border-color);
}

.form-title { 
  font-size: 2rem; 
  font-weight: 800; 
  color: var(--primary-dark); 
  margin-bottom: 2.5rem; 
}

.global-error {
  background: #fff8f8; 
  color: var(--accent-color);
  border: 1px solid #ffeded; 
  border-radius: 12px;
  padding: 1rem; 
  font-size: 0.95rem; 
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.state-box {
  display: flex; 
  justify-content: center; 
  padding: 5rem;
}

.loader {
  width: 40px; 
  height: 40px;
  border: 4px solid var(--bg-color); 
  border-top-color: var(--primary-color);
  border-radius: 50%; 
  animation: spin 0.8s linear infinite;
}

@keyframes spin { 
  to { transform: rotate(360deg); } 
}

@media (max-width: 600px) {
  .form-page { padding: 1.5rem 1rem; }
  .form-card { padding: 1.5rem; }
  .form-title { font-size: 1.7rem; margin-bottom: 1.5rem; }
}
</style>
