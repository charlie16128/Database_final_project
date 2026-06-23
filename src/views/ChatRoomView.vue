<template>
  <div class="chat-room-container">
    <div class="back-bar">
      <button @click="goBack" class="btn-back">⬅ 返回私訊列表</button>
    </div>

    <!-- 聊天室頂端資訊欄 -->
    <div v-if="roomInfo" class="room-info-bar">
      <div class="room-info-content">
        <span class="room-info-label">💬 與</span>
        <span class="room-info-user">{{ roomInfo.other_user_name }}</span>
        <span class="room-info-label">洽談商品：</span>
        <router-link :to="`/items/${roomInfo.item_id}`" class="room-info-item">{{ roomInfo.item_title }}</router-link>
      </div>
    </div>

    <div v-if="loading" class="status-box">正在載入對話紀錄...</div>
    <div v-else-if="error" class="status-box error">⚠️ {{ error }}</div>

    <ChatWindow 
      v-else
      :messages="messages"
      :currentUserId="currentUserId"
      @sendMessage="sendNewMessage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getUser } from '../services/authService.js';
import ChatWindow from '../components/ChatWindow.vue';

const route = useRoute();
const router = useRouter();
const roomId = route.params.roomId;

const messages = ref([]);
const loading = ref(true);
const error = ref(null);
const currentUserId = ref(null);
const roomInfo = ref(null);

let pollingTimer = null;

// 取得聊天室資訊（商品名稱、對方使用者名稱）
const fetchRoomInfo = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api/chat/${roomId}/info`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      roomInfo.value = await res.json();
    }
  } catch (err) {
    console.error('取得聊天室資訊失敗', err);
  }
};

const goBack = () => {
  router.push('/messages');
};

// 向後端撈取該聊天室的歷史訊息
const fetchMessages = async (showLoading = false) => {
  if (showLoading) loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/chat/${roomId}/messages`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('無法取得訊息紀錄');
    const data = await response.json();
    messages.value = data;
  } catch (err) {
    console.error(err);
    error.value = '讀取訊息失敗';
  } finally {
    if (showLoading) loading.value = false;
  }
};

// 發送新訊息到後端
const sendNewMessage = async (text) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/chat/${roomId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text })
    });

    if (!response.ok) throw new Error('訊息發送失敗');
    
    const newMsg = await response.json();
    // 立即將新訊息推進陣列，讓畫面不延遲顯示
    messages.value.push(newMsg);
  } catch (err) {
    alert(err.message);
  }
};

onMounted(() => {
  // 1. 取得目前登入的使用者資訊與 ID
  const currentUser = getUser();
  if (currentUser) {
    currentUserId.value = currentUser.id;
  }

  // 2. 取得聊天室資訊（商品名稱與對方名稱）
  fetchRoomInfo();

  // 3. 首次載入歷史訊息
  fetchMessages(true);

  // 3. 開啟輪詢定時器，每 3 秒自動同步一次新訊息
  pollingTimer = setInterval(() => {
    fetchMessages(false);
  }, 3000);
});

// 當離開這個聊天室頁面時，記得清除定時器避免記憶體洩漏
onUnmounted(() => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
  }
});
</script>

<style scoped>
.chat-room-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.back-bar {
  margin-bottom: 1rem;
}

/* 聊天室頂端商品資訊列 */
.room-info-bar {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 0.85rem 1.25rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}

.room-info-content {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  font-size: 0.95rem;
}

.room-info-label {
  color: var(--text-light);
}

.room-info-user {
  font-weight: 700;
  color: var(--primary-dark);
}

.room-info-item {
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}

.room-info-item:hover {
  color: var(--primary-dark);
}

.btn-back {
  background: white;
  border: 1px solid var(--border-color);
  color: var(--text-main);
  font-weight: 700;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  transition: all 0.2s;
}

.btn-back:hover {
  background: var(--bg-color);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.status-box {
  text-align: center;
  padding: 5rem 2rem;
  background: #fff;
  border-radius: 20px;
  color: var(--text-light);
  border: 1px solid var(--border-color);
}

.error {
  color: var(--accent-color);
  background: #fff8f8;
  border-color: #ffeded;
}

@media (max-width: 600px) {
  .chat-room-container { margin: 1rem auto; padding: 0 1rem; }
}
</style>