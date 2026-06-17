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
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header h2 {
  font-size: 2.2rem;
  color: var(--primary-dark);
  font-weight: 800;
}

.btn-create {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 800;
  box-shadow: 0 4px 15px rgba(82, 183, 136, 0.2);
  transition: all 0.2s;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(82, 183, 136, 0.3);
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.guide-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.guide-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary-color);
  box-shadow: 0 15px 40px rgba(0,0,0,0.06);
}

.guide-tag {
  display: inline-block;
  background: var(--bg-color);
  color: var(--primary-color);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  align-self: flex-start;
  margin-bottom: 1.25rem;
  border: 1px solid var(--border-color);
}

.guide-card h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.35rem;
  color: var(--primary-dark);
  font-weight: 800;
  line-height: 1.3;
}

.summary {
  color: var(--text-main);
  font-size: 1rem;
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.guide-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-top: 1.25rem;
}

.date {
  color: var(--text-light);
  font-size: 0.88rem;
  font-weight: 500;
}

.btn-more {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.btn-more:after { content: " ➔"; }
.btn-more:hover { color: var(--primary-dark); }

.loading, .no-data {
  text-align: center;
  padding: 8rem 2rem;
  background: white;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  color: var(--text-light);
  font-size: 1.1rem;
}
</style>
