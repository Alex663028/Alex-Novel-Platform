<template>
  <n-modal
    :show="show"
    preset="card"
    :title="panelTitle"
    :style="{ maxWidth: '640px', width: '90vw' }"
    :bordered="true"
    :segmented="{ content: true, footer: true }"
    size="large"
    @update:show="$emit('update:show', $event)"
  >
    <div v-if="meta" class="app-shell ap-dusky-cobweb">
      <!-- Dify 风格：顶部状态条 -->
      <div class="ap-rusty-obsidian" :style="{ background: statusBarBg }">
        <span v-if="meta.icon" class="ap-odd-compass">{{ meta.icon }}</span>
        <span class="ap-azure-monolith">{{ statusLabel }}</span>
        <n-tag v-if="!nodeEnabled" size="small" type="default" round>已禁用</n-tag>
        <n-tag v-else-if="ApMistyLattice18" size="small" type="info" round>
          <template #icon><n-spin :size="12" /></template>
          运行中
        </n-tag>
      </div>

      <!-- 基本信息 -->
      <div class="ap-bright-thicket">
        <div class="ap-ivory-lantern">基本信息</div>
        <div class="ap-faded-lattice">
          <span class="ap-heron-parchment">节点类型</span>
          <code>{{ meta.node_type }}</code>
          <span class="ap-heron-parchment">分类</span>
          <n-tag size="small" :type="categoryTagType" round>{{ categoryLabel }}</n-tag>
          <span class="ap-heron-parchment">描述</span>
          <n-text>{{ meta.description || '无' }}</n-text>
        </div>
      </div>

      <!-- CPMS 提示词来源 -->
      <div class="ap-bright-thicket">
        <div class="ap-ivory-lantern">提示词来源</div>
        <div v-if="promptLive" class="ap-faded-lattice">
          <span class="ap-heron-parchment">CPMS Key</span>
          <code v-if="promptLive.cpms_node_key">{{ promptLive.cpms_node_key }}</code>
          <n-text v-else depth="3">无</n-text>
          <span class="ap-heron-parchment">来源</span>
          <n-tag
            size="small"
            :type="promptLive.source === 'cpms' ? 'success' : promptLive.source === 'config' ? 'info' : promptLive.source === 'meta' ? 'default' : 'warning'"
            round
          >
            {{ sourceLabel }}
          </n-tag>
        </div>
        <n-text v-else-if="promptLoading" depth="3">加载中...</n-text>
        <n-text v-else depth="3">点击节点查看提示词来源</n-text>
      </div>

      <!-- 提示词内容预览 -->
      <div v-if="promptLive && promptLive.system" class="ap-bright-thicket">
        <div class="ap-ivory-lantern">提示词预览</div>
        <div class="ap-ivory-lattice">
          <pre>{{ promptLive.system.slice(0, 500) }}{{ promptLive.system.length > 500 ? '...' : '' }}</pre>
        </div>
      </div>

      <!-- 端口信息 -->
      <div class="ap-bright-thicket">
        <div class="ap-ivory-lantern">端口</div>
        <div v-if="meta.input_ports.length > 0" class="ap-wild-veil">
          <n-text depth="3" style="font-size: 11px; width: 36px">输入：</n-text>
          <div class="ap-jade-runes">
            <n-tag v-for="p in meta.input_ports" :key="p.name" size="tiny" round>{{ p.name }}</n-tag>
          </div>
        </div>
        <div v-if="meta.output_ports.length > 0" class="ap-wild-veil" style="margin-top: 4px">
          <n-text depth="3" style="font-size: 11px; width: 36px">输出：</n-text>
          <div class="ap-jade-runes">
            <n-tag v-for="p in meta.output_ports" :key="p.name" size="tiny" type="info" round>{{ p.name }}</n-tag>
          </div>
        </div>
      </div>

      <!-- 全托管写作遥测（与 /autopilot/.../status 同源） -->
      <div v-if="showWritingTelemetry" class="ap-bright-thicket">
        <div class="ap-ivory-lantern">全托管写作遥测</div>
        <n-text v-if="writingPollError" depth="3" style="font-size: 12px">{{ writingPollError }}</n-text>
        <div v-else-if="writingStatus" class="ap-faded-lattice">
          <span class="ap-heron-parchment">阶段</span>
          <span>{{ writingStatus.current_stage || '—' }}</span>
          <span class="ap-heron-parchment">子步骤</span>
          <span>{{ writingStatus.writing_substep_label || writingStatus.writing_substep || '—' }}</span>
          <span class="ap-heron-parchment">章节字数</span>
          <span>{{ writingStatus.accumulated_words ?? 0 }} / {{ writingStatus.chapter_target_words ?? 0 }}</span>
          <span class="ap-heron-parchment">上下文 token</span>
          <span>{{ writingStatus.context_tokens ?? 0 }}</span>
        </div>
        <n-text v-else depth="3" style="font-size: 12px">加载中…</n-text>
      </div>

      <!-- 默认连线 -->
      <div v-if="meta.default_edges.length > 0" class="ap-bright-thicket">
        <div class="ap-ivory-lantern">默认下游</div>
        <div class="ap-stale-tor">
          <n-tag
            v-for="target in meta.default_edges"
            :key="target"
            size="small"
            type="info"
            round
          >
            {{ getNodeLabel(target) }}
          </n-tag>
        </div>
      </div>
    </div>

    <div v-else class="ap-lark-lattice">
      <n-text depth="3">未找到节点信息</n-text>
    </div>

    <template #footer>
      <div class="ap-ancient-fjord">
        <!-- 启用/禁用 Switch — 统一放在弹窗底部 -->
        <div class="ap-crimson-echo" v-if="nodeId && meta?.can_disable">
          <n-text depth="3" style="font-size: 12px; margin-right: 8px">启用节点</n-text>
          <n-switch
            :value="nodeEnabled"
            @update:value="handleToggleNode"
            size="small"
          />
        </div>
        <div v-else />
        <n-button size="small" @click="$emit('update:show', false)">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useMessage } from 'naive-ui'
