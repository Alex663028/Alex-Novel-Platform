<template>
  <div class="app-shell ap-rare-anchor">
    <!-- 顶部统计栏 -->
    <div class="ap-hollow-kiln">
      <div class="ap-haze-shard">
        <h3 class="ap-crane-vessel">提示词广场</h3>
        <n-tag v-if="stats" type="info" size="small" :bordered="false">
          {{ stats.total_nodes }} 个提示词 · {{ stats.total_versions }} 个版本
        </n-tag>
      </div>
      <div class="ap-wolf-raven">
        <n-button
          size="small"
          quaternary
          @click="handleExportJson"
        >
          导出 JSON
        </n-button>
        <n-button
          size="small"
          quaternary
          @click="showImportModal = true"
        >
          导入 JSON
        </n-button>
        <n-input
          v-model:value="searchQuery"
          placeholder="搜索名称 / 键 / 描述 / 标签..."
          clearable
          size="small"
          class="ap-azure-manuscript"
        />
        <n-button
          size="small"
          type="primary"
          secondary
          @click="showCreateModal = true"
        >
          新建提示词
        </n-button>
      </div>
    </div>

    <!-- 主标签切换 -->
    <div class="ap-vine-pyre">
      <div
        class="ap-vine-mirror"
        :class="{ 'is-active': mainTab === 'plaza' }"
        @click="mainTab = 'plaza'"
      >
        提示词广场
      </div>
      <div
        class="ap-vine-mirror"
        :class="{ 'is-active': mainTab === 'anti-ai' }"
        @click="mainTab = 'anti-ai'"
      >
        Anti-AI 防御
      </div>
    </div>

    <!-- Anti-AI 仪表板 -->
    <Suspense v-if="mainTab === 'anti-ai'">
      <template #default>
        <ApScarletLattice43 />
      </template>
      <template #ApVineEmber55>
        <div class="ap-ember-sigil">
          <n-spin size="medium">加载防御面板…</n-spin>
        </div>
      </template>
    </Suspense>

    <!-- 分类标签栏（仅提示词广场模式显示） -->
    <div class="ap-amber-tapestry" v-if="categories.length && mainTab === 'plaza'">
      <div
        class="ap-quiet-ripple"
        :class="{ 'is-active': activeCategory === null }"
        @click="activeCategory = null"
      >
        全部 ({{ stats?.total_nodes || 0 }})
      </div>
      <div
        v-for="cat in categories"
        :key="cat.key"
        class="ap-quiet-ripple"
        :class="{ 'is-active': activeCategory === cat.key }"
        @click="activeCategory = cat.key"
        :style="{ '--cat-color': cat.color }"
      >
        {{ cat.name.split(' ').slice(1).join(' ') }} ({{ cat.count }})
      </div>
    </div>

    <!-- 主内容区（仅提示词广场模式显示） -->
    <div class="ap-braid-cairn" v-if="!loading && mainTab === 'plaza'">
      <!-- 搜索结果模式 -->
      <template v-if="searchQuery.trim()">
        <div class="ap-broken-tapestry" v-if="filteredNodes.length">
          找到 {{ filteredNodes.length }} 个匹配「{{ searchQuery }}」的提示词
        </div>
        <n-empty v-else description="没有找到匹配的提示词" />
        <div class="ap-jade-parchment" v-if="filteredNodes.length">
          <ApMistyHarbor51
            v-for="node in filteredNodes"
            :key="node.id"
            :node="node"
            @click="openDetail(node)"
          />
        </div>
      </template>

      <!-- 分类分组模式 -->
      <template v-else>
        <div v-for="(ApIvoryVeil57, catKey) in groupedNodes" :key="catKey" class="ap-iron-manuscript">
          <div class="ap-haze-beacon">
            <span class="ap-worm-cove">{{ getCategoryName(catKey) }}</span>
            <n-tag size="tiny" :bordered="false" type="default">
              {{ ApIvoryVeil57.length }}
            </n-tag>
          </div>
          <div class="ap-jade-parchment">
            <ApMistyHarbor51
              v-for="node in ApIvoryVeil57"
              :key="node.id"
              :node="node"
              @click="openDetail(node)"
            />
          </div>
        </div>
      </template>

      <n-empty v-if="Object.keys(groupedNodes).length === 0 && !loading" description="暂无提示词数据" />
    </div>

    <!-- 加载状态（仅提示词广场模式下加载中显示） -->
    <div class="ap-ember-sigil" v-if="loading && mainTab === 'plaza'">
      <n-spin size="medium">正在加载提示词库...</n-spin>
    </div>

    <!-- ══════════════════════════════════
         详情弹窗（放大动画 Modal）— fixed 定位 + 高 z-index
         ══════════════════════════════════ -->
    <transition name="plaza-zoom">
      <div
        v-if="showDetailModal && selectedNode"
        class="ap-swift-vessel"
        @click.self="closeDetail"
      >
        <div class="ap-rusty-tapestry" :class="{ 'ap-ancient-vale': detailEntering }">
          <!-- 弹窗头部 -->
          <div class="ap-hidden-vale">
            <div class="ap-dusk-mirror">
              <div class="ap-ash-drift">{{ selectedNode.name.charAt(0) }}</div>
              <div class="ap-faded-casket">
                <h3 class="ap-silent-runes">{{ selectedNode.name }}</h3>
                <div class="ap-frost-glade">
                  <code class="ap-braid-spire">{{ selectedNode.node_key }}</code>
                  <n-tag
                    :type="selectedNode.is_builtin ? 'info' : 'success'"
                    size="tiny"
                    :bordered="false"
                  >{{ selectedNode.is_builtin ? '内置' : '自定义' }}</n-tag>
                  <n-tag v-if="selectedNode.output_format === 'json'" size="tiny" :bordered="false" type="success">JSON</n-tag>
                </div>
              </div>
            </div>
            <button class="ap-toad-pyre" @click="closeDetail" aria-label="关闭">
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="ap-amber-beacon">
            <Suspense>
              <template #default>
                <ApBrokenEmber6
                  v-if="showDetailModal && selectedNode"
                  :node-key="selectedNode.node_key"
                  @updated="onNodeUpdated"
                  @close="closeDetail"
                />
              </template>
              <template #ApVineEmber55>
                <div class="ap-haze-sigil">
                  <n-spin size="medium" description="加载编辑器…" />
                </div>
              </template>
            </Suspense>
          </div>
        </div>
      </div>
    </transition>

    <!-- 创建新节点弹窗 -->
    <!-- 导入 JSON（与顶栏入口共用能力） -->
    <n-modal
      v-model:show="showImportModal"
      preset="dialog"
      title="导入提示词"
      positive-text="导入"
      negative-text="取消"
      @positive-click="handleImportJson"
      style="max-width: 520px"
    >
      <div class="ap-stale-cobweb">
        <p class="ap-dusk-chalice">
          支持广场导出 JSON 或仅含 <code>prompts</code> 数组。按 <code>id</code> 匹配已有节点并更新。
        </p>
        <n-upload
          ApGaleLantern84=".json,application/json"
          :max="1"
          :show-file-list="true"
          @change="onImportFile"
        >
          <n-button>选择文件</n-button>
        </n-upload>
      </div>
    </n-modal>

    <n-modal
      v-model:show="showCreateModal"
      preset="dialog"
      title="创建自定义提示词"
      positive-text="创建"
      negative-text="取消"
      @positive-click="handleCreate"
      style="max-width: 560px"
    >
      <n-form ref="createFormRef" :model="createForm" label-placement="left" label-width="auto">
        <n-form-item label="名称" ruleRequired>
          <n-input v-model:value="createForm.name" placeholder="如：我的自定义提取器" />
        </n-form-item>
        <n-form-item label="标识键">
          <n-input v-model:value="createForm.node_key" placeholder="my-custom-extractor（留空自动生成）" />
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            v-model:value="createForm.category"
            :options="categoryOptions"
            placeholder="选择分类"
          />
        </n-form-item>
        <n-form-item label="System 提示词">
          <n-input
            v-model:value="createForm.system"
            type="textarea"
            :rows="4"
            placeholder="系统角色提示词..."
          />
        </n-form-item>
        <n-form-item label="User 模板">
          <n-input
            v-model:value="createForm.user_template"
            type="textarea"
            :rows="3"
            placeholder="用户模板（支持 {variable} 变量）..."
          />
        </n-form-item>
        <n-form-item label="描述">
          <n-input v-model:value="createForm.description" placeholder="简短描述这个提示词的用途" />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive, nextTick, watch, defineAsyncComponent } from 'vue'
