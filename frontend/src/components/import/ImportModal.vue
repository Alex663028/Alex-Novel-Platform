<template>
  <n-modal
    :show="props.visible"
    @update:show="emitVisibleUpdate"
    preset="card"
    title=""
    :style="{ width: '700px', maxWidth: '90vw' }"
    :bordered="true"
    :segmented="{ content: true, footer: 'soft' }"
    :mask-closable="true"
    :close-on-esc="true"
  >
    <template #header>
      <div class="import-header">
        <span class="import-icon">📥</span>
        <h3 class="import-title">导入 MD 大纲</h3>
      </div>
    </template>

    <div class="import-body">
      <!-- 导入模式切换 -->
      <n-tabs v-model:value="importMode" type="line" animated>
        <n-tab-pane name="text" tab="粘贴文本">
          <n-input
            v-model:value="textContent"
            type="textarea"
            placeholder="在此粘贴 Markdown 格式的大纲内容...&#10;&#10;支持格式：&#10;# 书名&#10;## 基本信息&#10;## 世界观设定&#10;## 角色&#10;## 剧情结构"
            :rows="12"
            show-count
          />
        </n-tab-pane>
        <n-tab-pane name="file" tab="上传文件">
          <div
            class="file-drop-zone"
            :class="{ 'is-dragging': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept=".md,.markdown,.txt"
              style="display: none"
              @change="handleFileSelect"
            />
            <div v-if="!selectedFile" class="file-drop-content" @click="triggerFileSelect">
              <span class="file-drop-icon">📄</span>
              <p class="file-drop-text">点击选择或拖拽文件到此处</p>
              <p class="file-drop-hint">支持 .md / .markdown / .txt 格式</p>
            </div>
            <div v-else class="file-selected">
              <span class="file-icon">📄</span>
              <span class="file-name">{{ selectedFile.name }}</span>
              <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
              <n-button text type="error" size="tiny" @click="clearFile">移除</n-button>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>

      <!-- 目标小说选择 -->
      <div class="target-novel-section">
        <label class="target-label">导入到：</label>
        <n-select
          v-model:value="targetNovelId"
          :options="novelOptions"
          placeholder="选择目标小说（留空则创建新小说）"
          clearable
          filterable
        />
      </div>

      <!-- 预览结果 -->
      <div v-if="previewResult" class="preview-section">
        <n-alert type="info" :show-icon="true" style="margin-bottom: 12px">
          检测到以下信息，确认后点击"确认导入"
        </n-alert>
        <div class="preview-grid">
          <div class="preview-item">
            <span class="preview-label">书名</span>
            <span class="preview-value">{{ previewResult.preview?.title || '未检测到' }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">作者</span>
            <span class="preview-value">{{ previewResult.preview?.author || '未检测到' }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">类型</span>
            <span class="preview-value">{{ previewResult.preview?.genre || '未检测到' }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">目标章数</span>
            <span class="preview-value">{{ previewResult.preview?.target_chapters || '未检测到' }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">角色数</span>
            <span class="preview-value">{{ previewResult.preview?.characters?.length || 0 }} 个</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">世界观</span>
            <span class="preview-value">{{ previewResult.preview?.world_settings?.length || 0 }} 条</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">地点</span>
            <span class="preview-value">{{ previewResult.preview?.locations?.length || 0 }} 个</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">结构节点</span>
            <span class="preview-value">{{ previewResult.preview?.structure_nodes || 0 }} 个</span>
          </div>
        </div>
        <div v-if="previewResult.missing?.length > 0" class="missing-fields">
          <span class="missing-title">缺失字段：</span>
          <n-tag v-for="field in previewResult.missing" :key="field" size="small" type="warning" style="margin: 2px">
            {{ fieldLabel(field) }}
          </n-tag>
        </div>
      </div>

      <!-- 导入结果 -->
      <div v-if="importResult" class="result-section">
        <n-alert
          :type="importResult.saved ? 'success' : 'error'"
          :show-icon="true"
        >
          {{ importResult.message }}
        </n-alert>
        <div v-if="importResult.saved && importResult.novel_id" class="result-info">
          <p>小说 ID：<code>{{ importResult.novel_id }}</code></p>
          <p v-if="importResult.parsed">
            已解析：{{ importResult.parsed.characters_count }} 角色 / 
            {{ importResult.parsed.world_settings_count }} 设定 / 
            {{ importResult.parsed.locations_count }} 地点
          </p>
        </div>
      </div>
    </div>

    <template #action>
      <n-space justify="end">
        <n-button @click="handleCancel">取消</n-button>
        <n-button
          v-if="!previewResult && !importResult"
          type="default"
          :loading="previewing"
          :disabled="!hasContent"
          @click="handlePreview"
        >
          预览解析
        </n-button>
        <n-button
          v-if="previewResult && !importResult"
          type="primary"
          :loading="importing"
          @click="handleImport"
        >
          确认导入
        </n-button>
        <n-button
          v-if="importResult?.saved"
          type="success"
          @click="handleGoToBook"
        >
          进入工作台
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { importApi, type ImportPreviewResponse, type ImportResult } from '@/api/import'

const props = defineProps<{
  visible: boolean
  novels: Array<{ id: string; title: string }>
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'import-success': [novelId: string]
}>()

function emitVisibleUpdate(val: boolean) {
  emit('update:visible', val)
}

const router = useRouter()
const message = useMessage()

const importMode = ref<'text' | 'file'>('text')
const textContent = ref('')
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const targetNovelId = ref<string | null>(null)
const previewResult = ref<ImportPreviewResponse | null>(null)
const importResult = ref<ImportResult | null>(null)
const previewing = ref(false)
const importing = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const novelOptions = computed(() =>
  props.novels.map(n => ({ label: n.title, value: n.id }))
)

const hasContent = computed(() => {
  if (importMode.value === 'text') return textContent.value.trim().length > 0
  return selectedFile.value !== null
})

watch(() => props.visible, (val) => {
  if (!val) resetState()
})

function resetState() {
  textContent.value = ''
  selectedFile.value = null
  targetNovelId.value = null
  previewResult.value = null
  importResult.value = null
  importMode.value = 'text'
}

function triggerFileSelect() {
  fileInputRef.value?.click()
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    selectedFile.value = input.files[0]
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file && (file.name.endsWith('.md') || file.name.endsWith('.markdown') || file.name.endsWith('.txt'))) {
    selectedFile.value = file
  } else {
    message.error('请上传 .md / .markdown / .txt 文件')
  }
}

function clearFile() {
  selectedFile.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function fieldLabel(field: string): string {
  const labels: Record<string, string> = {
    premise: '故事梗概',
    characters: '角色',
    world_settings: '世界观',
    locations: '地点',
    style: '文风',
    structure: '剧情结构',
  }
  return labels[field] || field
}

async function handlePreview() {
  previewing.value = true
  try {
    if (importMode.value === 'file' && selectedFile.value) {
      const result = await importApi.parsePreview(selectedFile.value)
      previewResult.value = result
    } else if (importMode.value === 'text' && textContent.value.trim()) {
      const blob = new Blob([textContent.value], { type: 'text/markdown' })
      const file = new File([blob], 'outline.md', { type: 'text/markdown' })
      const result = await importApi.parsePreview(file)
      previewResult.value = result
    }
  } catch (err: any) {
    message.error(err?.message || '解析失败')
  } finally {
    previewing.value = false
  }
}

async function handleImport() {
  importing.value = true
  try {
    if (importMode.value === 'file' && selectedFile.value) {
      const result = await importApi.importFromFile(selectedFile.value, targetNovelId.value || undefined)
      importResult.value = result
      if (result.saved) {
        message.success('导入成功！')
        emit('import-success', result.novel_id)
      }
    } else if (importMode.value === 'text' && textContent.value.trim()) {
      const result = await importApi.importFromText(textContent.value, targetNovelId.value || undefined)
      importResult.value = result
      if (result.saved) {
        message.success('导入成功！')
        emit('import-success', result.novel_id)
      }
    }
  } catch (err: any) {
    const backendMsg = err?.response?.data?.message
    const details = err?.response?.data?.details
    const friendly = details
      ? `${backendMsg || '导入失败'}: ${details.map((d: any) => `${d.field} ${d.message}`).join('；')}`
      : backendMsg || err?.message || '导入失败'
    message.error(friendly)
  } finally {
    importing.value = false
  }
}

function handleGoToBook() {
  if (importResult.value?.novel_id) {
    router.push(`/book/${importResult.value.novel_id}/workbench`)
  }
  handleCancel()
}

function handleCancel() {
  emitVisibleUpdate(false)
}
</script>

<style scoped>
.import-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.import-icon {
  font-size: 20px;
}
.import-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.import-body {
  min-height: 300px;
}

.file-drop-zone {
  border: 2px dashed #d0d0d0;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.file-drop-zone.is-dragging {
  border-color: #18a058;
  background: rgba(24, 160, 88, 0.05);
}
.file-drop-zone:hover {
  border-color: #18a058;
}
.file-drop-icon {
  font-size: 36px;
}
.file-drop-text {
  margin: 8px 0 4px;
  font-size: 14px;
  color: #333;
}
.file-drop-hint {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.file-selected {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 6px;
}
.file-icon {
  font-size: 20px;
}
.file-name {
  flex: 1;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-size {
  font-size: 12px;
  color: #999;
}

.target-novel-section {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.target-label {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.preview-section {
  margin-top: 16px;
}
.preview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
.preview-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 6px;
}
.preview-label {
  font-size: 11px;
  color: #999;
}
.preview-value {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.missing-fields {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
.missing-title {
  font-size: 12px;
  color: #999;
}

.result-section {
  margin-top: 16px;
}
.result-info {
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}
.result-info code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}
</style>
