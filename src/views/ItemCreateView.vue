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
.form-page { display: flex; justify-content: center; padding: 1rem 0; }
.form-card {
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 2rem 2rem 2.5rem;
  width: 100%; max-width: 560px;
}
.form-title { font-size: 1.5rem; font-weight: 800; color: #2d6a4f; margin-bottom: 0.2rem; }
.form-sub   { color: #999; font-size: 0.88rem; margin-bottom: 1.5rem; }
.global-error {
  background: #fff0f0; color: #e63946;
  border: 1px solid #ffc0c4; border-radius: 0.5rem;
  padding: 0.6rem 0.9rem; font-size: 0.87rem; margin-bottom: 1rem;
}
</style>