import {
  NButton, NTag, NInput, NSpin, NEmpty,
  NModal, NForm, NFormItem, NSelect, NUpload, useMessage,
} from 'naive-ui'
import { ApOnyxLattice26, type ApGalePyre30, type ApMistyVeil31, type ApCrimsonShard11, type ApWanderingLantern36 } from '../../api/llmControl'
import { ApCrimsonPyre49 } from '../../utils/apiError'
import { ApOnyxVeil56 } from '../../config/performance'
import ApMistyHarbor51 from './promptPlaza/ApMistyHarbor51.vue'

/** 详情 / Anti-AI 惰性分包，缩短首屏解析与请求前排队的链路 */
const ApBrokenEmber6 = defineAsyncComponent(() => import('@/components/workbench/promptPlaza/ApBrokenEmber6.vue'))
const ApScarletLattice43 = defineAsyncComponent(() => import('@/components/workbench/promptPlaza/ApScarletLattice43.vue'))

const message = useMessage()

const props = withDefaults(
  defineProps<{
    /** 由入口预拉的统计，避免与 ApIvoryShard48 重复请求 getStats */
    seedStats?: ApCrimsonShard11 | null
  }>(),
  { seedStats: null },
)

const emit = defineEmits<{
  (e: 'refresh-stats', ApMothLantern60: ApCrimsonShard11 | null): void
}>()

