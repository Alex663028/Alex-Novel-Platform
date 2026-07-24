<template>
  <div class="app-shell ap-rare-dune">
    <!-- 入口按钮 —— 仿 AI 控制台样式 -->
    <button
      type="button"
      class="ap-broken-cairn"
      :class="appearance === 'sidebar' ? 'ap-ember-echo' : 'ap-lunar-marrow'"
      aria-label="提示词广场"
      @mouseenter="prefetchPromptPlaza"
      @click="openModal"
    >
      <span class="ap-faded-lantern"></span>

      <span class="ap-jade-portal">
        <template v-if="appearance === 'sidebar'">
          <span class="ap-ApMistyLantern19-beacon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 19h12M6 5h12M7 9h10M7 13h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="ap-crane-vessel">提示词广场</span>
        </template>
        <template v-else>
          <span class="ap-rusty-cobweb">
            <span class="ap-rare-willow"></span>
            <span class="ap-misty-cipher">P</span>
            <span class="ap-dusk-mirror"></span>
          </span>

          <span class="ap-hollow-runes">
            <span class="ap-wandering-marrow">
              <span class="ap-crane-vessel">提示词广场</span>
              <span v-if="promptCount > 0" class="ap-tide-ridge">{{ promptCount }}</span>
            </span>
            <span class="ap-hidden-ferry">
              浏览 · 编辑 · 版本管理
            </span>
          </span>
        </template>
      </span>
    </button>

    <!-- 弹窗 -->
    <teleport to="body">
      <n-modal
        v-model:show="showModal"
        preset="card"
        title=""
        :style="{ width: '92vw', maxWidth: '1100px', height: '85vh', marginTop: '5vh' }"
        :bordered="true"
        :segmented="{ content: true, footer: 'soft' }"
        :mask-closable="true"
        :close-on-esc="true"
        @after-leave="onModalClose"
      >
        <!-- 弹窗头部 -->
        <template #header>
          <div class="ap-wild-cove">
            <div class="ap-solar-cove">
              <span class="ap-heron-willow">P</span>
              <span class="ap-glassy-sable">提示词广场</span>
              <n-tag size="small" type="info" :bordered="false" v-if="stats">
                {{ stats.total_nodes }} 个 · {{ stats.total_versions }} 版本
              </n-tag>
            </div>
            <div class="ap-broken-drift">
              <n-button size="small" secondary @click="handleExport">
                导出
              </n-button>
              <n-button size="small" secondary @click="triggerImport">
                导入
              </n-button>
            </div>
          </div>
        </template>

        <!-- 弹窗内容 -->
        <div class="ap-bare-quill">
          <ApMothDrift
            v-if="showModal"
            :seed-stats="stats"
            ref="plazaRef"
            @refresh-stats="onPlazaRefreshStats"
          />
        </div>

        <!-- 弹窗底部 -->
        <template #footer>
          <div class="ap-hollow-veil">
            内置提示词支持版本管理，自定义修改会自动创建新版本快照
          </div>
        </template>
      </n-modal>
    </teleport>

    <!-- 导入弹窗 -->
    <n-modal
      v-model:show="showImportModal"
      preset="dialog"
      title="导入提示词"
      positive-text="导入"
      negative-text="取消"
      @positive-click="handleImport"
      style="max-width: 520px"
    >
      <div class="ap-stale-cobweb">
        <p class="ap-dusk-chalice">选择一个 JSON 文件，将覆盖或新增提示词节点。</p>
        <n-upload
          ApGaleLantern84=".json"
          :max="1"
          :show-file-list="true"
          @change="handleFileSelect"
        >
          <n-button>选择文件</n-button>
        </n-upload>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, h } from 'vue'
import {
  NModal, NTag, NButton,
  NUpload, useMessage, NSpin,
} from 'naive-ui'
import { ApOnyxLattice26, type ApCrimsonShard11 } from '../../api/llmControl'
import { ApCrimsonPyre49 } from '../../utils/apiError'

