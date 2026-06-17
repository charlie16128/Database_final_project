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
  height: 600px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  overflow: hidden;
}

.messages-display {
  flex-grow: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background-color: var(--bg-color);
  /* 捲軸美化 */
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.messages-display::-webkit-scrollbar {
  width: 6px;
}
.messages-display::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 10px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 80%;
}

/* 如果是當前使用者發送的訊息，靠右對齊 */
.message-wrapper.is-me {
  align-self: flex-end;
  align-items: flex-end;
}

.sender-name {
  font-size: 0.8rem;
  color: var(--text-light);
  margin-bottom: 0.25rem;
  font-weight: 600;
  padding: 0 0.5rem;
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
}

.message-wrapper.is-me .message-row {
  flex-direction: row-reverse;
}

.message-bubble {
  padding: 0.8rem 1.2rem;
  border-radius: 18px;
  font-size: 1rem;
  line-height: 1.5;
  word-break: break-all;
  background-color: white;
  color: var(--text-main);
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  border: 1px solid var(--border-color);
}

/* 我發送的訊息顏色 */
.message-wrapper.is-me .message-bubble {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 12px rgba(82, 183, 136, 0.2);
}

.message-time {
  font-size: 0.75rem;
  color: var(--text-light);
  white-space: nowrap;
}

/* 輸入框區域 */
.message-input-area {
  display: flex;
  padding: 1.25rem;
  background: #ffffff;
  border-top: 1px solid var(--border-color);
  gap: 1rem;
}

.message-input-area input {
  flex-grow: 1;
  padding: 0.8rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  outline: none;
  font-size: 1rem;
  transition: all 0.2s;
  background: var(--bg-color);
}

.message-input-area input:focus {
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 4px rgba(82, 183, 136, 0.1);
}

.message-input-area button {
  padding: 0 1.5rem;
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.message-input-area button:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.message-input-area button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .chat-window { height: 500px; }
  .message-wrapper { max-width: 90%; }
}

.message-input-area button:hover {
  opacity: 0.9;
}

.message-input-area button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>