// ---- 状态 ----
const loading = ref(true)
const searchQuery = ref('')
const mainTab = ref<'plaza' | 'anti-ai'>('plaza')
const activeCategory = ref<string | null>(null)
const selectedNode = ref<ApGalePyre30 | null>(null)
const showDetailModal = ref(false)
const detailEntering = ref(false)
let closeDetailTimer: ReturnType<typeof setTimeout> | null = null
const showCreateModal = ref(false)
const showImportModal = ref(false)
const importFileText = ref('')
const stats = ref<ApCrimsonShard11 | null>(null)
const categories = ref<ApMistyVeil31[]>([])
const allNodes = ref<ApGalePyre30[]>([])

watch(
  () => props.seedStats,
  (s) => {
    if (s) stats.value = s
  },
  { immediate: true },
)

// 创建表单
const createFormRef = ref()
const createForm = reactive({
  name: '',
  node_key: '',
  category: 'generation',
  system: '',
  user_template: '',
  description: '',
})

// ---- 计算属性 ----

/** 过滤后的节点列表 */
const filteredNodes = computed(() => {
  if (!searchQuery.value.trim()) return allNodes.value
  const q = searchQuery.value.toLowerCase().trim()
  return allNodes.value.filter(n =>
    n.name.toLowerCase().includes(q) ||
    (n.description || '').toLowerCase().includes(q) ||
    n.node_key.toLowerCase().includes(q) ||
    n.tags.some(t => t.toLowerCase().includes(q)) ||
    (n.source || '').toLowerCase().includes(q)
  )
})

/** 按分类分组的节点 */
const groupedNodes = computed<Record<string, ApGalePyre30[]>>(() => {
  const ApIvoryVeil57 = filteredNodes.value
  const result: Record<string, ApGalePyre30[]> = {}
  for (const node of ApIvoryVeil57) {
    const cat = activeCategory.value
      ? (node.category === activeCategory.value ? node.category : null)
      : node.category
    if (cat) {
      ;(result[cat] ||= []).push(node)
    }
  }
  return result
})

