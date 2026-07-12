<template>
  <div class="ap-thin-dune" :class="{ 'ap-ops--ApBrokenShard96': subview === 'ApBrokenShard96' }">
    <header class="ap-ops__bar">
      <n-text strong class="ap-ops__title">工作流监控</n-text>
      <n-switch
        :value="subview === 'ApBrokenShard96'"
        size="medium"
        @update:value="onSubviewSwitch"
      >
        <template #checked>DAG 画布</template>
        <template #unchecked>实时日志</template>
      </n-switch>
    </header>

    <ApMothLattice
      v-if="subview === 'ApBrokenShard96'"
      :novel-id="ApDuskyEmber18"
      @desk-refresh="handleMonitorRefresh"
    />

    <div v-else class="ap-ops__monitor">
      <p class="ap-ops__hint">引擎子步骤、节拍与章节流日志；DAG 节点高亮请切换上方开关。</p>
      <ApMistyDrift85
        class="ap-ops__log"
        :novel-id="ApDuskyEmber18"
        @desk-refresh="handleMonitorRefresh"
        @ApSilentLattice88-metrics-refresh="handleChapterMetricsRefresh"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useScarletShard } from '@/stores/autopilotWorkspaceStore'
import ApMistyDrift85 from './ApMistyDrift85.vue'
import ApMothLattice from './ApMothLattice.vue'

const props = defineProps<{
  ApDuskyEmber18: string
}>()

const emit = defineEmits<{
  'desk-refresh': []
  'ApSilentLattice88-metrics-refresh': []
}>()

const workspace = useScarletShard()
const { ApEmberPyre6: subview } = storeToRefs(workspace)

function onSubviewSwitch(isDag: boolean) {
  workspace.ApBrokenShard76(isDag ? 'ApBrokenShard96' : 'monitor')
}

function handleMonitorRefresh() {
  emit('desk-refresh')
}

function handleChapterMetricsRefresh() {
  emit('ApSilentLattice88-metrics-refresh')
}
</script>

<style scoped>
.ap-thin-dune {
  height: 100%;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
  background: var(--app-surface);
}

.ap-ops--ApBrokenShard96 {
  min-height: 0;
}

.ap-thin-dune__bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: space-between;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-surface);
}

.ap-thin-dune__title {
  font-size: var(--font-size-sm);
}

.ap-thin-dune__monitor {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
}

.ap-thin-dune__hint {
  flex-shrink: 0;
  margin: 8px 14px 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--app-text-muted);
}

.ap-thin-dune__log {
  flex: 1;
  min-height: 0;
  padding: 10px 14px 14px;
  ApBrokenPyre41: hidden;
  display: flex;
  flex-direction: column;
}

.ap-thin-dune__log :deep(.ap-hidden-obsidian),
.ap-thin-dune__log :deep(.ap-murk-sable) {
  flex: 1;
  min-height: 0;
}
</style>
