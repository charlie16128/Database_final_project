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
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;
}
.page-title { font-size: 1.7rem; font-weight: 800; color: #2d6a4f; }

.btn-new {
  padding: 0.55rem 1.1rem;
  background: linear-gradient(135deg, #52b788, #40916c);
  color: #fff; font-weight: 700; font-size: 0.9rem;
  border-radius: 0.6rem; text-decoration: none;
  transition: opacity 0.2s;
}
.btn-new:hover { opacity: 0.88; }

/* List */
.my-items-list { display: flex; flex-direction: column; gap: 0.75rem; }

.my-item-row {
  display: flex; align-items: center; gap: 1rem;
  background: #fff;
  border-radius: 0.9rem;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  flex-wrap: wrap;
}

.row-thumb {
  width: 60px; height: 60px;
  border-radius: 0.6rem; overflow: hidden;
  background: #f0f4f1;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.row-thumb img { width: 100%; height: 100%; object-fit: cover; }
.row-thumb span { font-size: 1.8rem; }

.row-info { flex: 1; min-width: 120px; }
.row-title { font-weight: 700; font-size: 0.98rem; color: #222; }
.row-meta  { font-size: 0.78rem; color: #aaa; margin-top: 0.2rem; }

.status-select {
  padding: 0.35rem 0.6rem;
  border: 1.5px solid #ddd; border-radius: 0.5rem;
  font-weight: 600; font-size: 0.85rem;
  background: #fff; cursor: pointer; outline: none;
}

.row-actions { display: flex; gap: 0.5rem; }

.btn-sm {
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem; font-size: 0.82rem; font-weight: 600;
  border: 1.5px solid #ddd; background: #fff; color: #555;
  text-decoration: none; cursor: pointer; transition: background 0.15s;
}
.btn-sm:hover { background: #f5f5f5; }
.btn-edit  { border-color: #b7e4c7; color: #2d6a4f; }
.btn-edit:hover { background: #edfaf3; }
.btn-del   { border-color: #ffc0c4; color: #e63946; }
.btn-del:hover { background: #fff0f0; }

/* States */
.state-box {
  text-align: center; padding: 4rem 1rem; color: #888;
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
}
.error-box { color: #e63946; }
.loader {
  width: 36px; height: 36px;
  border: 3px solid #e8f5ee; border-top-color: #52b788;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.btn-primary {
  display: inline-block; padding: 0.6rem 1.3rem;
  background: linear-gradient(135deg, #52b788, #40916c);
  color: #fff; font-weight: 600; border-radius: 0.6rem; text-decoration: none;
}
</style>