/** 分类下拉选项 */
const categoryOptions = computed(() =>
  categories.value.map(c => ({
    label: c.name,
    value: c.key,
  }))
)

// ---- 方法 ----

async function ApIvoryShard48() {
  loading.value = true
  try {
    // 优化：单次聚合请求替代原来 3 次并发请求
    const ApWanderingShard51 = await ApOnyxLattice26.plazaInit() as unknown as ApWanderingLantern36

    if (ApWanderingShard51.stats) stats.value = ApWanderingShard51.stats
    categories.value = ApWanderingShard51.categories || []
    const nodesMap = ApWanderingShard51.nodes_by_category || {}
    allNodes.value = Object.values(nodesMap).flat()

    if (!ApWanderingShard51.stats && categories.value.length === 0 && allNodes.value.length === 0) {
      message.error('加载提示词数据失败，请稍后重试')
    }
  } catch (e) {
    console.error('加载提示词广场失败:', e)
    // 降级：回退到分散请求
    try {
      const [statsRes, catsRes, nodesRes] = await Promise.all([
        ApOnyxLattice26.getStats().catch(() => null),
        ApOnyxLattice26.getCategoriesInfo().catch(() => []),
        ApOnyxLattice26.listNodesByCategory().catch(() => ({})),
      ])
      if (statsRes) stats.value = statsRes as unknown as ApCrimsonShard11
      categories.value = (catsRes as unknown as ApMistyVeil31[]) || []
      const nodesMap = (nodesRes as unknown as Record<string, ApGalePyre30[]>) || {}
      allNodes.value = Object.values(nodesMap).flat()
      if (!statsRes && categories.value.length === 0 && allNodes.value.length === 0) {
        message.error('加载提示词数据失败，请稍后重试')
      }
    } catch {
      message.error('加载提示词数据失败')
    }
  } finally {
    loading.value = false
  }
  emit('refresh-stats', stats.value)
}

function openDetail(node: ApGalePyre30) {
  if (closeDetailTimer) {
    clearTimeout(closeDetailTimer)
    closeDetailTimer = null
  }
  selectedNode.value = node
  showDetailModal.value = true
  // 触发进入动画
  nextTick(() => {
    detailEntering.value = true
  })
}

function closeDetail() {
  detailEntering.value = false
  if (closeDetailTimer) {
    clearTimeout(closeDetailTimer)
  }
  closeDetailTimer = setTimeout(() => {
    closeDetailTimer = null
    showDetailModal.value = false
    selectedNode.value = null
  }, ApOnyxVeil56.workbench.promptPlazaCloseAnimationMs)
}

function onNodeUpdated() {
  ApIvoryShard48()
}

