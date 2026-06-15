<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchItem, deleteItem, STATUS_COLOR } from '../services/itemService.js'
import { getUser, isLoggedIn } from '../services/authService.js'

const route  = useRoute()
const router = useRouter()

const item    = ref(null)
const loading = ref(true)
const error   = ref('')
const deleting = ref(false)

const currentUser = getUser()
const loggedIn    = isLoggedIn()

const isOwner = computed(() =>
  currentUser && item.value && item.value.user_id === currentUser.id
)

async function loadItem() {
  loading.value = true
  error.value   = ''
  try {
    item.value = await fetchItem(route.params.id)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!confirm('確定要刪除此商品？此操作不可復原。')) return
  deleting.value = true
  try {
    await deleteItem(item.value.id)
    router.push('/my-items')
  } catch (e) {
    alert(e.message)
    deleting.value = false
  }
}

function handleContact() {
  if (!loggedIn) { router.push('/login'); return }
  // 第 5 階段 實作聊天室跳轉
  router.push({ path: '/messages', query: { item_id: item.value.id } })
}

onMounted(loadItem)
</script>

<template>
  <div>
    <!-- 麵包屑 -->
    <nav class="breadcrumb">
      <router-link to="/items">商品列表</router-link>
      <span> / </span>
      <span>{{ item?.title || '…' }}</span>
    </nav>

    <!-- 載入中 -->
    <div v-if="loading" class="state-box">
      <div class="loader"></div><p>載入中…</p>
    </div>

    <!-- 錯誤 -->
    <div v-else-if="error" class="state-box error-box">⚠️ {{ error }}</div>

    <!-- 商品詳情 -->
    <div v-else-if="item" class="detail-layout">
      <!-- 左：圖片 -->
      <div class="detail-img-col">
        <div class="detail-img-wrap">
          <img v-if="item.image_path" :src="item.image_path" :alt="item.title" class="detail-img" />
          <div v-else class="detail-img-placeholder">🐾</div>
        </div>
      </div>

      <!-- 右：資訊 -->
      <div class="detail-info-col">
        <div class="info-top">
          <span
            class="status-badge"
            :style="{ background: STATUS_COLOR[item.status] || '#aaa' }"
          >{{ item.status }}</span>
          <span class="category-tag">{{ item.category }}</span>
        </div>

        <h1 class="detail-title">{{ item.title }}</h1>

        <div class="meta-rows">
          <div class="meta-row" v-if="item.condition">
            <span class="meta-label">物品狀況</span>
            <span class="meta-val">{{ item.condition }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">刊登者</span>
            <span class="meta-val">🙋 {{ item.owner_name }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">刊登時間</span>
            <span class="meta-val">{{ new Date(item.created_at).toLocaleDateString('zh-TW') }}</span>
          </div>
        </div>

        <div class="detail-desc" v-if="item.description">
          <h3>商品描述</h3>
          <p>{{ item.description }}</p>
        </div>

        <!-- 動作按鈕 -->
        <div class="action-row">
          <!-- 擁有者：編輯 / 刪除 -->
          <template v-if="isOwner">
            <router-link :to="`/items/${item.id}/edit`" class="btn-edit">✏️ 編輯商品</router-link>
            <button class="btn-delete" :disabled="deleting" @click="handleDelete">
              {{ deleting ? '刪除中…' : '🗑️ 刪除' }}
            </button>
          </template>

          <!-- 非擁有者：聯絡擁有者 -->
          <button
            v-else
            class="btn-contact"
            :disabled="item.status === '已完成'"
            @click="handleContact"
          >
            💬 聯絡擁有者
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 麵包屑 */
.breadcrumb { font-size: 0.85rem; color: #aaa; margin-bottom: 1.25rem; }
.breadcrumb a { color: #52b788; text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }

/* 佈局 */
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}
@media (max-width: 700px) {
  .detail-layout { grid-template-columns: 1fr; }
}

/* 圖片 */
.detail-img-wrap {
  aspect-ratio: 4/3;
  border-radius: 1.1rem;
  overflow: hidden;
  background: #f0f4f1;
  box-shadow: 0 4px 20px rgba(0,0,0,0.09);
}
.detail-img { width: 100%; height: 100%; object-fit: cover; }
.detail-img-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 5rem; color: #c8e6c9;
}

/* 資訊欄 */
.info-top { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
}

.category-tag {
  background: #edfaf3;
  color: #40916c;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.detail-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 1rem;
  line-height: 1.3;
}

/* Meta rows */
.meta-rows { margin-bottom: 1.2rem; display: flex; flex-direction: column; gap: 0.45rem; }
.meta-row { display: flex; align-items: center; gap: 0.75rem; }
.meta-label { font-size: 0.82rem; color: #999; width: 72px; flex-shrink: 0; }
.meta-val { font-size: 0.9rem; color: #444; font-weight: 500; }

/* 描述 */
.detail-desc {
  background: #f8fdf9;
  border: 1px solid #d8f0e3;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.25rem;
}
.detail-desc h3 { font-size: 0.85rem; color: #888; font-weight: 600; margin-bottom: 0.5rem; }
.detail-desc p  { font-size: 0.95rem; color: #444; line-height: 1.65; white-space: pre-wrap; }

/* 按鈕 */
.action-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }

.btn-contact {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #52b788, #40916c);
  color: #fff; font-size: 1rem; font-weight: 700;
  border: none; border-radius: 0.75rem; cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}
.btn-contact:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.btn-contact:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-edit {
  flex: 1;
  padding: 0.7rem 1rem;
  background: #f0faf4;
  color: #2d6a4f; font-weight: 700;
  border: 1.5px solid #52b788; border-radius: 0.75rem;
  text-decoration: none; text-align: center;
  transition: background 0.15s;
}
.btn-edit:hover { background: #e2f5ea; }

.btn-delete {
  padding: 0.7rem 1rem;
  background: #fff0f0; color: #e63946;
  border: 1.5px solid #ffc0c4; border-radius: 0.75rem;
  font-weight: 600; cursor: pointer;
  transition: background 0.15s;
}
.btn-delete:hover:not(:disabled) { background: #ffe0e0; }
.btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }

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
</style>
