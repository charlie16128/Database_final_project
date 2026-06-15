<template>
  <div class="chat-room-container">
    <div class="back-bar">
      <button @click="goBack" class="btn-back">⬅ 返回私訊列表</button>
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

let pollingTimer = null;

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

  // 2. 首次載入歷史訊息
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
  max-width: 700px;
  margin: 20px auto;
  padding: 0 15px;
}

.back-bar {
  margin-bottom: 16px;
}

.btn-back {
  background: none;
  border: none;
  color: #40916c;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
}

.btn-back:hover {
  text-decoration: underline;
}

.status-box {
  text-align: center;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  color: #666;
}

.error {
  color: #e63946;
  background: #ffe3e3;
}
</style>