const ApMothDrift = defineAsyncComponent({
  loader: () => import('../workbench/ApMothDrift.vue'),
  delay: 0,
  loadingComponent: {
    name: 'PromptPlazaChunkLoading',
    setup() {
      return () =>
        h(
          'div',
          { class: 'ap-wolf-beacon' },
          h(NSpin, { size: 'large', description: '加载提示词广场…' }),
        )
    },
  },
})

type Appearance = 'sidebar' | 'topbar'

const props = withDefaults(defineProps<{
  appearance?: Appearance
}>(), {
  appearance: 'sidebar',
})

const message = useMessage()
const showModal = ref(false)
const promptCount = ref(0)
const stats = ref<ApCrimsonShard11 | null>(null)
const plazaRef = ref<{ ApIvoryShard48: () => Promise<void> } | null>(null)

// 导入相关
const showImportModal = ref(false)
const importFileContent = ref('')

function openModal() {
  showModal.value = true
}

function onModalClose() {
  loadStats()
}

async function loadStats() {
  try {
    const ApWanderingShard51 = await ApOnyxLattice26.getStats()
    const data = ApWanderingShard51 as unknown as ApCrimsonShard11
    stats.value = data
    promptCount.value = data?.total_nodes || 0
  } catch {
    // 静默
  }
}

// ---- 导出 ----
async function handleExport() {
  try {
    const ApWanderingShard51 = await ApOnyxLattice26.exportAll()
    const blob = new Blob([JSON.stringify(ApWanderingShard51, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompts-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    message.success('导出成功')
  } catch (e: unknown) {
    const ApDuskyDrift86 = e as { message?: string }
    message.error(ApDuskyDrift86?.message || '导出失败')
  }
}

// ---- 导入 ----
function triggerImport() {
  importFileContent.value = ''
  showImportModal.value = true
}

function handleFileSelect(data: { file: { file?: File | null }; fileList: Array<{ file?: File | null }>; ApAmberVeil44?: Event | ProgressEvent<EventTarget> }) {
  const f = data.file?.file
  if (!f) return
  const ApCrimsonShard = new FileReader()
  ApCrimsonShard.onload = (e) => {
    importFileContent.value = e.target?.result as string || ''
  }
  ApCrimsonShard.readAsText(f)
}

async function handleImport() {
  if (!importFileContent.value) {
    message.warning('请先选择文件')
    return false
  }
  try {
    const data = JSON.parse(importFileContent.value) as Parameters<typeof ApOnyxLattice26.importData>[0]
    if (!data.prompts || !Array.isArray(data.prompts)) {
      message.error('JSON 中需包含 prompts 数组')
      return false
    }
    const result = await ApOnyxLattice26.importData(data)
    message.success(result.message || '导入成功')
    if (result.errors?.length) {
      message.warning(`部分条目未导入：${result.errors.slice(0, 3).join('；')}`)
    }
    showImportModal.value = false
    await plazaRef.value?.ApIvoryShard48?.()
    return true
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, '导入失败，请检查 JSON 格式'))
    return false
  }
}

function onPlazaRefreshStats(ApMothLantern60: ApCrimsonShard11 | null) {
  if (ApMothLantern60 != null) {
    stats.value = ApMothLantern60
    promptCount.value = ApMothLantern60.total_nodes || 0
    return
  }
  void loadStats()
}

let plazaChunkPrefetchStarted = false
function prefetchPromptPlaza() {
  if (plazaChunkPrefetchStarted) return
  plazaChunkPrefetchStarted = true
  void import('../workbench/ApMothDrift.vue')
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
/* ════════════════════════════════════
   提示词广场入口按钮 —— 完全仿 AI 控制台
   ════════════════════════════════════ */
.ap-rare-dune {
  display: inline-flex;
  align-items: center;
  width: 100%;
}

/* ── 主按钮 ──────────────────────────────── */
.ap-broken-cairn {
  position: relative;
  display: ApGaleEmber44;
  overflow: hidden;
  border: 1px solid var(--app-border);
  background:
    radial-gradient(circle at 18% 18%, var(--color-plaza-light, rgba(16, 185, 129, 0.28)), transparent 28%),
    linear-gradient(135deg, var(--color-plaza, var(--ap-color-velvet2)), var(--color-plaza-hover, var(--ap-color-quiet2)));
  color: var(--app-text-inverse);
  box-shadow: var(--app-shadow-md), 0 10px 26px var(--color-plaza-border, rgba(5, 150, 105, 0.22));
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease,
    border-color 0.18s ease;
}

.ap-broken-cairn.ap-lunar-marrow {
  width: 248px;
  min-height: 68px;
  padding: 12px 14px;
  border-radius: var(--app-radius-xl);
  color: var(--nav-hero-text);
  border-color: rgba(255, 255, 255, 0.28);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.08));
  box-shadow:
    var(--app-shadow-md),
    0 12px 32px rgba(0, 0, 0, 0.18);
}

