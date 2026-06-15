<template>
  <div class="chat-window">
    <div class="messages-display" ref="messageBox">
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        class="message-wrapper"
        :class="{ 'is-me': msg.sender_id === currentUserId }"
      >
        <div class="sender-name">{{ msg.sender_name }}</div>
        
        <div class="message-row">
          <div class="message-bubble">
            {{ msg.message }}
          </div>
          <span class="message-time">{{ formatTime(msg.created_at) }}</span>
        </div>
      </div>
    </div>

    <div class="message-input-area">
      <input 
        v-model="newMsgText" 
        type="text" 
        placeholder="輸入訊息..." 
        @keyup.enter="handleSend"
      />
      <button @click="handleSend" :disabled="!newMsgText.trim()">發送</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUpdated, nextTick } from 'vue';

const props = defineProps({
  messages: { type: Array, required: true },
  currentUserId: { type: Number, required: true }
});

const emit = defineEmits(['sendMessage']);
const newMsgText = ref('');
const messageBox = ref(null);

// 觸發發送訊息
const handleSend = () => {
  if (!newMsgText.value.trim()) return;
  emit('sendMessage', newMsgText.value);
  newMsgText.value = ''; // 清空輸入框
};

// 讓對話視窗自動滾動到最底部
const scrollToBottom = () => {
  if (messageBox.value) {
    messageBox.value.scrollTop = messageBox.value.scrollHeight;
  }
};

// 當訊息更新時，自動置底
onUpdated(() => {
  nextTick(() => {
    scrollToBottom();
  });
});

// 格式化時間 (僅顯示 小時:分鐘)
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 500px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e8f5ee;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
}

.messages-display {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fcfdfe;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 75%;
}

/* 如果是當前使用者發送的訊息，靠右對齊 */
.message-wrapper.is-me {
  align-self: flex-end;
  align-items: flex-end;
}

.sender-name {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 4px;
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.message-wrapper.is-me .message-row {
  flex-direction: row-reverse;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.95rem;
  line-height: 1.4;
  word-break: break-all;
  background-color: #f1f3f5;
  color: #333;
}

/* 我發送的訊息顏色 */
.message-wrapper.is-me .message-bubble {
  background: linear-gradient(135deg, #52b788, #40916c);
  color: #ffffff;
}

.message-time {
  font-size: 0.75rem;
  color: #bbb;
  white-space: nowrap;
}

/* 輸入框區域 */
.message-input-area {
  display: flex;
  padding: 16px;
  background: #ffffff;
  border-top: 1px solid #e8f5ee;
  gap: 12px;
}

.message-input-area input {
  flex-grow: 1;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.message-input-area input:focus {
  border-color: #40916c;
}

.message-input-area button {
  padding: 0 20px;
  background: #40916c;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.message-input-area button:hover {
  opacity: 0.9;
}

.message-input-area button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>