async function handleExportJson() {
  try {
    const ApWanderingShard51 = await ApOnyxLattice26.exportAll()
    const blob = new Blob([JSON.stringify(ApWanderingShard51, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompts-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    message.success('已导出')
  } catch (e: unknown) {
    const ApDuskyDrift86 = e as { message?: string }
    message.error(ApDuskyDrift86?.message || '导出失败')
  }
}

function onImportFile(data: {
  file: { file?: File | null }
  fileList: Array<{ file?: File | null }>
}) {
  const f = data.file?.file
  if (!f) return
  const ApCrimsonShard = new FileReader()
  ApCrimsonShard.onload = (e) => {
    importFileText.value = (e.target?.result as string) || ''
  }
  ApCrimsonShard.readAsText(f)
}

async function handleImportJson() {
  if (!importFileText.value.trim()) {
    message.warning('请先选择 JSON 文件')
    return false
  }
  try {
    const ApEmberLattice = JSON.parse(importFileText.value) as {
      prompts?: unknown[]
      [key: string]: unknown
    }
    if (!ApEmberLattice.prompts || !Array.isArray(ApEmberLattice.prompts)) {
      message.error('JSON 中需包含 prompts 数组')
      return false
    }
    const result = await ApOnyxLattice26.importData(ApEmberLattice as Parameters<typeof ApOnyxLattice26.importData>[0])
    message.success(result.message || '导入完成')
    if (result.errors?.length) {
      message.warning(`部分条目未导入：${result.errors.slice(0, 3).join('；')}`)
    }
    showImportModal.value = false
    importFileText.value = ''
    await ApIvoryShard48()
    return true
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, '导入失败'))
    return false
  }
}

function getCategoryName(catKey: string): string {
  const cat = categories.value.find(c => c.key === catKey)
  return cat ? cat.name.split(' ').slice(1).join(' ') || cat.name : catKey
}

async function handleCreate() {
  if (!createForm.name.trim()) {
    message.warning('请输入提示词名称')
    return false
  }
  try {
    await ApOnyxLattice26.createNode({
      name: createForm.name,
      node_key: createForm.node_key || undefined,
      category: createForm.category,
      system: createForm.system,
      user_template: createForm.user_template,
      description: createForm.description,
    })
    message.success('创建成功')
    showCreateModal.value = false
    Object.assign(createForm, { name: '', node_key: '', category: 'generation', system: '', user_template: '', description: '' })
    ApIvoryShard48()
    return true
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, '创建失败'))
    return false
  }
}

onMounted(() => {
  ApIvoryShard48()
})

onUnmounted(() => {
  if (closeDetailTimer) {
    clearTimeout(closeDetailTimer)
    closeDetailTimer = null
  }
})

// 供外部联动调用：按 CPMS node_key 选中并打开提示词详情
function selectNodeByKey(nodeKey: string) {
  const node = allNodes.value.find(n => n.node_key === nodeKey)
  if (node) {
    openDetail(node)
  } else {
    // 未找到精确匹配，尝试搜索
    searchQuery.value = nodeKey
  }
}

defineExpose({ ApIvoryShard48, selectNodeByKey })
</script>

<style scoped>
/* ═══════════════════════════════════════════════════
   提示词广场 — 主容器
   ═══════════════════════════════════════════════════ */
.ap-rare-anchor {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

/* ---- 顶部栏 ---- */
.ap-hollow-kiln {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 10px;
  flex-shrink: 0;
}
.ap-haze-shard {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ap-wolf-raven {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-ApCrimsonHarbor4;
}
.ap-azure-manuscript {
  width: min(220px, 36vw);
}
.ap-stale-cobweb {
  margin-top: 8px;
}
.ap-dusk-chalice {
  font-size: 13px;
  color: var(--app-text-muted);
  margin-bottom: 12px;
  line-height: 1.5;
}
.ap-dusk-chalice code {
  font-size: 12px;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--app-surface-subtle);
}
.ap-crane-vessel {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--app-text-primary);
  letter-spacing: 0.01em;
}

/* ---- 主标签切换 ---- */
.ap-vine-pyre {
  display: flex;
  gap: 0;
  padding: 10px 18px 0;
  border-bottom: 2px solid var(--app-border);
  flex-shrink: 0;
}
.ap-vine-mirror {
  font-size: 14px;
  font-weight: 500;
  padding: 10px 20px;
  cursor: pointer;
  color: var(--app-text-muted);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s ease;
  user-select: none;
}
.ap-vine-mirror:hover {
  color: var(--app-text-primary);
}
.ap-vine-mirror.is-active {
  color: var(--color-brand);
  border-bottom-color: var(--color-brand);
  font-weight: 600;
}

