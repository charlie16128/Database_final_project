<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchMyItems, deleteItem, updateItem, STATUS_COLOR, STATUSES } from '../services/itemService.js'

const router  = useRouter()
const items   = ref([])
const loading = ref(true)
const error   = ref('')

async function loadItems() {
  loading.value = true
  error.value = ''
  try {
    items.value = await fetchMyItems()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function quickStatus(item, status) {
  try {
    const fd = new FormData()
    fd.append('title',       item.title)
    fd.append('category',    item.category)
    fd.append('description', item.description || '')
    fd.append('condition',   item.condition   || '')
    fd.append('status',      status)
    await updateItem(item.id, fd)
    item.status = status
  } catch (e) {
    alert(e.message)
  }
}

async function handleDelete(item) {
  if (!confirm(`確定要刪除「${item.title}」？`)) return
  try {
    await deleteItem(item.id)
    items.value = items.value.filter(i => i.id !== item.id)
  } catch (e) {
    alert(e.message)
  }
}

onMounted(loadItems)
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">📦 我的商品</h1>
      <router-link to="/items/new" class="btn-new">+ 刊登新商品</router-link>
    </div>

    <div v-if="loading" class="state-box"><div class="loader"></div><p>載入中…</p></div>
    <div v-else-if="error" class="state-box error-box">⚠️ {{ error }}</div>

    <div v-else-if="items.length === 0" class="state-box">
      <p style="font-size:2.5rem">🐾</p>
      <p>你還沒有刊登任何商品</p>
      <router-link to="/items/new" class="btn-primary" style="margin-top:1rem">刊登第一個商品</router-link>
    </div>

    <div v-else class="my-items-list">
      <div v-for="item in items" :key="item.id" class="my-item-row">
        <!-- 縮圖 -->
        <div class="row-thumb">
          <img v-if="item.image_path" :src="item.image_path" :alt="item.title" />
          <span v-else>🐾</span>
        </div>

        <!-- 資訊 -->
        <div class="row-info">
          <p class="row-title">{{ item.title }}</p>
          <p class="row-meta">{{ item.category }} ・ {{ item.condition }}</p>
        </div>

        <!-- 狀態快速切換 -->
        <div class="row-status">
          <select
            :id="`status-${item.id}`"
            :value="item.status"
            @change="quickStatus(item, $event.target.value)"
            class="status-select"
            :style="{ color: STATUS_COLOR[item.status] }"
          >
            <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <!-- 動作 -->
        <div class="row-actions">
          <router-link :to="`/items/${item.id}`"       class="btn-sm">查看</router-link>
          <router-link :to="`/items/${item.id}/edit`"  class="btn-sm btn-edit">編輯</router-link>
          <button class="btn-sm btn-del" @click="handleDelete(item)">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  margin-bottom: 2rem; 
  flex-wrap: wrap; 
  gap: 1rem;
}

.page-title { 
  font-size: 2.2rem; 
  font-weight: 800; 
  color: var(--primary-dark); 
}

.btn-new {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: #fff; 
  font-weight: 800; 
  font-size: 1rem;
  border-radius: 12px; 
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(82, 183, 136, 0.2);
  transition: all 0.2s ease;
}

.btn-new:hover { 
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(82, 183, 136, 0.3);
}

/* List */
.my-items-list { 
  display: flex; 
  flex-direction: column; 
  gap: 1rem; 
}

.my-item-row {
  display: flex; 
  align-items: center; 
  gap: 1.5rem;
  background: #fff;
  border-radius: 20px;
  padding: 1.25rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.my-item-row:hover {
  border-color: var(--primary-color);
  transform: translateX(5px);
}

.row-thumb {
  width: 80px; 
  height: 80px;
  border-radius: 12px; 
  overflow: hidden;
  background: var(--bg-color);
  display: flex; 
  align-items: center; 
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
}

.row-thumb img { width: 100%; height: 100%; object-fit: cover; }
.row-thumb span { font-size: 2rem; }

.row-info { flex: 1; min-width: 151px; }
.row-title { font-weight: 800; font-size: 1.15rem; color: var(--primary-dark); }
.row-meta  { font-size: 0.9rem; color: var(--text-light); margin-top: 0.4rem; font-weight: 500; }

.status-select {
  padding: 0.5rem 0.8rem;
  border: 1.5px solid var(--border-color); 
  border-radius: 10px;
  font-weight: 700; 
  font-size: 0.95rem;
  background: white; 
  cursor: pointer; 
  outline: none;
  transition: all 0.2s;
}

.status-select:focus {
  border-color: var(--primary-color);
}

.row-actions { display: flex; gap: 0.6rem; }

.btn-sm {
  padding: 0.5rem 1rem;
  border-radius: 10px; 
  font-size: 0.9rem; 
  font-weight: 700;
  border: 1.5px solid var(--border-color); 
  background: #fff; 
  color: var(--text-main);
  text-decoration: none; 
  cursor: pointer; 
  transition: all 0.2s;
}

.btn-sm:hover { 
  background: var(--bg-color); 
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-edit { border-color: var(--primary-color); color: var(--primary-color); }
.btn-edit:hover { background: #f0f7f3; }

.btn-del { border-color: #ffeded; color: var(--accent-color); }
.btn-del:hover { background: #fff8f8; border-color: var(--accent-color); }

/* States */
.state-box {
  text-align: center; 
  padding: 6rem 2rem; 
  background: white;
  border-radius: 24px;
  border: 1px solid var(--border-color);
  color: var(--text-light);
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 1rem;
}

.error-box { 
  color: var(--accent-color); 
  background: #fff8f8;
}

.loader {
  width: 40px; 
  height: 40px;
  border: 4px solid var(--bg-color); 
  border-top-color: var(--primary-color);
  border-radius: 50%; 
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.btn-primary {
  display: inline-block; 
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: #fff; 
  font-weight: 700; 
  border-radius: 12px; 
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(82, 183, 136, 0.2);
}

@media (max-width: 768px) {
  .page-title { font-size: 1.8rem; }
  .my-item-row { flex-direction: column; align-items: stretch; text-align: center; gap: 1rem; }
  .row-thumb { margin: 0 auto; width: 100px; height: 100px; }
  .row-actions { justify-content: center; }
  .status-select { width: 100%; }
}
</style>
