<template>
  <div class="guide-edit-view">
    <h2>{{ isEdit ? '修改指南' : '新增指南' }}</h2>
    
    <div v-if="loading && isEdit" class="loading">載入中...</div>
    
    <form v-else @submit.prevent="handleSubmit" class="guide-form">
      <div class="form-group">
        <label>標題</label>
        <input v-model="form.title" type="text" placeholder="輸入指南標題" required />
      </div>

      <div class="form-group">
        <label>分類</label>
        <select v-model="form.category" required>
          <option value="" disabled>選擇分類</option>
          <option v-for="cat in GUIDE_CATEGORIES" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>內容</label>
        <textarea v-model="form.content" rows="15" placeholder="輸入詳細內容 (支援換行顯示)" required></textarea>
      </div>

      <div class="actions">
        <button type="button" class="btn-cancel" @click="$router.back()">取消</button>
        <button type="submit" class="btn-submit" :disabled="submitting">
          {{ submitting ? '處理中...' : '儲存' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchGuide, createGuide, updateGuide, GUIDE_CATEGORIES } from '../services/guideService'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const submitting = ref(false)

const form = ref({
  title: '',
  category: '',
  content: ''
})

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true
    try {
      const data = await fetchGuide(route.params.id)
      form.value.title = data.title
      form.value.category = data.category
      form.value.content = data.content
    } catch (error) {
      alert(error.message)
      router.push('/guides')
    } finally {
      loading.value = false
    }
  }
})

async function handleSubmit() {
  submitting.value = true
  try {
    if (isEdit.value) {
      await updateGuide(route.params.id, form.value)
      alert('指南已更新')
    } else {
      await createGuide(form.value)
      alert('指南已建立')
    }
    router.push('/guides')
  } catch (error) {
    alert(error.message)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.guide-edit-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.guide-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: #eee;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-submit {
  padding: 0.75rem 2rem;
  background: #52b788;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-submit:disabled {
  background: #ccc;
}

.loading {
  text-align: center;
  padding: 50px;
}
</style>
