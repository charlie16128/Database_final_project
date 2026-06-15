import { getToken } from './authService.js'

const BASE = '/api'

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` }
}

// ─── 取得商品列表（可傳 { category, status, keyword }）────────────────────
export async function fetchItems(params = {}) {
  const query = new URLSearchParams()
  if (params.category) query.set('category', params.category)
  if (params.status)   query.set('status',   params.status)
  if (params.keyword)  query.set('keyword',  params.keyword)

  const res = await fetch(`${BASE}/items?${query}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '取得商品失敗')
  return json.items
}

// ─── 取得單一商品 ────────────────────────────────────────────────────────────
export async function fetchItem(id) {
  const res = await fetch(`${BASE}/items/${id}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '找不到商品')
  return json.item
}

// ─── 新增商品（FormData，含圖片）────────────────────────────────────────────
export async function createItem(formData) {
  const res = await fetch(`${BASE}/items`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,  // 不設 Content-Type，讓 fetch 自動設 multipart
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '刊登商品失敗')
  return json.item
}

// ─── 修改商品 ────────────────────────────────────────────────────────────────
export async function updateItem(id, formData) {
  const res = await fetch(`${BASE}/items/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: formData,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '更新商品失敗')
  return json.item
}

// ─── 刪除商品 ────────────────────────────────────────────────────────────────
export async function deleteItem(id) {
  const res = await fetch(`${BASE}/items/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '刪除商品失敗')
  return json
}

// ─── 我的商品 ────────────────────────────────────────────────────────────────
export async function fetchMyItems() {
  const res = await fetch(`${BASE}/my/items`, {
    headers: authHeaders(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '取得我的商品失敗')
  return json.items
}

// ─── 常數 ────────────────────────────────────────────────────────────────────
export const CATEGORIES = ['貓咪用品', '狗狗用品', '鳥類用品', '爬蟲用品', '魚類水族', '其他']
export const CONDITIONS  = ['全新', '良好', '普通', '需維修']
export const STATUSES    = ['刊登中', '已預訂', '已完成']

export const STATUS_COLOR = {
  '刊登中': '#52b788',
  '已預訂': '#e76f51',
  '已完成': '#adb5bd',
}
