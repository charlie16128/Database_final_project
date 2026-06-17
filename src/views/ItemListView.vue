<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemCard from '../components/ItemCard.vue'
import { fetchItems, CATEGORIES, STATUSES } from '../services/itemService.js'

const route  = useRoute()
const router = useRouter()

const items   = ref([])
const loading = ref(true)
const error   = ref('')

// 篩選器（從 query string 同步）
const filters = ref({
  keyword:  route.query.keyword  || '',
  category: route.query.category || '',
  status:   route.query.status   || '',
})

async function loadItems() {
  loading.value = true
  error.value   = ''
  try {
    items.value = await fetchItems(filters.value)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// 搜尋時更新 query string
function applyFilters() {
  const q = {}
  if (filters.value.keyword)  q.keyword  = filters.value.keyword
  if (filters.value.category) q.category = filters.value.category
  if (filters.value.status)   q.status   = filters.value.status
  router.replace({ query: q })
}

function clearFilters() {
  filters.value = { keyword: '', category: '', status: '' }
  router.replace({ query: {} })
}

// 每次 query 變化重新 fetch
watch(() => route.query, (q) => {
  filters.value.keyword  = q.keyword  || ''
  filters.value.category = q.category || ''
  filters.value.status   = q.status   || ''
  loadItems()
}, { immediate: false })

onMounted(loadItems)
</script>

<template>
  <div>
    <!-- 頁頭 -->
    <div class="page-header">
      <h1 class="page-title">🐶 二手寵物用品</h1>
      <p class="page-sub">找到牠需要的，也讓你不再需要的東西找到新家</p>
    </div>

    <!-- 篩選區 -->
    <div class="filter-bar">
      <input
        id="search-keyword"
        v-model="filters.keyword"
        type="text"
        placeholder="🔍 搜尋商品名稱或描述…"
        class="filter-input"
        @keyup.enter="applyFilters"
      />
      <select id="filter-category" v-model="filters.category" class="filter-select">
        <option value="">所有分類</option>
        <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
      <select id="filter-status" v-model="filters.status" class="filter-select">
        <option value="">所有狀態</option>
        <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
      <button class="btn-search" @click="applyFilters">搜尋</button>
      <button
        v-if="filters.keyword || filters.category || filters.status"
        class="btn-clear"
        @click="clearFilters"
      >清除</button>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="state-box">
      <div class="loader"></div>
      <p>載入商品中…</p>
    </div>

    <!-- 錯誤 -->
    <div v-else-if="error" class="state-box error-box">
      <p>⚠️ {{ error }}</p>
    </div>

    <!-- 無商品 -->
    <div v-else-if="items.length === 0" class="state-box">
      <p style="font-size:2rem">🐾</p>
      <p>目前沒有符合的商品</p>
      <router-link to="/items/new" class="btn-primary" style="margin-top:1rem">刊登第一個商品</router-link>
    </div>

    <!-- 商品格 -->
    <div v-else class="items-grid">
      <ItemCard v-for="item in items" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.page-title {
  font-size: 2.2rem;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
  font-weight: 800;
}

.page-sub {
  color: var(--text-light);
  font-size: 1.1rem;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  margin-bottom: 2.5rem;
  align-items: center;
}

.filter-input {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}
.filter-input:focus { border-color: var(--primary-color); }

.filter-select {
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
  background: #fff;
  outline: none;
  cursor: pointer;
}

.btn-search {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
}
.btn-search:hover { background: var(--primary-dark); }

.btn-clear {
  padding: 0.75rem 1rem;
  background: #f1f3f5;
  color: var(--text-light);
  border-radius: 8px;
  font-size: 0.88rem;
}

/* Grid */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.state-box {
  text-align: center;
  padding: 5rem 1rem;
  color: var(--text-light);
}

.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

/* States */
.state-box {
  text-align: center;
  padding: 4rem 1rem;
  color: #888;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
.error-box { color: #e63946; }

/* Loader */
.loader {
  width: 36px; height: 36px;
  border: 3px solid #e8f5ee;
  border-top-color: #52b788;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.btn-primary {
  display: inline-block;
  padding: 0.6rem 1.3rem;
  background: linear-gradient(135deg, #52b788, #40916c);
  color: #fff;
  font-weight: 600;
  border-radius: 0.6rem;
  text-decoration: none;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .items-grid { grid-template-columns: 1fr; }
}
</style>