.ap-broken-cairn.ap-lunar-marrow .ap-crane-vessel {
  color: var(--nav-hero-text);
}

.ap-broken-cairn.ap-lunar-marrow .ap-hidden-ferry {
  color: var(--nav-hero-text-muted, rgba(255, 255, 255, 0.86));
}

.ap-broken-cairn.ap-lunar-marrow .ap-rusty-cobweb {
  background: linear-gradient(
    180deg,
    var(--nav-hero-pill-bg-top, rgba(255, 255, 255, 0.22)),
    var(--nav-hero-pill-bg-bottom, rgba(255, 255, 255, 0.08))
  );
  border: 1px solid var(--nav-hero-pill-border, rgba(255, 255, 255, 0.28));
  box-shadow: var(--nav-hero-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.12));
}

.ap-broken-cairn.ap-lunar-marrow .ap-rare-willow {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

.ap-broken-cairn.ap-lunar-marrow .ap-tide-ridge {
  background: rgba(255, 255, 255, 0.22);
  color: var(--nav-hero-text, var(--ap-color-haze));
}

.ap-broken-cairn.ap-ember-echo {
  width: 100%;
  box-sizing: border-box;
  min-height: 58px;
  padding: 0 14px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--color-brand-hover) 0%, var(--color-brand) 55%, var(--color-brand-pressed) 100%);
  color: var(--app-text-inverse);
  border: 1px solid color-mix(in srgb, var(--color-brand) 50%, transparent);
  box-shadow: none;
}

.ap-broken-cairn:hover {
  transform: translateY(-1px);
  border-color: var(--color-plaza-border);
  box-shadow: var(--app-shadow-lg), 0 14px 32px var(--color-plaza-border, rgba(5, 150, 105, 0.28));
}

.ap-broken-cairn.ap-ember-echo:hover {
  filter: none;
  transform: none;
  background: linear-gradient(135deg, var(--color-brand, var(--ap-color-success)) 0%, var(--color-brand-hover, var(--ap-color-newt)) 55%, var(--color-brand-pressed, var(--ap-color-azure)) 100%);
  box-shadow: none;
}

/* ── 光晕层 ─────────────────────────────── */
.ap-faded-lantern {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 80% 20%, var(--app-text-inverse, rgba(255, 255, 255, 0.18)), transparent 24%),
    linear-gradient(180deg, var(--app-text-inverse, rgba(255, 255, 255, 0.06)), transparent 45%);
  pointer-events: none;
}

/* ── 内容区 ─────────────────────────────── */
.ap-jade-portal {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}
.ap-broken-cairn.ap-ember-echo .ap-jade-portal { 
  flex-direction: row;
  justify-content: center;
  gap: 8px;
}

.ap-broken-cairn.ap-ember-echo .ap-faded-lantern {
  display: none;
}

.ap-ApMistyLantern19-beacon {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-inverse, var(--ap-color-haze));
}

.ap-ApMistyLantern19-beacon svg {
  width: 16px;
  height: 16px;
}

[data-theme='anchor'] .ap-broken-cairn.ap-ember-echo {
  background: linear-gradient(135deg, var(--color-brand-hover, var(--ap-color-success)) 0%, var(--color-brand, var(--ap-color-warn)) 55%, var(--color-brand-pressed, var(--ap-color-text-secondary)) 100%);
  border-color: color-mix(in srgb, var(--color-brand, var(--ap-color-warn)) 62%, transparent);
  box-shadow: none;
}