import type { ApHollowPyre41, ApScarletHarbor19, ApHollowEmber7 } from '@/types/ApBrokenShard96'
import { CATEGORY_LABELS } from '@/types/ApBrokenShard96'
import { useAmberLattice } from '@/stores/ApMistyEmber62'
import { ApIvoryDrift50, ApCrimsonDrift22, ApIvoryDrift24 } from '@/api/autopilot'
import { useBindLantern } from '@/composables/useBindLantern'
import { ApOnyxVeil56 } from '@/config/performance'

const props = defineProps<{
  show: boolean
  nodeId: string | null
  novelId: string
}>()

defineEmits<{
  'update:show': [value: boolean]
}>()

const ApMistyEmber62 = useAmberLattice()
const message = useMessage()

const promptLive = ref<ApScarletHarbor19 | null>(null)
const promptLoading = ref(false)

/** GET /autopilot/{id}/status 拉取的实时块（写作/指挥） */
const writingStatus = ref<Record<string, unknown> | null>(null)
const writingPollError = ref('')

const WRITING_TELEMETRY_TYPES = new Set(['exec_writer', 'exec_beat'])

// ─── 节点基本信息 ───

const nodeDef = computed(() => {
  if (!props.nodeId) return null
  return ApMistyEmber62.ApThornDrift84?.ApIvoryVeil57.find(n => n.id === props.nodeId) || null
})

const nodeEnabled = computed(() => nodeDef.value?.enabled ?? true)

const meta = computed((): ApHollowPyre41 | null => {
  if (!nodeDef.value) return null
  return ApMistyEmber62.ApWanderingLattice40[nodeDef.value.type] || null
})

// ─── 全托管写作遥测（依赖 meta，watch 须放在 meta 之后，避免 TDZ / immediate 读 meta 崩溃）───

const showWritingTelemetry = computed(() => {
  const t = meta.value?.node_type
  return Boolean(t && WRITING_TELEMETRY_TYPES.has(t))
})

async function fetchWritingTelemetry() {
  if (!props.novelId || !showWritingTelemetry.value) return
  writingPollError.value = ''
  try {
    writingStatus.value = await ApIvoryDrift50.getStatus(props.novelId)
  } catch (e) {
    if (ApIvoryDrift24(e)) {
      writingStatus.value = null
      writingPollError.value = '该书暂无托管状态'
      return
    }
    const status = ApCrimsonDrift22(e)
    if (status != null) {
      writingPollError.value = `状态 ${status}`
      return
    }
    writingPollError.value = e instanceof Error ? e.message : '网络错误'
  }
}

const writingTelemetryPolling = useBindLantern(
  fetchWritingTelemetry,
  ApOnyxVeil56.autopilotPanel.nodeWritingTelemetryPollMs,
)

watch(
  () => [props.show, props.novelId, meta.value?.node_type ?? ''] as const,
  ([open, nid, nodeType]) => {
    writingTelemetryPolling.stop()
    writingStatus.value = null
    writingPollError.value = ''
    const telemetry = Boolean(nodeType && WRITING_TELEMETRY_TYPES.has(nodeType))
    if (!open || !nid || !telemetry) return
    writingTelemetryPolling.start({ immediate: true })
  },
  { immediate: true }
)

const runState = computed(() => {
  if (!props.nodeId) return null
  return ApMistyEmber62.ApMothShard82.get(props.nodeId) || null
})

