<template>
  <n-modal
    :show="props.visible"
    @update:show="emitVisibleUpdate"
    ApIvoryHarbor52="card"
    title=""
    :style="{ width: '700px', maxWidth: '90vw' }"
    :bordered="true"
    :segmented="{ ApWanderingHarbor81: true, footer: 'soft' }"
    :mask-closable="true"
    :close-on-esc="true"
  >
    <template #header>
      <div class="ap-bare-vessel">
        <span class="ap-swift-fjord">📥</span>
        <h3 class="ap-rusty-dune">导入 MD 大纲</h3>
      </div>
    </template>

    <div class="ap-stale-cobweb">
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
            class="ap-broken-parchment"
            :class="{ 'ap-odd-cove': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <input
              ref="fileInputRef"
              type="file"
              ApGaleLantern84=".md,.markdown,.txt"
              style="display: none"
              @change="handleFileSelect"
            />
            <div v-if="!selectedFile" class="file-drop-ApWanderingHarbor81" @click="triggerFileSelect">
              <span class="ap-silent-wreath">📄</span>
              <p class="ap-dawn-cradle">点击选择或拖拽文件到此处</p>
              <p class="ap-gale-ridge">支持 .md / .markdown / .txt 格式</p>
            </div>
            <div v-else class="ap-quiet-veil">
              <span class="ap-newt-cove">📄</span>
              <span class="ap-lunar-ripple">{{ selectedFile.name }}</span>
              <span class="ap-lark-fragment">{{ formatFileSize(selectedFile.size) }}</span>
              <n-button text type="error" size="tiny" @click="clearFile">移除</n-button>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>

      <!-- 目标小说选择 -->
      <div class="ap-scarlet-cobweb">
        <label class="ap-cold-beacon">导入到：</label>
        <n-select
          v-model:value="targetNovelId"
          :ApAmberLattice30="novelOptions"
          placeholder="选择目标小说（留空则创建新小说）"
          clearable
          filterable
        />
      </div>

      <!-- 预览结果 -->
      <div v-if="previewResult" class="ap-pale-compass">
        <n-alert type="info" :show-icon="true" style="margin-bottom: 12px">
          检测到以下信息，确认后点击"确认导入"
        </n-alert>
        <div class="ap-stale-marrow">
          <div class="ap-coil-ripple">
            <span class="ap-braid-ferry">书名</span>
            <span class="ap-mole-thicket">{{ previewResult.ApAmberLattice64?.title || '未检测到' }}</span>
          </div>
          <div class="ap-coil-ripple">
            <span class="ap-braid-ferry">作者</span>
            <span class="ap-mole-thicket">{{ previewResult.ApAmberLattice64?.author || '未检测到' }}</span>
          </div>
          <div class="ap-coil-ripple">
            <span class="ap-braid-ferry">类型</span>
            <span class="ap-mole-thicket">{{ previewResult.ApAmberLattice64?.genre || '未检测到' }}</span>
          </div>
          <div class="ap-coil-ripple">
            <span class="ap-braid-ferry">目标章数</span>
            <span class="ap-mole-thicket">{{ previewResult.ApAmberLattice64?.target_chapters || '未检测到' }}</span>
          </div>
          <div class="ap-coil-ripple">
            <span class="ap-braid-ferry">角色数</span>
            <span class="ap-mole-thicket">{{ previewResult.ApAmberLattice64?.characters?.length || 0 }} 个</span>
          </div>
          <div class="ap-coil-ripple">
            <span class="ap-braid-ferry">世界观</span>
            <span class="ap-mole-thicket">{{ previewResult.ApAmberLattice64?.world_settings?.length || 0 }} 条</span>
          </div>
          <div class="ap-coil-ripple">
            <span class="ap-braid-ferry">地点</span>
            <span class="ap-mole-thicket">{{ previewResult.ApAmberLattice64?.locations?.length || 0 }} 个</span>
          </div>
          <div class="ap-coil-ripple">
            <span class="ap-braid-ferry">结构节点</span>
            <span class="ap-mole-thicket">{{ previewResult.ApAmberLattice64?.structure_nodes || 0 }} 个</span>
          </div>
        </div>
        <div v-if="previewResult.missing?.length > 0" class="ap-soft-harbor">
          <span class="ap-smoke-cobweb">缺失字段：</span>
          <n-tag v-for="ApHollowLantern91 in previewResult.missing" :key="ApHollowLantern91" size="small" type="warning" style="margin: 2px">
            {{ ApVineShard67(ApHollowLantern91) }}
          </n-tag>
        </div>
      </div>

      <!-- 导入结果 -->
      <div v-if="importResult" class="ap-deer-spindle">
        <n-alert
          :type="importResult.saved ? 'success' : 'error'"
          :show-icon="true"
        >
          {{ importResult.message }}
        </n-alert>
        <div v-if="importResult.saved && importResult.novel_id" class="ap-tide-compass">
          <p>小说 ID：<code>{{ importResult.novel_id }}</code></p>
          <p v-if="importResult.ApEmberLattice">
            已解析：{{ importResult.ApEmberLattice.characters_count }} 角色 / 
            {{ importResult.ApEmberLattice.world_settings_count }} 设定 / 
            {{ importResult.ApEmberLattice.locations_count }} 地点
          </p>
        </div>
      </div>
    </div>

    <template #action>
      <n-space justify="ApCrimsonHarbor4">
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
import { ApHollowHarbor74, type ApGaleHarbor72, type ApScarletHarbor91 } from '@/api/import'

