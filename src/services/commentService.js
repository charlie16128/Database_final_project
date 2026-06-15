import { getToken } from './authService.js'

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` }
}

/**
 * 取得商品留言
 * @param {number|string} itemId
 */
export async function fetchComments(itemId) {
  const res = await fetch(`/api/items/${itemId}/comments`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '取得留言失敗')
  return json.comments
}

/**
 * 新增留言
 * @param {number|string} itemId
 * @param {string} content
 */
export async function addComment(itemId, content) {
  const res = await fetch(`/api/items/${itemId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ content }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '留言失敗')
  return json.comment
}

/**
 * 刪除留言
 * @param {number|string} commentId
 */
export async function deleteComment(commentId) {
  const res = await fetch(`/api/comments/${commentId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || '刪除留言失敗')
  return json
}
