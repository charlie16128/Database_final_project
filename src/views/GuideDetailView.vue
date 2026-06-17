<template>
  <div class="guide-detail-view">
    <div v-if="loading" class="loading">載入中...</div>
    <div v-else-if="!guide" class="error">找不到指南</div>
    
    <article v-else class="guide-content">
      <header>
        <div class="meta">
          <span class="category">{{ guide.category }}</span>
          <span class="date">更新於 {{ formatDate(guide.updated_at) }}</span>
        </div>
        <h1>{{ guide.title }}</h1>
        <div v-if="isLoggedIn" class="admin-actions">
          <router-link :to="`/guides/${guide.id}/edit`" class="btn-edit">編輯</router-link>
          <button @click="handleDelete" class="btn-delete">刪除</button>
        </div>
      </header>

      <div class="body">
        <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
      </div>

      <footer>
        <button class="btn-back" @click="$router.push('/guides')">返回列表</button>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchGuide, deleteGuide } from '../services/guideService'
import { isLoggedIn as checkLogin } from '../services/authService'

const route = useRoute()
const router = useRouter()
const guide = ref(null)
const loading = ref(true)
const isLoggedIn = computed(() => checkLogin())

const paragraphs = computed(() => {
  if (!guide.value?.content) return []
  return guide.value.content.split('\n').filter(p => p.trim() !== '')
})

onMounted(async () => {
  try {
    guide.value = await fetchGuide(route.params.id)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

async function handleDelete() {
  if (!confirm('確定要刪除這篇指南嗎？')) return
  try {
    await deleteGuide(guide.value.id)
    alert('已刪除')
    router.push('/guides')
  } catch (error) {
    alert(error.message)
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('zh-TW')
}
</script>

<style scoped>
.guide-detail-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.guide-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

header {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.meta {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.category {
  background: #f1f8f5;
  color: #52b788;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: bold;
}

.date {
  color: #999;
}

h1 {
  font-size: 2rem;
  margin: 0 0 20px 0;
  color: #333;
}

.admin-actions {
  display: flex;
  gap: 10px;
}

.btn-edit, .btn-delete {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.btn-edit {
  background: #f1f8f5;
  color: #52b788;
}

.btn-delete {
  background: #fff0f0;
  color: #ff4d4f;
}

.body {
  line-height: 1.8;
  color: #444;
  font-size: 1.1rem;
}

.body p {
  margin-bottom: 1.5rem;
}

footer {
  margin-top: 40px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.btn-back {
  background: none;
  border: 1px solid #ccc;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
}

.loading, .error {
  text-align: center;
  padding: 100px;
  color: #999;
}
</style>