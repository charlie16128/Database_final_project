<template>
  <div class="chat-list">
    <div 
      v-for="room in rooms" 
      :key="room.room_id" 
      class="chat-item"
      @click="selectRoom(room.room_id)"
    >
      <div class="item-image-container">
        <img 
          :src="room.item_image ? `http://localhost:3000/${room.item_image}` : '/default-item.png'" 
          alt="商品圖片" 
          class="item-img"
        />
      </div>

      <div class="chat-info">
        <div class="chat-header">
          <span class="other-user">👤 {{ room.other_user_name }}</span>
        </div>
        <div class="item-title">
          <span class="tag">商品</span> {{ room.item_title }}
        </div>
      </div>
      
      <div class="arrow">❯</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

// 定義從父元件傳下來的聊天室列表資料
defineProps({
  rooms: {
    type: Array,
    required: true
  }
});

const router = useRouter();

// 點擊聊天室時，跳轉到對應的聊天室內頁 (ChatRoomView)
const selectRoom = (roomId) => {
  router.push(`/messages/${roomId}`);
};
</script>

<style scoped>
.chat-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
}

.chat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #42b983;
}

.item-image-container {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 16px;
  background-color: #f7f7f7;
  flex-shrink: 0;
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.other-user {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.item-title {
  font-size: 0.9rem;
  color: #7f8c8d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

.tag {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.arrow {
  color: #bdc3c7;
  font-size: 1.2rem;
  padding-left: 8px;
}
</style>