<script setup>
import { ref, watch } from 'vue'
import { CATEGORIES, CONDITIONS } from '../services/itemService.js'

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isEdit:      { type: Boolean, default: false },
  loading:     { type: Boolean, default: false },
})

const emit = defineEmits(['submit'])

const form = ref({
  title:       props.initialData.title       || '',
  category:    props.initialData.category    || '',
  condition:   props.initialData.condition   || '',
  description: props.initialData.description || '',
  status:      props.initialData.status      || '刊登中',
})

const imageFile     = ref(null)
const imagePreview  = ref(props.initialData.image_path || '')
const fieldErrors   = ref({})

// 若父層傳入 initialData（編輯模式），同步到 form
watch(() => props.initialData, (data) => {
  if (!data || !data.title) return
  form.value.title       = data.title
  form.value.category    = data.category
  form.value.condition   = data.condition || ''
  form.value.description = data.description || ''
  form.value.status      = data.status || '刊登中'
  imagePreview.value     = data.image_path || ''
})

function onImageChange(e) {
  const file = e.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function validate() {
  const errs = {}
  if (!form.value.title.trim())   errs.title    = '請輸入商品名稱'
  if (!form.value.category)       errs.category = '請選擇商品分類'
  fieldErrors.value = errs
  return Object.keys(errs).length === 0
}

function handleSubmit() {
  if (!validate()) return
  const fd = new FormData()
  fd.append('title',       form.value.title.trim())
  fd.append('category',    form.value.category)
  fd.append('description', form.value.description)
  fd.append('condition',   form.value.condition)
  if (props.isEdit) fd.append('status', form.value.status)
  if (imageFile.value) fd.append('image', imageFile.value)
  emit('submit', fd)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="item-form" novalidate>
    <!-- 商品名稱 -->
    <div class="field" :class="{ error: fieldErrors.title }">
      <label for="item-title">商品名稱 <span class="req">*</span></label>
      <input id="item-title" v-model="form.title" type="text" placeholder="例：貓咪抓板" />
      <span class="field-error">{{ fieldErrors.title }}</span>
    </div>

    <!-- 商品分類 -->
    <div class="field" :class="{ error: fieldErrors.category }">
      <label for="item-category">商品分類 <span class="req">*</span></label>
      <select id="item-category" v-model="form.category">
        <option value="">請選擇分類</option>
        <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
      <span class="field-error">{{ fieldErrors.category }}</span>
    </div>

    <!-- 物品狀況 -->
    <div class="field">
      <label for="item-condition">物品狀況</label>
      <select id="item-condition" v-model="form.condition">
        <option value="">請選擇狀況</option>
        <option v-for="c in CONDITIONS" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <!-- 商品狀態（只在編輯模式顯示）-->
    <div class="field" v-if="isEdit">
      <label for="item-status">商品狀態</label>
      <select id="item-status" v-model="form.status">
        <option value="刊登中">刊登中</option>
        <option value="已預訂">已預訂</option>
        <option value="已完成">已完成</option>
      </select>
    </div>

    <!-- 商品描述 -->
    <div class="field">
      <label for="item-desc">商品描述</label>
      <textarea
        id="item-desc"
        v-model="form.description"
        rows="4"
        placeholder="描述商品的使用狀況、尺寸、特色等…"
      ></textarea>
    </div>

    <!-- 圖片上傳 -->
    <div class="field">
      <label for="item-image">商品圖片</label>
      <div class="upload-area" @click="$refs.fileInput.click()">
        <img v-if="imagePreview" :src="imagePreview" alt="預覽圖" class="preview-img" />
        <div v-else class="upload-placeholder">
          <span class="upload-icon">📷</span>
          <p>點擊上傳圖片</p>
          <p class="upload-hint">支援 jpg, png, gif, webp，最大 5MB</p>
        </div>
      </div>
      <input
        id="item-image"
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display:none"
        @change="onImageChange"
      />
    </div>

    <button type="submit" class="btn-submit" :disabled="loading">
      <span v-if="loading" class="spinner"></span>
      {{ loading ? '儲存中…' : isEdit ? '✅ 儲存變更' : '🐾 刊登商品' }}
    </button>
  </form>
</template>

<style scoped>
.item-form { display: flex; flex-direction: column; gap: 1.1rem; }

.field label {
  display: block;
  font-size: 0.85rem; font-weight: 600; color: #555;
  margin-bottom: 0.35rem;
}
.req { color: #e63946; }

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1.5px solid #ddd;
  border-radius: 0.6rem;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff;
}
.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #52b788;
  box-shadow: 0 0 0 3px rgba(82,183,136,0.15);
}
.field.error input,
.field.error select { border-color: #e63946; }

.field-error {
  display: block; min-height: 1.1rem;
  font-size: 0.78rem; color: #e63946; margin-top: 0.25rem;
}

/* Upload */
.upload-area {
  border: 2px dashed #c8e6c9;
  border-radius: 0.8rem;
  cursor: pointer;
  overflow: hidden;
  min-height: 160px;
  display: flex; align-items: center; justify-content: center;
  background: #f8fdf9;
  transition: border-color 0.2s;
}
.upload-area:hover { border-color: #52b788; }

.preview-img { width: 100%; max-height: 260px; object-fit: contain; display: block; }

.upload-placeholder { text-align: center; color: #aaa; padding: 2rem; }
.upload-icon { font-size: 2.5rem; }
.upload-placeholder p { margin-top: 0.4rem; font-size: 0.9rem; }
.upload-hint { font-size: 0.75rem !important; color: #ccc; }

/* Submit */
.btn-submit {
  padding: 0.8rem;
  background: linear-gradient(135deg, #52b788, #40916c);
  color: #fff; font-size: 1rem; font-weight: 700;
  border: none; border-radius: 0.75rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  transition: opacity 0.2s, transform 0.1s;
}
.btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
