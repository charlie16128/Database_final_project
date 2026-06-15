<script setup>
import { ref, onMounted } from 'vue'
import { fetchComments, addComment, deleteComment } from '../services/commentService.js'
import { getUser, isLoggedIn } from '../services/authService.js'

const props = defineProps({
  itemId: { type: [Number, String], required: true }
})

const comments  = ref([])
const newText   = ref('')
const loading   = ref(true)
const submitting = ref(false)
const error     = ref('')
const inputError = ref('')

const currentUser = getUser()
const loggedIn    = isLoggedIn()

// ─── 格式化時間 ──────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

// ─── 取得留言 ────────────────────────────────────────────────────────────────
async function loadComments() {
  loading.value = true
  error.value   = ''
  try {
    comments.value = await fetchComments(props.itemId)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// ─── 新增留言 ────────────────────────────────────────────────────────────────
async function handleAdd() {
  inputError.value = ''
  if (!newText.value.trim()) {
    inputError.value = '留言內容不能為空'
    return
  }
  submitting.value = true
  try {
    const comment = await addComment(props.itemId, newText.value.trim())
    comments.value.push(comment)
    newText.value = ''
  } catch (e) {
    inputError.value = e.message
  } finally {
    submitting.value = false
  }
}

// ─── 刪除留言 ────────────────────────────────────────────────────────────────
async function handleDelete(comment) {
  if (!confirm('確定刪除這則留言？')) return
  try {
    await deleteComment(comment.id)
    comments.value = comments.value.filter(c => c.id !== comment.id)
  } catch (e) {
    alert(e.message)
  }
}

onMounted(loadComments)
</script>

<template>
  <section class="comment-section">
    <h2 class="section-title">
      💬 留言區
      <span class="count-badge">{{ comments.length }}</span>
    </h2>

    <!-- 載入中 -->
    <div v-if="loading" class="state-row">
      <div class="mini-loader"></div><span>載入留言…</span>
    </div>

    <!-- 錯誤 -->
    <div v-else-if="error" class="err-msg">⚠️ {{ error }}</div>

    <!-- 留言列表 -->
    <div v-else>
      <div v-if="comments.length === 0" class="empty-msg">
        目前還沒有留言，成為第一個留言者！
      </div>

      <ul class="comment-list">
        <li
          v-for="c in comments"
          :key="c.id"
          class="comment-item"
          :class="{ mine: currentUser && c.user_id === currentUser.id }"
        >
          <div class="comment-avatar">{{ c.username.charAt(0).toUpperCase() }}</div>
          <div class="comment-bubble">
            <div class="comment-meta">
              <span class="comment-author">{{ c.username }}</span>
              <span class="comment-time">{{ formatDate(c.created_at) }}</span>
            </div>
            <p class="comment-content">{{ c.content }}</p>
          </div>
          <!-- 本人才顯示刪除按鈕 -->
          <button
            v-if="currentUser && c.user_id === currentUser.id"
            class="btn-del-comment"
            title="刪除留言"
            @click="handleDelete(c)"
          >✕</button>
        </li>
      </ul>
    </div>

    <!-- 輸入框 -->
    <div class="comment-input-area">
      <template v-if="loggedIn">
        <textarea
          v-model="newText"
          id="comment-input"
          rows="3"
          placeholder="寫下你的留言…"
          class="comment-textarea"
          :class="{ 'has-error': inputError }"
          @keydown.ctrl.enter="handleAdd"
        ></textarea>
        <span v-if="inputError" class="input-error">{{ inputError }}</span>
        <div class="input-row">
          <span class="hint">Ctrl + Enter 送出</span>
          <button class="btn-post" :disabled="submitting" @click="handleAdd">
            <span v-if="submitting" class="mini-spinner"></span>
            {{ submitting ? '送出中…' : '送出留言' }}
          </button>
        </div>
      </template>
      <div v-else class="login-prompt">
        <router-link to="/login">登入</router-link> 後才能留言
      </div>
    </div>
  </section>
</template>

<style scoped>
.comment-section {
  margin-top: 2.5rem;
  border-top: 2px solid #e8f5ee;
  padding-top: 1.75rem;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #2d6a4f;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.count-badge {
  background: #edfaf3;
  color: #40916c;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
}

/* 留言列表 */
.comment-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  position: relative;
}

/* 自己的留言靠右 */
.comment-item.mine {
  flex-direction: row-reverse;
}
.comment-item.mine .comment-bubble {
  background: #edfaf3;
  border-color: #b7e4c7;
  align-items: flex-end;
}
.comment-item.mine .comment-meta { flex-direction: row-reverse; }

/* 頭像 */
.comment-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #52b788, #40916c);
  color: #fff;
  font-weight: 700; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* 氣泡 */
.comment-bubble {
  flex: 1;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.85rem;
  padding: 0.65rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.comment-author {
  font-size: 0.82rem;
  font-weight: 700;
  color: #333;
}

.comment-time {
  font-size: 0.72rem;
  color: #bbb;
}

.comment-content {
  font-size: 0.92rem;
  color: #444;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 刪除按鈕 */
.btn-del-comment {
  position: absolute;
  top: 0; right: 0;
  width: 22px; height: 22px;
  border-radius: 50%;
  border: none;
  background: #ffe0e0;
  color: #e63946;
  font-size: 0.7rem;
  cursor: pointer;
  display: none;
  align-items: center; justify-content: center;
  transition: background 0.15s;
}
.comment-item:hover .btn-del-comment { display: flex; }
.btn-del-comment:hover { background: #ffc0c4; }

/* 輸入區 */
.comment-input-area {
  margin-top: 0.5rem;
}

.comment-textarea {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1.5px solid #ddd;
  border-radius: 0.75rem;
  font-size: 0.92rem;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.comment-textarea:focus {
  border-color: #52b788;
  box-shadow: 0 0 0 3px rgba(82,183,136,0.15);
}
.comment-textarea.has-error { border-color: #e63946; }

.input-error {
  display: block;
  font-size: 0.78rem;
  color: #e63946;
  margin: 0.25rem 0 0.5rem;
}

.input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.6rem;
}

.hint { font-size: 0.75rem; color: #ccc; }

.btn-post {
  padding: 0.5rem 1.2rem;
  background: linear-gradient(135deg, #52b788, #40916c);
  color: #fff; font-weight: 700; font-size: 0.88rem;
  border: none; border-radius: 0.6rem; cursor: pointer;
  display: flex; align-items: center; gap: 0.4rem;
  transition: opacity 0.2s, transform 0.1s;
}
.btn-post:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
.btn-post:disabled { opacity: 0.6; cursor: not-allowed; }

/* States */
.state-row {
  display: flex; align-items: center; gap: 0.5rem;
  color: #888; font-size: 0.88rem; margin-bottom: 1rem;
}
.empty-msg {
  color: #bbb; font-size: 0.9rem; padding: 1.5rem 0;
  text-align: center;
}
.err-msg { color: #e63946; font-size: 0.88rem; margin-bottom: 1rem; }

.login-prompt {
  text-align: center; padding: 1.25rem;
  background: #f8fdf9; border: 1px dashed #c8e6c9; border-radius: 0.75rem;
  color: #888; font-size: 0.9rem;
}
.login-prompt a { color: #40916c; font-weight: 700; text-decoration: none; }
.login-prompt a:hover { text-decoration: underline; }

/* Loaders */
.mini-loader {
  width: 18px; height: 18px;
  border: 2px solid #e8f5ee; border-top-color: #52b788;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.mini-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
