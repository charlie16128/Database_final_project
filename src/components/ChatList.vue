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
  gap: 1rem;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid var(--border-color);
}

.chat-item:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border-color: var(--primary-color);
  background: var(--bg-color);
}

.item-image-container {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  margin-right: 1.25rem;
  background-color: #fdfdfd;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
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
  gap: 0.5rem;
}

.other-user {
  font-weight: 800;
  color: var(--primary-dark);
  font-size: 1.15rem;
}

.item-title {
  font-size: 0.95rem;
  color: var(--text-main);
  /* 限制字數 */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tag {
  background-color: var(--secondary-color);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-right: 0.4rem;
}

.arrow {
  color: var(--text-light);
  font-size: 1.2rem;
  padding-left: 1rem;
  opacity: 0.5;
}
</style>