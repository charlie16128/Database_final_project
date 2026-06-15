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
.form-page { display: flex; justify-content: center; padding: 1rem 0; }
.form-card {
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 2rem 2rem 2.5rem;
  width: 100%; max-width: 560px;
}
.form-title { font-size: 1.5rem; font-weight: 800; color: #2d6a4f; margin-bottom: 1.5rem; }
.global-error {
  background: #fff0f0; color: #e63946;
  border: 1px solid #ffc0c4; border-radius: 0.5rem;
  padding: 0.6rem 0.9rem; font-size: 0.87rem; margin-bottom: 1rem;
}
.state-box {
  display: flex; justify-content: center; padding: 3rem;
}
.loader {
  width: 36px; height: 36px;
  border: 3px solid #e8f5ee; border-top-color: #52b788;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
