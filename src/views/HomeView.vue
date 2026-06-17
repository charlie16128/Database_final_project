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
  padding: 6rem 2rem;
  background: white;
  border-radius: 32px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
  border: 1px solid var(--border-color);
  background-image: radial-gradient(var(--bg-color) 1px, transparent 1px);
  background-size: 20px 20px;
}

.hero h1 {
  font-size: 3.5rem;
  color: var(--primary-dark);
  margin-bottom: 1.5rem;
  font-weight: 800;
  letter-spacing: -1px;
}

.hero p {
  font-size: 1.4rem;
  color: var(--text-light);
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 1.2rem 2.5rem;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 800;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  box-shadow: 0 8px 25px rgba(82, 183, 136, 0.3);
}

.btn-secondary {
  background: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-primary:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(82, 183, 136, 0.4);
}

.btn-secondary:hover {
  background: var(--bg-color);
  transform: translateY(-5px);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
}

.feature-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: var(--primary-color);
  box-shadow: 0 20px 40px rgba(0,0,0,0.05);
}

.feature-card h3 {
  color: var(--primary-dark);
  margin-bottom: 1.25rem;
  font-size: 1.5rem;
  font-weight: 800;
}

.feature-card p {
  color: var(--text-light);
  line-height: 1.6;
  font-size: 1.05rem;
}

@media (max-width: 768px) {
  .hero { padding: 4rem 1.5rem; }
  .hero h1 { font-size: 2.5rem; }
  .hero p { font-size: 1.1rem; }
  .hero-actions { flex-direction: column; gap: 1rem; }
  .btn-primary, .btn-secondary { width: 100%; padding: 1rem; }
  .features { grid-template-columns: 1fr; }
}
</style>
