<template>
  <div class="home-view">
    <section class="hero">
      <h1>🐾 寵物用品循環平台</h1>
      <p>讓愛延續，讓用品找到下一個溫暖的家</p>
      <div class="hero-actions">
        <router-link to="/items" class="btn-primary">瀏覽商品</router-link>
        <router-link to="/guides" class="btn-secondary">查看永續指南</router-link>
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <h3>♻️ 永續循環</h3>
        <p>減少浪費，透過交換與二手買賣讓寵物用品循環利用。</p>
      </div>
      <div class="feature-card">
        <h3>💬 直接溝通</h3>
        <p>內建私訊功能，快速與賣家聯繫確認商品細節。</p>
      </div>
      <div class="feature-card">
        <h3>📚 飼養知識</h3>
        <p>提供專業的永續飼養指南，學習如何更環保地愛寵物。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 2rem 0;
}

.hero {
  text-align: center;
  padding: 4rem 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.hero h1 {
  font-size: 3rem;
  color: #2d6a4f;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.2s;
}

.btn-primary {
  background: #52b788;
  color: white;
}

.btn-secondary {
  background: #f1f8f5;
  color: #52b788;
  border: 1px solid #52b788;
}

.btn-primary:hover, .btn-secondary:hover {
  transform: translateY(-2px);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
}

.feature-card h3 {
  color: #2d6a4f;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #777;
}

@media (max-width: 600px) {
  .hero h1 { font-size: 2rem; }
  .hero-actions { flex-direction: column; }
}
</style>