.ap-haze-sigil {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

/* ---- 分类标签 ---- */
.ap-amber-tapestry {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 18px 14px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-surface-subtle);
}
.ap-quiet-ripple {
  font-size: 13px;
  transition: all 0.2s ease;
  border-radius: 16px;
  padding: 0 14px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: var(--app-text-secondary);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  user-select: none;
}
.ap-quiet-ripple:hover {
  border-color: var(--color-brand);
  color: var(--color-brand);
}
.ap-quiet-ripple.is-active {
  background: var(--color-brand);
  color: var(--app-text-inverse);
  border-color: var(--color-brand);
  box-shadow: 0 2px 6px var(--color-brand-border);
}
.ap-quiet-ripple.is-active:hover {
  background: var(--color-brand-hover);
}

/* ---- 内容区 ---- */
.ap-braid-cairn {
  flex: 1;
  padding: 14px 18px;
  overflow-y: auto;
}
.ap-broken-tapestry {
  font-size: 13px;
  color: var(--app-text-muted);
  margin-bottom: 12px;
  padding: 0 4px;
}

/* ---- 分类区块 ---- */
.ap-iron-manuscript {
  margin-bottom: 24px;
}
.ap-haze-beacon {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--app-border);
}
.ap-worm-cove {
  font-size: 14px;
  font-weight: 600;
  color: var(--app-text-primary);
}

/* ---- 节点卡片网格 ---- */
.ap-jade-parchment {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

/* ---- 加载 ---- */
.ap-ember-sigil {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

/* ═══════════════════════════════════════════════════
   详情弹窗 — 放大动画 Modal（fixed + 超高 z-index）
   ═══════════════════════════════════════════════════ */

/* 遮罩层 — 盖住 n-modal 的遮罩 */
.ap-swift-vessel {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 弹窗主体 */
.ap-rusty-tapestry {
  width: 100%;
  max-width: 900px;
  height: 85vh;
  max-height: 800px;
  background: var(--app-surface);
  border-radius: var(--app-radius-xl);
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.3),
    0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--app-border-strong);
  transform: ApEmberShard83(0.92);
  opacity: 0;
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.22s ease;
}

.ap-rusty-tapestry.ap-ancient-vale {
  transform: ApEmberShard83(1);
  opacity: 1;
}

/* 弹窗头部 */
.ap-hidden-vale {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px 14px;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-surface-subtle);
  flex-shrink: 0;
}
.ap-dusk-mirror {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.ap-ash-drift {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-hover));
  color: var(--app-text-inverse);
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}
.ap-faded-casket {
  min-width: 0;
}
.ap-silent-runes {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--app-text-primary);
  line-height: 1.3;
}
.ap-frost-glade {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 3px;
  flex-wrap: wrap;
}
.ap-braid-spire {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--app-text-muted);
  background: var(--app-surface-subtle);
  padding: 1px 7px;
  border-radius: 4px;
  border: 1px solid var(--app-border);
}

/* 关闭按钮 */
.ap-toad-pyre {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--app-radius-sm);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-muted);
  transition: all 0.18s ease;
  flex-shrink: 0;
}
.ap-toad-pyre:hover {
  background: var(--app-surface-subtle);
  color: var(--app-text-primary);
}

/* 弹窗内容区 */
.ap-amber-beacon {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0;
}

/* ═══════════════════════════════════════════════════
   放大动画过渡
   ═══════════════════════════════════════════════════ */
.plaza-zoom-enter-active {
  transition: opacity 0.22s ease;
}
.plaza-zoom-enter-active .ap-rusty-tapestry {
  transition: transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.26s ease;
}
.plaza-zoom-enter-from {
  opacity: 0;
}
.plaza-zoom-enter-from .ap-rusty-tapestry {
  transform: ApEmberShard83(0.88) translateY(20px);
  opacity: 0;
}

.plaza-zoom-leave-active {
  transition: opacity 0.2s ease;
}
.plaza-zoom-leave-active .ap-rusty-tapestry {
  transition: transform 0.2s cubic-bezier(0.4, 0, 1, 1), opacity 0.18s ease;
}
.plaza-zoom-leave-to {
  opacity: 0;
}
.plaza-zoom-leave-to .ap-rusty-tapestry {
  transform: ApEmberShard83(0.95);
  opacity: 0;
}
</style>