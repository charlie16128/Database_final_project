<template>
  <div class="messages-container">
    <div class="page-header">
      <h2 class="page-title">📥 我的私訊</h2>
      <p class="page-sub">與刊登者及買家的溝通紀錄</p>
    </div>
    
    <div v-if="loading" class="state-box">
      <div class="loader"></div> 
      <p>正在載入聊天室...</p>
    </div>

    <div v-else-if="error" class="state-box error">
      <p>⚠️ {{ error }}</p>
    </div>

    <ChatList v-else-if="rooms.length > 0" :rooms="rooms" />

    <div v-else class="state-box empty">
      <p class="main-text">目前沒有任何對話紀錄</p>
      <p class="sub-text">可以到商品頁面點擊「聯絡擁有者」發起對話！</p>
      <router-link to="/items" class="btn-browse">去逛逛商品</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ChatList from '../components/ChatList.vue';

const rooms = ref([]);
const loading = ref(true);
const error = ref(null);

// 頁面掛載時，向後端 API 撈取聊天室列表
onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = '請先登入系統才能查看私訊。';
      loading.value = false;
      return;
    }

    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('無法取得聊天室列表');
    }

    const data = await response.json();
    rooms.value = data;
  } catch (err) {
    console.error(err);
    error.value = '載入聊天室失敗，請稍後再試。';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.messages-container {
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 1.5rem;
}

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

.state-box {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  color: var(--text-light);
  border: 1px solid var(--border-color);
}

.state-box.error {
  color: var(--accent-color);
  background: #fff8f8;
}

.empty .main-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.empty .sub-text {
  font-size: 1rem;
  color: var(--text-light);
  margin-bottom: 2rem;
}

.btn-browse {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.2s;
}
.btn-browse:hover { background: var(--primary-dark); transform: translateY(-2px); }

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .page-title { font-size: 1.8rem; }
  .messages-container { margin: 1.5rem auto; }
}
</style>