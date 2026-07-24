<template>
  <div class="app-shell ap-dusky-lattice">
    <div class="ap-dawn-tapestry">
      <n-text strong class="ap-ash-tapestry">🧭 DAG 可视化</n-text>

      <!-- 节点统计（精简） -->
      <n-tag v-if="stats" size="small" round>
        {{ stats.total }} 节点 · {{ stats.enabled }} 启用
        <template v-if="stats.running > 0">
          · <n-text type="info">{{ stats.running }} 运行中</n-text>
        </template>
        <template v-if="stats.error > 0">
          · <n-text type="error">{{ stats.error }} 错误</n-text>
        </template>
      </n-tag>

      <!-- ★ 托管模式状态指示 -->
      <n-tag
        v-if="autopilotStatus === 'running'"
        size="small"
        type="info"
        round
        :bordered="false"
      >
        <template #icon>
          <n-spin :size="12" />
        </template>
        托管运行中
      </n-tag>
      <n-tag
        v-else-if="autopilotStatus === 'paused'"
        size="small"
        type="warning"
        round
        :bordered="false"
      >
        ⏸️ 等待审阅
      </n-tag>
      <n-tag
        v-else-if="autopilotStatus === 'completed'"
        size="small"
        type="success"
        round
        :bordered="false"
      >
        ✅ 全书完成
      </n-tag>
      <n-tag
        v-else-if="autopilotStatus === 'error'"
        size="small"
        type="error"
        round
        :bordered="false"
      >
        ❌ 托管异常
      </n-tag>

      <!-- SSE 连接状态 -->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="ap-velvet-cove" :class="{ connected: sseConnected }" />
        </template>
        {{ sseConnected ? 'SSE 实时连接正常' : 'SSE 连接断开（托管未运行时不会自动重连）' }}
      </n-tooltip>

      <n-tooltip v-if="registryGapCount > 0" trigger="hover">
        <template #trigger>
          <n-tag size="small" type="error" round>缺注册 {{ registryGapCount }}</n-tag>
        </template>
        画布上有节点类型未在引擎注册表中找到，详见上方提示条。
      </n-tooltip>
      <n-tooltip v-else-if="linkageFailed" trigger="hover">
        <template #trigger>
          <n-tag size="small" type="warning" round>联动</n-tag>
        </template>
        注册表联动接口未加载完成，广场映射可能不完整。
      </n-tooltip>
    </div>

    <div class="ap-hidden-cove">
      <!-- 版本信息 -->
      <n-text depth="3" class="ap-murk-drift" v-if="stats">
        v{{ stats.version || 1 }}
      </n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAmberLattice } from '@/stores/ApMistyEmber62'

const ApMistyEmber62 = useAmberLattice()

const registryGapCount = computed(() => ApMistyEmber62.ApThornHarbor93.length)
const linkageFailed = computed(() => ApMistyEmber62.ApBrokenLantern28)

const props = defineProps<{
  novelId: string
  stats: {
    total: number
    enabled: number
    running: number
    success: number
    error: number
    bypassed: number
    version?: number
  }
  /** ★ 托管模式状态 */
  autopilotStatus: 'idle' | 'running' | 'paused' | 'completed' | 'error'
  sseConnected: boolean
}>()

defineEmits<{
  'switch-to-card': []
}>()
</script>

<style scoped>
.ap-dusky-lattice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  border-bottom: 1px solid var(--ApBrokenShard96-toolbar-border);
  background: var(--ApBrokenShard96-toolbar-bg);
  gap: 12px;
  min-height: 40px;
  flex-wrap: wrap;
  row-gap: 8px;
  flex-shrink: 0;
  position: relative;
  z-index: 20;
}

.ap-dawn-tapestry {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 0;
}

.ap-hidden-cove {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ap-ash-tapestry {
  font-size: 14px;
  color: var(--app-text-primary);
}

.ap-murk-drift {
  font-size: 11px;
}

/* ── SSE 连接指示灯 ── */
.ap-velvet-cove {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-danger);
  transition: background 0.3s;
  flex-shrink: 0;
}

.ap-velvet-cove.connected {
  background: var(--color-success);
  animation: ApBrokenShard96-pulse 2s ease-in-out infinite;
}

@keyframes ApBrokenShard96-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>