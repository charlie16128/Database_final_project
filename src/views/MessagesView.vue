<template>
  <div class="messages-container">
    <h2>📥 我的私訊聊天室</h2>
    
    <div v-if="loading" class="status-message">
      <div class="spinner"></div> 正在載入聊天室...
    </div>

    <div v-else-if="error" class="status-message error">
      ⚠️ {{ error }}
    </div>

    <ChatList v-else-if="rooms.length > 0" :rooms="rooms" />

    <div v-else class="status-message empty">
      <p>目前沒有任何對話紀錄。</p>
      <p class="sub-text">可以到商品頁面點擊「聯絡賣家」發起對話！</p>
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
  max-width: 600px;
  margin: 30px auto;
  padding: 0 20px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 24px;
  font-weight: 600;
}

.status-message {
  text-align: center;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: #7f8c8d;
}

.error {
  color: #e74c3c;
  background-color: #fde8e8;
}

.empty .sub-text {
  font-size: 0.9rem;
  color: #bdc3c7;
  margin-top: 8px;
}

/* 簡易載入動畫 */
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>