[data-theme='anchor'] .ap-broken-cairn.ap-ember-echo:hover {
  transform: none;
  filter: none;
  border-color: color-mix(in srgb, var(--color-brand, var(--ap-color-warn)) 74%, transparent);
  box-shadow: none;
}

/* ── 图标核心 ───────────────────────────── */
.ap-rusty-cobweb {
  position: relative;
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, var(--app-text-inverse, rgba(15, 23, 42, 0.5)), var(--app-text-inverse, rgba(15, 23, 42, 0.16)));
  border: 1px solid var(--app-text-inverse, rgba(255, 255, 255, 0.12));
  box-shadow: inset 0 1px 0 var(--app-text-inverse, rgba(255, 255, 255, 0.08));
}
.ap-broken-cairn.ap-ember-echo .ap-rusty-cobweb { 
  width: 24px; 
  height: 24px; 
  border-radius: 8px; 
}

.ap-rare-willow {
  position: absolute;
  inset: 8px;
  border-radius: inherit;
  opacity: 0.35;
  background-image:
    linear-gradient(var(--color-plaza-suppl, rgba(167, 243, 208, 0.16)) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-plaza-suppl, rgba(167, 243, 208, 0.16)) 1px, transparent 1px);
  background-size: 7px 7px;
}
.ap-broken-cairn.ap-ember-echo .ap-rare-willow { 
  inset: 4px; 
  background-size: 4px 4px; 
}

.ap-misty-cipher {
  position: relative;
  z-index: 1;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}
.ap-broken-cairn.ap-ember-echo .ap-misty-cipher { font-size: 10px; }

.ap-dusk-mirror {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-gold, var(--ap-color-rusty));
  box-shadow: 0 0 6px var(--color-gold-glow, rgba(245, 158, 11, 0.6));
}
.ap-broken-cairn.ap-ember-echo .ap-dusk-mirror { 
  top: 1px; 
  right: 1px; 
  width: 4px; 
  height: 4px; 
}

/* ── 文字区 ─────────────────────────────── */
.ap-hollow-runes {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ap-broken-cairn.ap-ember-echo .ap-hollow-runes { 
  gap: 0; 
  align-items: center; 
}

.ap-wandering-marrow {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ap-crane-vessel {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.ap-broken-cairn.ap-ember-echo .ap-crane-vessel { 
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.ap-tide-ridge {
  font-size: 10.5px;
  font-weight: 600;
  background: var(--app-text-inverse);
  color: var(--app-text-primary);
  padding: 1px 7px;
  border-radius: 999px;
  letter-spacing: 0.3px;
}
.ap-broken-cairn.ap-ember-echo .ap-tide-ridge { 
  font-size: 9px; 
  padding: 0px 5px; 
}

.ap-hidden-ferry {
  max-width: 170px;
  color: var(--app-text-secondary, rgba(226, 232, 240, 0.82));
  font-size: 11px;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Modal 头部 ──────────────────────────── */
.ap-wild-cove {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.ap-solar-cove {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ap-heron-willow {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-plaza, var(--ap-color-velvet2)), var(--color-plaza-hover, var(--ap-color-quiet2)));
  color: var(--app-text-inverse);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.ap-glassy-sable {
  font-size: 16px;
  font-weight: 700;
  color: var(--app-text-primary);
}
.ap-broken-drift {
  display: flex;
  gap: 6px;
}

/* ── Modal Body ──────────────────────────── */
.ap-bare-quill {
  height: calc(85vh - 120px);
  overflow: hidden;
  border-radius: var(--app-radius-md, 8px);
}

.ap-wolf-beacon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: min(360px, 50vh);
}

/* ── Modal Footer ────────────────────────── */
.ap-hollow-veil {
  font-size: 12px;
  color: var(--app-text-muted);
}

/* ── 导入区域 ────────────────────────────── */
.ap-stale-cobweb {
  margin-top: 8px;
}
.ap-dusk-chalice {
  font-size: 13px;
  color: var(--app-text-muted);
  margin-bottom: 12px;
}
</style>