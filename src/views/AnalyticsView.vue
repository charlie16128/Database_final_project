<template>
  <div class="analytics-view">
    <div class="header">
      <h1 class="page-title">📊 平台總體循環數據看板</h1>
      <p class="page-desc">了解目前平台上有多少寵物用品正在循環中，讓愛與資源延續。</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>正在努力撈取數據中...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>⚠️ {{ error }}</p>
    </div>
    
    <div v-else class="dashboard-grid">
      <!-- 分類統計 (圓餅圖) -->
      <div class="chart-card">
        <div class="card-header">
          <h3>商品分類統計</h3>
          <span class="badge">{{ totalItems }} 件物品</span>
        </div>
        <div class="chart-container">
          <Pie v-if="categoryChartData.labels.length > 0" :data="categoryChartData" :options="pieOptions" />
          <p v-else class="empty-state">目前還沒有任何商品資料喔！</p>
        </div>
      </div>

      <!-- 狀態統計 (長條圖) -->
      <div class="chart-card">
        <div class="card-header">
          <h3>循環進度狀態</h3>
          <span class="badge highlight">{{ completedItems }} 件成功循環</span>
        </div>
        <div class="chart-container">
          <Bar v-if="statusChartData.labels.length > 0" :data="statusChartData" :options="barOptions" />
          <p v-else class="empty-state">目前還沒有任何狀態資料喔！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Pie, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Colors
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale, Colors)

const loading = ref(true)
const error = ref('')
const rawData = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/analytics/circulation')
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)
    const result = await res.json()
    
    if (result.success) {
      rawData.value = result.data
    } else {
      error.value = result.message || '無法取得數據'
    }
  } catch (err) {
    error.value = '連線伺服器失敗，請確認後端是否正在運行中。'
    console.error('Analytics Error:', err)
  } finally {
    loading.value = false
  }
})

// === Computed Data for UI ===
const totalItems = computed(() => {
  if (!rawData.value?.categories) return 0
  return rawData.value.categories.reduce((acc, curr) => acc + curr.count, 0)
})

const completedItems = computed(() => {
  if (!rawData.value?.statuses) return 0
  const completed = rawData.value.statuses.find(s => s.status === '已完成')
  return completed ? completed.count : 0
})

// === Chart Data ===
const categoryChartData = computed(() => {
  if (!rawData.value?.categories) return { labels: [], datasets: [] }
  const data = rawData.value.categories
  return {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: '商品數量',
        data: data.map(item => item.count),
        backgroundColor: [
          '#52b788', // Primary
          '#ff9f1c', // Accent
          '#40916c', // Primary Dark
          '#ffbf69', // Accent Light
          '#b7e4c7', // Secondary
          '#2ec4b6',
          '#cbf3f0'
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4
      }
    ]
  }
})

const statusChartData = computed(() => {
  if (!rawData.value?.statuses) return { labels: [], datasets: [] }
  const data = rawData.value.statuses
  
  // Sort predefined statuses if needed, or just use DB output
  return {
    labels: data.map(item => item.status),
    datasets: [
      {
        label: '商品數量',
        data: data.map(item => item.count),
        backgroundColor: data.map(item => {
          if (item.status === '已完成') return '#ff9f1c' // Accent color for completed
          if (item.status === '刊登中') return '#52b788' // Primary color
          return '#b7e4c7' // Default/Other
        }),
        borderRadius: 6,
      }
    ]
  }
})

// === Chart Options ===
const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { padding: 20, font: { family: "'Inter', sans-serif", size: 13 } }
    },
    tooltip: {
      backgroundColor: 'rgba(45, 106, 79, 0.9)',
      padding: 12,
      cornerRadius: 8
    }
  }
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(45, 106, 79, 0.9)',
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1, precision: 0, font: { family: "'Inter', sans-serif" } },
      grid: { color: '#e8f5ee' }
    },
    x: {
      ticks: { font: { family: "'Inter', sans-serif" } },
      grid: { display: false }
    }
  }
}
</script>

<style scoped>
.analytics-view {
  animation: fadeIn 0.4s ease-out;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.2rem;
  color: var(--primary-dark);
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.page-desc {
  color: var(--text-light);
  font-size: 1.1rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 1.8rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.03);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(82, 183, 136, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--border-color);
}

.card-header h3 {
  color: var(--primary-dark);
  font-size: 1.3rem;
  font-weight: 700;
}

.badge {
  background: var(--bg-color);
  color: var(--primary-dark);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
}

.badge.highlight {
  background: #fff3e0;
  color: var(--accent-color);
}

.chart-container {
  position: relative;
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  color: var(--text-light);
  font-style: italic;
}

/* Loading & Error States */
.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: white;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  color: var(--text-light);
}

.error {
  color: var(--error-color);
  background: #fff8f8;
  border-color: #fbdada;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 1.8rem; }
  .chart-container { height: 280px; }
}
</style>
