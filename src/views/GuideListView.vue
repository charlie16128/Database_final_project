<template>
  <div class="guide-list-view">
    <div class="header">
      <h2>永續指南</h2>
      <router-link v-if="isLoggedIn" to="/guides/create" class="btn-create">新增指南</router-link>
    </div>

    <div v-if="loading" class="loading">載入中...</div>
    <div v-else-if="guides.length === 0" class="no-data">目前尚無指南內容。</div>
    
    <div v-else class="guide-grid">
      <div v-for="guide in guides" :key="guide.id" class="guide-card">
        <div class="guide-tag">{{ guide.category }}</div>
        <h3>{{ guide.title }}</h3>
        <p class="summary">{{ truncateContent(guide.content) }}</p>
        <div class="guide-footer">
          <span class="date">{{ formatDate(guide.created_at) }}</span>
          <router-link :to="`/guides/${guide.id}`" class="btn-more">閱讀全文</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchGuides } from '../services/guideService'
import { isLoggedIn as checkLogin } from '../services/authService'

const guides = ref([])
const loading = ref(true)
const isLoggedIn = computed(() => checkLogin())

onMounted(async () => {
  try {
    guides.value = await fetchGuides()
  } catch (error) {
    console.error(error)
    alert(error.message)
  } finally {
    loading.value = false
  }
})

function truncateContent(content) {
  if (content.length > 60) {
    return content.substring(0, 60) + '...'
  }
  return content
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}
</script>

<style scoped>
.guide-list-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-create {
  background-color: #52b788;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.guide-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.guide-tag {
  display: inline-block;
  background: #f1f8f5;
  color: #52b788;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  align-self: flex-start;
  margin-bottom: 10px;
}

.guide-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.25rem;
}

.summary {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  flex-grow: 1;
  margin-bottom: 20px;
}

.guide-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.date {
  color: #999;
  font-size: 0.85rem;
}

.btn-more {
  color: #52b788;
  text-decoration: none;
  font-weight: bold;
}

.loading, .no-data {
  text-align: center;
  padding: 50px;
  color: #999;
}
</style>
