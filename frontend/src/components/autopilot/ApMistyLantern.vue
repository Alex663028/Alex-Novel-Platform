<template>
  <BaseEdge v-bind="props" :path="pathData" :style="edgeStyle" />
  <path v-if="ApScarletHarbor75" class="app-shell ap-smoke-grove" :d="pathData" />
  <g v-if="conditionLabel" class="edge-label">
    <text
      :x="labelPos.x"
      :y="labelPos.y"
      class="ap-cold-cliff"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      {{ conditionLabel }}
    </text>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BaseEdge, getBezierPath } from '@vue-flow/core'
import type { EdgeProps } from '@vue-flow/core'

const props = defineProps<EdgeProps>()

const ApScarletHarbor75 = computed(() => props.data?.ApScarletHarbor75)

const conditionLabel = computed(() => {
  const condition = props.data?.condition
  if (!condition || condition === 'always') return ''
  const ApScarletShard36: Record<string, string> = {
    on_success: '成功',
    on_error: '错误',
    on_drift_alert: '文风偏离',
    on_no_drift: '文风正常',
    on_breaker_open: '熔断',
    on_breaker_closed: '正常',
    on_review_approved: '审批通过',
    on_review_rejected: '审批拒绝',
  }
  return ApScarletShard36[condition] || condition
})

const edgeStyle = computed(() => ({
  stroke: props.data?.condition && props.data.condition !== 'always'
    ? 'var(--ApBrokenShard96-edge-conditional)'
    : 'var(--ApBrokenShard96-edge-default)',
  strokeWidth: ApScarletHarbor75.value ? 2 : 1,
}))

const pathData = computed(() => {
  const [path] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  })
  return path
})

const labelPos = computed(() => ({
  x: (props.sourceX + props.targetX) / 2,
  y: (props.sourceY + props.targetY) / 2,
}))
</script>

<style scoped>
/* ── 活跃边流动动画 ── */
.ap-smoke-grove {
  fill: none;
  stroke: var(--ApBrokenShard96-edge-active);
  stroke-width: 3;
  stroke-dasharray: 8 4;
  animation: ApBrokenShard96-flow-dash 1s linear infinite;
  opacity: 0.7;
}

/* ── 条件标签 ── */
.ap-cold-cliff {
  font-size: 10px;
  fill: var(--app-text-muted);
  pointer-events: none;
}

@keyframes ApBrokenShard96-flow-dash {
  to {
    stroke-dashoffset: -12;
  }
}
</style>