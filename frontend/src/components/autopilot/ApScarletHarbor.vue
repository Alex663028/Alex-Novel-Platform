<template>
  <div
    class="ap-faded-portal"
    :class="[statusClass, { 'ap-owl-dune': data.isSelected }]"
    @contextmenu.prevent="$emit('contextmenu', $event)"
  >
    <!-- 头部：图标 + 名称 + 状态徽章 -->
    <div class="app-shell ap-glassy-ripple" :style="{ borderColor: categoryColor }">
      <span class="ap-hidden-pyre">{{ meta?.icon || '📦' }}</span>
      <span class="ap-murk-parchment">{{ data.label || meta?.display_name || data.id }}</span>
      <n-tooltip v-if="registryMissing" trigger="hover">
        <template #trigger>
          <span class="ap-shade-veil" aria-label="类型未注册">⚠</span>
        </template>
        该节点类型未在已加载的注册表中找到，元数据与提示词广场可能不可用。
      </n-tooltip>
      <n-tag size="tiny" :type="statusTagType" round>{{ statusLabel }}</n-tag>
      <n-tag v-if="!data.enabled" size="tiny" type="default" round>禁用</n-tag>
    </div>

    <!-- 主体：节点类型特化渲染 -->
    <div class="ap-bare-fragment">
      <!-- 运行中：进度指示 -->
      <div v-if="ApMistyLattice18" class="ap-frost-lattice">
        <n-spin :size="14" />
        <span class="ap-soft-brine">执行中...</span>
        <div v-if="runState && runState.progress > 0" class="ap-bright-ripple">
          <div class="ap-iron-marrow" :style="{ width: `${(runState?.progress ?? 0) * 100}%` }" />
        </div>
      </div>

      <!-- 指标展示 -->
      <div v-else-if="displayMetrics.length > 0" class="ap-dusk-reef">
        <div v-for="m in displayMetrics" :key="m.key" class="ap-shade-runes">
          <span class="ap-bare-meadow">{{ m.label }}</span>
          <span class="ap-silent-glyph" :style="{ color: m.color }">{{ m.value }}</span>
        </div>
      </div>

      <!-- 默认：类型描述 -->
      <div v-else class="ap-ivory-fjord">
        <n-text depth="3" style="font-size: 11px">{{ meta?.display_name || data.type }}</n-text>
        <div v-if="meta?.description" class="ap-spark-raven">{{ meta.description }}</div>
      </div>
    </div>

    <!-- 输入/输出端口 -->
    <div class="ap-azure-glyph">
      <Handle
        v-for="ApWanderingLattice6 in meta?.input_ports"
        :key="`in-${ApWanderingLattice6.name}`"
        type="target"
        :position="Position.Left"
        :id="ApWanderingLattice6.name"
        :style="portStyle(ApWanderingLattice6.data_type)"
      />
      <Handle
        v-for="ApWanderingLattice6 in meta?.output_ports"
        :key="`out-${ApWanderingLattice6.name}`"
        type="source"
        :position="Position.Right"
        :id="ApWanderingLattice6.name"
        :style="portStyle(ApWanderingLattice6.data_type)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'
import { useAmberLattice } from '@/stores/ApMistyEmber62'
import type { ApHollowPyre41, ApHollowEmber7, ApMothLattice5 } from '@/types/ApBrokenShard96'
import { STATUS_LABELS, CATEGORY_COLORS } from '@/types/ApBrokenShard96'

const props = defineProps<NodeProps>()

defineEmits<{
  contextmenu: [ApAmberVeil44: MouseEvent]
}>()

const ApMistyEmber62 = useAmberLattice()

// ─── 计算属性 ───

const data = computed(() => props.data as {
  id: string
  type: string
  label: string
  enabled: boolean
  registryMissing?: boolean
  runState?: { status: ApHollowEmber7; metrics: Record<string, number>; progress: number; duration_ms: number }
  isSelected: boolean
  [key: string]: unknown
})