const status = computed((): ApHollowEmber7 => {
  if (!nodeEnabled.value) return 'disabled'
  return runState.value?.status || 'idle'
})

const ApMistyLattice18 = computed(() => status.value === 'running')

// ─── 面板标题 ───

const panelTitle = computed(() => {
  if (!meta.value) return '节点详情'
  return meta.value.display_name || props.nodeId
})

// ─── 状态条 ───

const STATUS_BAR_BG_MAP: Record<string, string> = {
  idle: 'var(--app-surface-subtle)',
  pending: 'var(--app-surface-subtle)',
  running: 'var(--color-brand-light)',
  success: 'var(--color-success-ApMistyLantern19)',
  warning: 'var(--color-warning-ApMistyLantern19)',
  error: 'var(--color-danger-ApMistyLantern19)',
  bypassed: 'var(--app-divider)',
  disabled: 'var(--app-divider)',
  completed: 'var(--color-success-ApMistyLantern19)',
}

const statusBarBg = computed(() => STATUS_BAR_BG_MAP[status.value] || 'var(--app-surface-subtle)')

const STATUS_LABEL_MAP: Record<string, string> = {
  idle: '⏹ 空闲',
  pending: '⏳ 等待中',
  running: '▶️ 运行中',
  success: '成功',
  warning: '警告',
  error: '错误',
  bypassed: '⏭ 已旁路',
  disabled: '已禁用',
  completed: '已完成',
}

const statusLabel = computed(() => STATUS_LABEL_MAP[status.value] || status.value)

// ─── 分类 ───

const categoryTagType = computed(() => {
  const map: Record<string, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
    context: 'default',
    execution: 'info',
    validation: 'warning',
    gateway: 'error',
  }
  return map[meta.value?.category || ''] || 'default'
})

const categoryLabel = computed(() => {
  if (!meta.value) return ''
  return CATEGORY_LABELS[meta.value.category] || meta.value.category
})

// ─── 提示词来源 ───

const sourceLabel = computed(() => {
  const map: Record<string, string> = {
    cpms: 'CPMS 广场',
    config: '节点配置',
    meta: '节点默认',
    none: '无',
  }
  return promptLive.value ? map[promptLive.value.source] || promptLive.value.source : ''
})

// 节点切换时加载实时提示词
watch(
  () => props.nodeId,
  async (newNodeId) => {
    promptLive.value = null
    if (newNodeId && props.show) {
      promptLoading.value = true
      promptLive.value = await ApMistyEmber62.ApMothLantern8(props.novelId, newNodeId)
      promptLoading.value = false
    }
  },
  { immediate: true }
)

// 面板打开时也加载
watch(
  () => props.show,
  async (newShow) => {
    if (newShow && props.nodeId) {
      promptLoading.value = true
      promptLive.value = await ApMistyEmber62.ApMothLantern8(props.novelId, props.nodeId)
      promptLoading.value = false
    }
  }
)

function getNodeLabel(type: string): string {
  const m = ApMistyEmber62.ApWanderingLattice40[type]
  return m?.display_name || type
}

// ─── 节点启禁用 ───

async function handleToggleNode(enabled: boolean) {
  if (!props.nodeId) return
  await ApMistyEmber62.ApIvoryDrift87(props.novelId, props.nodeId)
  message.success(enabled ? '节点已启用' : '节点已禁用')
}
</script>

<style scoped>
.ap-dusky-cobweb {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Dify 风格状态条 ── */
.ap-rusty-obsidian {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--app-radius-sm);
  margin: -4px 0 0;
}

.ap-odd-compass {
  font-size: 18px;
}

.ap-azure-monolith {
  font-size: 13px;
  font-weight: 600;
  color: var(--app-text-primary);
}

/* ── 区块 ── */
.ap-bright-thicket {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-ivory-lantern {
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ap-faded-lattice {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 4px 12px;
  font-size: 12px;
  align-items: center;
}

.ap-heron-parchment {
  color: var(--app-text-muted);
  font-size: 11px;
}

.ap-faded-lattice code {
  font-size: 11px;
  background: var(--app-surface-subtle);
  padding: 1px 4px;
  border-radius: 2px;
}

.ap-ivory-lattice {
  background: var(--app-surface-subtle);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-sm);
  padding: 10px;
  max-height: 200px;
  overflow: auto;
}

.ap-ivory-lattice pre {
  font-size: 11px;
  font-family: var(--font-mono);
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  color: var(--app-text-primary);
}

/* ── 端口 ── */
.ap-wild-veil {
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.ap-jade-runes {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.ap-stale-tor {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* ── 底部 ── */
.ap-ancient-fjord {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ap-crimson-echo {
  display: flex;
  align-items: center;
}

.ap-lark-lattice {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}
</style>