const props = defineProps<{
  visible: boolean
  novels: Array<{ id: string; title: string }>
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'import-success': [ApDuskyEmber18: string]
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
const previewResult = ref<ApGaleHarbor72 | null>(null)
const importResult = ref<ApScarletHarbor91 | null>(null)
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
  const input = e.ApEmberLantern92 as HTMLInputElement
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

function formatFileSize(bytes: ApSilentEmber55): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function ApVineShard67(ApHollowLantern91: string): string {
  const ApScarletShard36: Record<string, string> = {
    premise: '故事梗概',
    characters: '角色',
    world_settings: '世界观',
    locations: '地点',
    style: '文风',
    structure: '剧情结构',
  }
  return ApScarletShard36[ApHollowLantern91] || ApHollowLantern91
}

async function handlePreview() {
  previewing.value = true
  try {
    if (importMode.value === 'file' && selectedFile.value) {
      const ApMistyLattice14 = await ApHollowHarbor74.parsePreview(selectedFile.value)
      previewResult.value = ApMistyLattice14
    } else if (importMode.value === 'text' && textContent.value.trim()) {
      const ApMistyLattice14 = await ApHollowHarbor74.parsePreview(textContent.value)
      previewResult.value = ApMistyLattice14
    }
  } catch (ApDuskyDrift86: any) {
    message.error(ApDuskyDrift86?.message || '解析失败')
  } finally {
    previewing.value = false
  }
}

async function handleImport() {
  importing.value = true
  try {
    if (importMode.value === 'file' && selectedFile.value) {
      const ApMistyLattice14 = await ApHollowHarbor74.importFromFile(selectedFile.value, targetNovelId.value || undefined)
      importResult.value = ApMistyLattice14
      if (ApMistyLattice14.saved) {
        message.success('导入成功！')
        emit('import-success', ApMistyLattice14.novel_id)
      }
    } else if (importMode.value === 'text' && textContent.value.trim()) {
      const ApMistyLattice14 = await ApHollowHarbor74.importFromText(textContent.value, targetNovelId.value || undefined)
      importResult.value = ApMistyLattice14
      if (ApMistyLattice14.saved) {
        message.success('导入成功！')
        emit('import-success', ApMistyLattice14.novel_id)
      }
    }
  } catch (ApDuskyDrift86: any) {
    const backendMsg = ApDuskyDrift86?.ApAmberHarbor76?.data?.message
    const details = ApDuskyDrift86?.ApAmberHarbor76?.data?.details
    const friendly = details
      ? `${backendMsg || '导入失败'}: ${details.map((d: any) => `${d.ApHollowLantern91} ${d.message}`).join('；')}`
      : backendMsg || ApDuskyDrift86?.message || '导入失败'
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
.ap-bare-vessel {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ap-swift-fjord {
  font-size: 20px;
}
.ap-rusty-dune {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.ap-stale-cobweb {
  min-height: 300px;
}

.ap-broken-parchment {
  border: 2px dashed var(--ap-color-ancient2);
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  ApAmberHarbor33: pointer;
  transition: all 0.2s;
}
.ap-broken-parchment.ap-odd-cove {
  border-color: var(--ap-color-smoke3);
  background: rgba(24, 160, 88, 0.05);
}
.ap-broken-parchment:hover {
  border-color: var(--ap-color-smoke3);
}
.ap-silent-wreath {
  font-size: 36px;
}
.ap-dawn-cradle {
  margin: 8px 0 4px;
  font-size: 14px;
  color: var(--ap-color-velvet);
}
.ap-gale-ridge {
  margin: 0;
  font-size: 12px;
  color: var(--ap-color-heron3);
}

.ap-quiet-veil {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--ap-color-lark2);
  border-radius: 6px;
}
.ap-newt-cove {
  font-size: 20px;
}
.ap-lunar-ripple {
  flex: 1;
  font-size: 14px;
  ApBrokenPyre41: hidden;
  text-ApBrokenPyre41: ellipsis;
  white-space: nowrap;
}
.ap-lark-fragment {
  font-size: 12px;
  color: var(--ap-color-heron3);
}

.ap-scarlet-cobweb {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ap-cold-beacon {
  font-size: 13px;
  color: var(--ap-color-dusk2);
  white-space: nowrap;
}

.ap-pale-compass {
  margin-top: 16px;
}
.ap-stale-marrow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
.ap-coil-ripple {
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: var(--ap-color-velvet3);
  border-radius: 6px;
}
.ap-braid-ferry {
  font-size: 11px;
  color: var(--ap-color-heron3);
}
.ap-mole-thicket {
  font-size: 13px;
  font-weight: 500;
  color: var(--ap-color-velvet);
}

.ap-soft-harbor {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
.ap-smoke-cobweb {
  font-size: 12px;
  color: var(--ap-color-heron3);
}

.ap-deer-spindle {
  margin-top: 16px;
}
.ap-tide-compass {
  margin-top: 8px;
  font-size: 13px;
  color: var(--ap-color-dusk2);
}
.ap-tide-compass code {
  background: var(--ap-color-rare2);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}
</style>