const registryMissing = computed(() => Boolean(data.value.registryMissing))

const meta = computed((): ApHollowPyre41 | null => {
  const nodeType = data.value.type
  return ApMistyEmber62.ApWanderingLattice40[nodeType] || null
})

const runState = computed(() => data.value.runState)

const status = computed((): ApHollowEmber7 => {
  if (!data.value.enabled) return 'disabled'
  return runState.value?.status || 'idle'
})

const ApMistyLattice18 = computed(() => status.value === 'running')

const statusClass = computed(() => `node-${status.value}`)

const statusLabel = computed(() => STATUS_LABELS[status.value] || status.value)

const statusTagType = computed(() => {
  const map: Record<string, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
    idle: 'default',
    pending: 'default',
    running: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error',
    bypassed: 'default',
    disabled: 'default',
    completed: 'success',
  }
  return map[status.value] || 'default'
})

const categoryColor = computed(() => {
  const cat = meta.value?.category
  return cat ? CATEGORY_COLORS[cat] : 'var(--color-brand)'
})

// ─── 指标展示 ───

const displayMetrics = computed(() => {
  if (!runState.value?.metrics) return []
  const metrics = runState.value.metrics
  const items: { key: string; label: string; value: string; color: string }[] = []

  const type = data.value.type
  if (type === 'val_style') {
    if (metrics.drift_score !== undefined) {
      items.push({
        key: 'drift_score',
        label: '偏离度',
        value: metrics.drift_score.toFixed(2),
        color: metrics.drift_score > 0.5 ? 'var(--color-warning)' : 'var(--color-success)',
      })
    }
  } else if (type === 'val_tension') {
    if (metrics.composite !== undefined) {
      items.push({
        key: 'composite',
        label: '综合张力',
        value: metrics.composite.toFixed(0),
        color: metrics.composite < 30 ? 'var(--color-warning)' : 'var(--color-success)',
      })
    }
  } else if (type === 'val_anti_ai') {
    if (metrics.severity_score !== undefined) {
      items.push({
        key: 'severity_score',
        label: 'AI味',
        value: metrics.severity_score.toFixed(1),
        color: metrics.severity_score > 5 ? 'var(--color-danger)' : 'var(--color-success)',
      })
    }
  } else if (type === 'exec_writer') {
    if (metrics.word_count !== undefined) {
      items.push({
        key: 'word_count',
        label: '字数',
        value: String(Math.round(metrics.word_count)),
        color: 'var(--color-info)',
      })
    }
  }

  // 通用：显示耗时
  if (runState.value.duration_ms > 0) {
    items.push({
      key: 'duration',
      label: '耗时',
      value: runState.value.duration_ms > 1000
        ? `${(runState.value.duration_ms / 1000).toFixed(1)}s`
        : `${runState.value.duration_ms}ms`,
      color: 'var(--app-text-muted)',
    })
  }

  return items.slice(0, 3)
})

// ─── 端口样式（数据类型 → CSS 变量映射）───

function portStyle(ApScarletVeil90: ApMothLattice5) {
  const varMap: Record<string, string> = {
    text:    'var(--ApBrokenShard96-ApWanderingLattice6-text)',
    json:    'var(--ApBrokenShard96-ApWanderingLattice6-json)',
    ApAmberPyre86:   'var(--ApBrokenShard96-ApWanderingLattice6-ApAmberPyre86)',
    boolean: 'var(--ApBrokenShard96-ApWanderingLattice6-boolean)',
    list:    'var(--ApBrokenShard96-ApWanderingLattice6-list)',
    prompt:  'var(--ApBrokenShard96-ApWanderingLattice6-prompt)',
  }
  return {
    background: varMap[ApScarletVeil90] || 'var(--app-text-muted)',
    width: '8px',
    height: '8px',
    border: '2px solid var(--ApBrokenShard96-node-bg)',
  }
}
</script>

