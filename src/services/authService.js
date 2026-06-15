const BASE = '/api/auth'

/**
 * 將登入資料存到 localStorage
 */
function saveSession(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

/**
 * 清除 localStorage 登入資料
 */
export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

/**
 * 取得目前登入使用者（從 localStorage）
 */
export function getUser() {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
}

/**
 * 取得 JWT token
 */
export function getToken() {
  return localStorage.getItem('token')
}

/**
 * 是否已登入
 */
export function isLoggedIn() {
  return !!getToken()
}

/**
 * 註冊
 * @param {{ username: string, email: string, password: string }} data
 */
export async function register(data) {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '註冊失敗')
  return json
}

/**
 * 登入
 * @param {{ email: string, password: string }} data
 * @returns {{ token: string, user: object }}
 */
export async function login(data) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '登入失敗')
  saveSession(json.token, json.user)
  return json
}

/**
 * 從後端取得目前登入者資料（需要有效 token）
 */
export async function fetchMe() {
  const token = getToken()
  if (!token) return null
  const res = await fetch(`${BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    logout()
    return null
  }
  const json = await res.json()
  return json.user
}
