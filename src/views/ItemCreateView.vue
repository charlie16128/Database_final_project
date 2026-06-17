<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ItemForm from '../components/ItemForm.vue'
import { createItem } from '../services/itemService.js'

const router  = useRouter()
const loading = ref(false)
const error   = ref('')

async function handleSubmit(formData) {
  loading.value = true
  error.value   = ''
  try {
    const item = await createItem(formData)
    router.push(`/items/${item.id}`)
  } catch (e) {
    error.value = e.message
    loading.value = false
  }
}
</script>

<template>
  <div class="form-page">
    <div class="form-card">
      <h1 class="form-title">🐾 刊登商品</h1>
      <p class="form-sub">讓閒置的寵物用品找到新的家</p>

      <p v-if="error" class="global-error">{{ error }}</p>

      <ItemForm :loading="loading" @submit="handleSubmit" />
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
  margin-bottom: 0.5rem; 
}

.form-sub { 
  color: var(--text-light); 
  font-size: 1rem; 
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

@media (max-width: 600px) {
  .form-page { padding: 1.5rem 1rem; }
  .form-card { padding: 1.5rem; }
  .form-title { font-size: 1.7rem; }
}
</style>