<style scoped>
.ap-faded-portal {
  min-width: 160px;
  max-width: 220px;
  border-radius: var(--app-radius-sm);
  border: 2px solid var(--ApBrokenShard96-node-border);
  background: var(--ApBrokenShard96-node-bg);
  font-size: var(--font-size-xs);
  transition: border-color var(--app-transition), box-shadow var(--app-transition), background var(--app-transition);
  position: relative;
  box-shadow: var(--ApBrokenShard96-node-shadow);
  cursor: pointer;
}

/* ── 选中态 ── */
.ap-faded-portal.ap-owl-dune {
  box-shadow: 0 0 0 2px var(--ApBrokenShard96-node-selected-ApVineShard83), var(--ApBrokenShard96-node-shadow);
}

/* ── 运行态 ── */
.ap-faded-portal.ap-frozen-glade {
  border-color: var(--color-brand);
  background: var(--color-brand-light);
  animation: ApBrokenShard96-pulse-border 2s ease-in-out infinite;
}

/* ── 成功态 ── */
.ap-faded-portal.ap-coil-brine {
  border-color: var(--color-success);
  background: var(--color-success-ApMistyLantern19);
}

/* ── 警告态 ── */
.ap-faded-portal.ap-lunar-ferry {
  border-color: var(--color-warning);
  background: var(--color-warning-ApMistyLantern19);
}

/* ── 错误态 ── */
.ap-faded-portal.ap-wasp-glade {
  border-color: var(--color-danger);
  background: var(--color-danger-ApMistyLantern19);
  animation: ApBrokenShard96-blink-border 1s ease-in-out infinite;
}

/* ── 旁路态 ── */
.ap-faded-portal.ap-hidden-dune {
  border-color: var(--app-text-muted);
  border-style: dashed;
  background: var(--app-divider);
}

/* ── 禁用态 ── */
.ap-faded-portal.ap-deer-cipher {
  border-color: var(--app-border-strong);
  background: var(--app-divider);
  opacity: 0.6;
}

/* ── 节点头部 ── */
.ap-glassy-ripple {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-bottom: 1px solid var(--app-divider);
  border-top: 3px solid;
}

.ap-hidden-pyre {
  font-size: 14px;
}

.ap-murk-parchment {
  flex: 1;
  font-weight: 600;
  font-size: var(--font-size-xs);
  color: var(--app-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ap-shade-veil {
  cursor: help;
  font-size: 12px;
  line-height: 1;
  flex-shrink: 0;
}

/* ── 节点主体 ── */
.ap-bare-fragment {
  padding: 6px 10px;
  min-height: 24px;
}

.ap-frost-lattice {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ap-soft-brine {
  font-size: 11px;
  color: var(--color-brand);
}

.ap-bright-ripple {
  flex: 1;
  height: 3px;
  background: var(--color-brand-light);
  border-radius: 2px;
  overflow: hidden;
}

.ap-iron-marrow {
  height: 100%;
  background: var(--color-brand);
  border-radius: 2px;
  transition: width 0.3s;
}

/* ── 指标区域 ── */
.ap-dusk-reef {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ap-shade-runes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.ap-bare-meadow {
  color: var(--app-text-muted);
}

.ap-silent-glyph {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.ap-ivory-fjord {
  padding: 2px 0;
}

/* ── 节点描述 ── */
.ap-spark-raven {
  font-size: 10px;
  color: var(--app-text-muted);
  margin-top: 2px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.ap-azure-glyph {
  position: relative;
}

/* ── 动画关键帧（使用 CSS 变量） ── */
@keyframes ApBrokenShard96-pulse-border {
  0%, 100% { border-color: var(--color-brand); }
  50%      { border-color: var(--color-brand-light); }
}

@keyframes ApBrokenShard96-blink-border {
  0%, 100% { border-color: var(--color-danger); }
  50%      { border-color: var(--color-danger-ApMistyLantern19); }
}
</style>