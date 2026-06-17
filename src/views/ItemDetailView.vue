<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchItem, deleteItem, STATUS_COLOR } from '../services/itemService.js'
import { getUser, isLoggedIn } from '../services/authService.js'
import CommentList from '../components/CommentList.vue'

const route  = useRoute()
const router = useRouter()

const item    = ref(null)
const loading = ref(true)
const error   = ref('')
const deleting = ref(false)
const toastMessage = ref('')

const currentUser = getUser()
const loggedIn    = isLoggedIn()

const isOwner = computed(() =>
  currentUser && item.value && item.value.user_id === currentUser.id
)

function showToast(msg) {
  toastMessage.value = msg
  setTimeout(() => { toastMessage.value = '' }, 3000)
}

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
    showToast(e.message)
    deleting.value = false
  }
}

// 修正後的聯絡擁有者點擊事件（完全相容你的按鈕 handleContact 綁定）
async function handleContact() {
  if (!loggedIn) { router.push('/login'); return }
  
  // 安全檢查：確保 item 與擁有者資料存在
  if (!item.value) return;
  const sellerId = item.value.user_id; // 對應後端需要的 owner_id
  
  if (!sellerId) {
    showToast('無法獲取該物品的擁有者資訊');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    
    // 向後端 POST 發送建立或獲取聊天室的請求
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        item_id: item.value.id,
        owner_id: sellerId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '無法建立聊天室');
    }

    const room = await response.json();
    
    // 成功拿到 room.id 後，直接跳轉到對應的聊天室頁面
    router.push(`/messages/${room.id}`);

  } catch (e) {
    console.error('建立聊天室失敗:', e);
    showToast(e.message);
  }
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

    <!-- 留言區（商品載入完成後顯示）-->
    <CommentList v-if="item" :item-id="item.id" />

    <!-- 浮動提示 Toast -->
    <Transition name="toast">
      <div v-if="toastMessage" class="toast-noti">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toast-noti {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent-color);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  z-index: 1000;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

/* 麵包屑 */
.breadcrumb { font-size: 0.9rem; color: var(--text-light); margin-bottom: 2rem; }
.breadcrumb a { color: var(--primary-color); text-decoration: none; font-weight: 500; }
.breadcrumb a:hover { text-decoration: underline; }

/* 佈局 */
.detail-layout {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 3rem;
  align-items: start;
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
}
@media (max-width: 850px) {
  .detail-layout { grid-template-columns: 1fr; gap: 2rem; padding: 1.5rem; }
}

/* 圖片 */
.detail-img-wrap {
  position: relative;
  aspect-ratio: 1/1;
  background: #fdfdfd;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.detail-img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.detail-img-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 6rem; color: var(--secondary-color);
}

/* 資訊欄 */
.info-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }

.status-badge {
  padding: 0.4rem 1.1rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.category-tag {
  background: var(--bg-color);
  color: var(--primary-color);
  padding: 0.4rem 1.1rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  border: 1px solid var(--border-color);
}

.detail-title {
  font-size: 2.3rem;
  font-weight: 800;
  color: var(--primary-dark);
  margin-bottom: 1.75rem;
  line-height: 1.2;
}

/* Meta rows */
.meta-rows { 
  margin-bottom: 2rem; 
  display: flex; 
  flex-direction: column; 
  gap: 0.75rem; 
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 12px;
}
.meta-row { display: flex; align-items: center; gap: 1rem; }
.meta-label { font-size: 0.95rem; color: var(--text-light); width: 85px; flex-shrink: 0; }
.meta-val { font-size: 1.1rem; color: var(--text-main); font-weight: 600; }

/* 描述 */
.detail-desc {
  margin-bottom: 2rem;
}
.detail-desc h3 { font-size: 1.15rem; color: var(--text-main); font-weight: 700; margin-bottom: 1rem; border-left: 5px solid var(--primary-color); padding-left: 0.75rem; }
.detail-desc p  { font-size: 1.1rem; color: var(--text-main); line-height: 1.9; white-space: pre-wrap; }

/* 按鈕 */
.action-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 3rem; }

.btn-contact {
  flex: 2;
  padding: 1.1rem 2rem;
  background: var(--primary-color);
  color: #fff; font-size: 1.15rem; font-weight: 700;
  border-radius: 12px;
  border: none;
  cursor: pointer;
}
.btn-contact:hover:not(:disabled) { background: var(--primary-dark); transform: translateY(-2px); }
.btn-contact:disabled { opacity: 0.5; background: #ccc; cursor: not-allowed; }

.btn-edit {
  flex: 1;
  padding: 1.1rem;
  background: white;
  color: var(--primary-color); font-weight: 700;
  border: 2px solid var(--primary-color); 
  border-radius: 12px;
  text-decoration: none; text-align: center;
  transition: all 0.2s;
}
.btn-edit:hover { background: var(--bg-color); }

.btn-delete {
  padding: 1.1rem 1.5rem;
  background: #fffafa; color: var(--accent-color);
  border: 2px solid #ffeded; border-radius: 12px;
  font-weight: 700; cursor: pointer;
}
.btn-delete:hover:not(:disabled) { background: #ffeded; }

/* States */
.state-box {
  text-align: center; padding: 6rem 1rem; color: var(--text-light);
}
.loader {
  width: 44px; height: 44px;
  border: 4px solid #f3f3f3; border-top-color: var(--primary-color);
  border-radius: 50%; animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
