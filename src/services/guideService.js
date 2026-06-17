import { getToken } from './authService.js'

const BASE = '/api/guides'

function authHeaders() {
  const token = getToken()
  return token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } : { 'Content-Type': 'application/json' }
}

// 取得所有指南
export async function fetchGuides() {
  const res = await fetch(BASE)
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '取得指南失敗')
  return json
}

// 取得單一指南
export async function fetchGuide(id) {
  const res = await fetch(`${BASE}/${id}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '取得指南失敗')
  return json
}

// 新增指南
export async function createGuide(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '建立指南失敗')
  return json
}

// 更新指南
export async function updateGuide(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '更新指南失敗')
  return json
}

// 刪除指南
export async function deleteGuide(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '刪除指南失敗')
  return json
}

export const GUIDE_CATEGORIES = ['知識普及', '永續觀念', 'DIY教學', '回收指南']