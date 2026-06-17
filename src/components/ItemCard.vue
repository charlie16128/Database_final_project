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
  background: var(--card-bg);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid var(--border-color);
}
.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

/* 圖片 */
.card-img-wrap {
  position: relative;
  aspect-ratio: 1/1;
  background: #fdfdfd;
  overflow: hidden;
}
.card-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}
.item-card:hover .card-img { transform: scale(1.05); }

.card-img-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 3.5rem; color: var(--secondary-color);
}

/* Badge */
.status-badge {
  position: absolute;
  top: 0.75rem; right: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Body */
.card-body { padding: 1.25rem; flex: 1; }

.card-category {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.4rem;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  color: var(--text-main);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-condition {
  font-size: 0.85rem;
  color: var(--accent-color);
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.card-owner {
  font-size: 0.85rem;
  color: var(--text-light);
}

.card-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-color);
  text-align: right;
  background: #fafafa;
}
.item-card:hover .card-footer {
  background: var(--bg-color);
}
</style>
