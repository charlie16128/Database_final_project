<script setup>
import { STATUS_COLOR } from '../services/itemService.js'

const props = defineProps({
  item: { type: Object, required: true }
})
</script>

<template>
  <router-link :to="`/items/${item.id}`" class="item-card">
    <!-- 圖片 -->
    <div class="card-img-wrap">
      <img
        v-if="item.image_path"
        :src="item.image_path"
        :alt="item.title"
        class="card-img"
      />
      <div v-else class="card-img-placeholder">🐾</div>

      <!-- 狀態 badge -->
      <span
        class="status-badge"
        :style="{ background: STATUS_COLOR[item.status] || '#aaa' }"
      >{{ item.status }}</span>
    </div>

    <!-- 內容 -->
    <div class="card-body">
      <p class="card-category">{{ item.category }}</p>
      <h3 class="card-title">{{ item.title }}</h3>
      <p class="card-condition" v-if="item.condition">狀況：{{ item.condition }}</p>
      <p class="card-owner">🙋 {{ item.owner_name }}</p>
    </div>

    <div class="card-footer">
      查看詳情 →
    </div>
  </router-link>
</template>

<style scoped>
.item-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 1.1rem;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  text-decoration: none;
  color: inherit;
  transition: transform 0.18s, box-shadow 0.18s;
  cursor: pointer;
}
.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.13);
}

/* 圖片 */
.card-img-wrap {
  position: relative;
  aspect-ratio: 4/3;
  background: #f0f4f1;
  overflow: hidden;
}
.card-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.item-card:hover .card-img { transform: scale(1.04); }

.card-img-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 3rem; color: #c8e6c9;
}

/* Badge */
.status-badge {
  position: absolute;
  top: 0.6rem; right: 0.6rem;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
}

/* Body */
.card-body { padding: 0.9rem 1rem 0.5rem; flex: 1; }

.card-category {
  font-size: 0.72rem;
  font-weight: 600;
  color: #52b788;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.3rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.35rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-condition {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.4rem;
}

.card-owner {
  font-size: 0.8rem;
  color: #aaa;
}

/* Footer */
.card-footer {
  padding: 0.6rem 1rem;
  border-top: 1px solid #f0f4f1;
  font-size: 0.82rem;
  font-weight: 600;
  color: #40916c;
  text-align: right;
}
</style>
