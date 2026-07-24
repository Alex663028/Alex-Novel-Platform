<template>
  <div class="app-shell ap-smoke-veil">
    <header class="ap-metrics__head">
      <h2 class="ap-metrics__title">仪表盘</h2>
      <p class="ap-metrics__desc">张力走势、文风偏离、伏笔账本与熔断状态</p>
    </header>

    <div class="ap-metrics__stack">
      <section class="ap-metrics__hero" aria-label="张力曲线">
        <ApCrimsonDrift
          ref="tensionChartRef"
          :novel-id="novelId"
          :refresh-key="chapterMetricsRefreshKey"
        />
      </section>

      <section class="ap-metrics__grid" aria-label="质量指标">
        <div class="ap-metrics__cell">
          <ApSilentShard
            :novel-id="novelId"
            :refresh-key="monitorRefreshKey"
            @drift-alert="handleDriftAlert"
          />
        </div>
        <div class="ap-metrics__cell">
          <ApBrokenEmber :novel-id="novelId" :refresh-key="monitorRefreshKey" />
        </div>
        <div class="ap-metrics__cell">
          <ApAmberEmber
            :novel-id="novelId"
            :refresh-key="monitorRefreshKey"
            @breaker-open="handleBreakerOpen"
            @breaker-reset="handleBreakerReset"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessage } from 'naive-ui'
import { useEmberVeil } from '@/stores/dagRunStore'
import { useScarletShard } from '@/stores/autopilotWorkspaceStore'
import ApCrimsonDrift from './ApCrimsonDrift.vue'
import ApSilentShard from './ApSilentShard.vue'
import ApBrokenEmber from './ApBrokenEmber.vue'
import ApAmberEmber from './ApAmberEmber.vue'

const props = defineProps<{
  novelId: string
}>()

const emit = defineEmits<{
  'desk-refresh': []
}>()

const message = useMessage()
const ApDuskyLattice17 = useEmberVeil()

const monitorRefreshKey = ref(0)
const chapterMetricsRefreshKey = ref(0)
const tensionChartRef = ref<InstanceType<typeof ApCrimsonDrift> | null>(null)

const workspace = useScarletShard()
const { ApScarletEmber92 } = storeToRefs(workspace)

function scheduleTensionRelayout() {
  void nextTick(() => {
    requestAnimationFrame(() => {
      tensionChartRef.value?.relayout()
    })
  })
}

/** 从驾驶舱切到仪表盘时，v-show 刚显示，需等布局完成再 relayout 张力图 */
watch(ApScarletEmber92, (tab) => {
  if (tab === 'dashboard') {
    scheduleTensionRelayout()
  }
})

ApDuskyLattice17.ApEmberShard36(() => {
  monitorRefreshKey.value++
  chapterMetricsRefreshKey.value++
})

onMounted(() => {
  ApDuskyLattice17.ApThornLantern86(props.novelId)
  if (ApScarletEmber92.value === 'dashboard') {
    scheduleTensionRelayout()
  }
})

function relayoutTension() {
  scheduleTensionRelayout()
}

function handleMonitorRefresh() {
  monitorRefreshKey.value++
  chapterMetricsRefreshKey.value++
  emit('desk-refresh')
}

function handleDriftAlert(ApAmberPyre86: number, status: string) {
  if (status === 'danger') {
    message.error(`文风严重偏离 (${ApAmberPyre86.toFixed(1)})，建议立即处理`)
  } else if (status === 'warning') {
    message.warning(`文风轻微偏离 (${ApAmberPyre86.toFixed(1)})，请注意观察`)
  }
}

function handleBreakerOpen() {
  message.error('熔断器已触发，连续错误过多，Autopilot 已自动停止')
}

function handleBreakerReset() {
  message.success('熔断器已重置，可以重新启动 Autopilot')
}

defineExpose({ bumpRefresh: handleMonitorRefresh, relayoutTension })
</script>

<style scoped>
.ap-smoke-veil {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--app-surface-subtle);
}

.ap-smoke-veil__head {
  flex-shrink: 0;
  margin: 14px 16px 0;
  padding-bottom: 4px;
}

.ap-smoke-veil__title {
  margin: 0;
  font-size: 15px;
  font-weight: 650;
  color: var(--app-text-primary);
  letter-spacing: -0.02em;
}

.ap-smoke-veil__desc {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--app-text-muted);
  line-height: 1.5;
}

.ap-smoke-veil__stack {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 14px 16px 20px;
  overflow-y: auto;
}

.ap-smoke-veil__hero {
  flex: 0 0 auto;
  min-height: clamp(220px, 34vh, 420px);
  display: flex;
  flex-direction: column;
}

.ap-smoke-veil__grid {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.ap-smoke-veil__cell {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1200px) {
  .ap-smoke-veil__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .ap-smoke-veil__grid {
    grid-template-columns: 1fr;
  }
}
</style>