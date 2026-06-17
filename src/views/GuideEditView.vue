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
  margin: 3rem auto;
  padding: 0 1.5rem;
}

.guide-edit-view h2 {
  font-size: 2.2rem;
  color: var(--primary-dark);
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
}

.guide-form {
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.05);
  border: 1px solid var(--border-color);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 700;
  color: var(--primary-dark);
  font-size: 1rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem 1.1rem;
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-color);
  transition: all 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary-color);
  background: white;
  outline: none;
  box-shadow: 0 0 0 4px rgba(82, 183, 136, 0.1);
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2.5rem;
}

.btn-cancel {
  padding: 0.8rem 1.5rem;
  background: white;
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  color: var(--text-light);
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: var(--bg-color);
  color: var(--text-main);
}

.btn-submit {
  padding: 0.8rem 2.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
  box-shadow: 0 4px 15px rgba(82, 183, 136, 0.2);
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(82, 183, 136, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 5rem;
  color: var(--text-light);
}

@media (max-width: 600px) {
  .guide-form { padding: 1.5rem; }
  .actions { flex-direction: column-reverse; }
  .btn-submit, .btn-cancel { width: 100%; }
}

.btn-submit:disabled {
  background: #ccc;
}

.loading {
  text-align: center;
  padding: 50px;
}
</style>
