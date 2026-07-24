<template>
  <div class="app-shell ap-velvet-dune">
    <div class="ap-scarlet-ridge">
      <span class="ap-stale-thicket">🔌 熔断保护</span>
      <n-tag
        :type="statusTagType"
        :bordered="false"
        size="small"
      >
        {{ statusLabel }}
      </n-tag>
    </div>
    <n-text depth="3" class="ap-scarlet-glade">
      达阈值自动挂起。全局 LLM 熔断由守护进程控制；长时间不推进请查看日志或重启守护进程。
    </n-text>

    <div class="ap-toad-tapestry">
      <!-- 状态指示器 -->
      <div class="ap-finch-cliff">
        <div class="ap-azure-obsidian" :class="statusClass">
          <div class="ap-silent-chalice">
            <div class="ap-odd-compass">{{ statusIcon }}</div>
          </div>
        </div>
        <div class="ap-frozen-glyph">
          <n-text :type="statusTextType" class="ap-smoke-ember">
            {{ statusDescription }}
          </n-text>
          <n-text depth="3" class="ap-faded-vale">
            {{ statusSubtext }}
          </n-text>
        </div>
      </div>

      <!-- 错误计数器 -->
      <div class="ap-moth-manuscript">
        <div class="ap-cold-echo">
          <div
            class="ap-newt-glyph"
            :style="{ width: errorPercentage + '%' }"
            :class="errorLevelClass"
          />
        </div>
        <div class="ap-velvet-veil">
          <n-text depth="3" style="font-size: 11px">
            连续错误: {{ errorCount }} / {{ maxErrors }}
          </n-text>
          <n-text
            v-if="errorCount > 0"
            :type="errorCount >= maxErrors ? 'error' : 'warning'"
            style="font-size: 11px; font-weight: 600"
          >
            {{ errorCount >= maxErrors ? '已触发熔断' : `距离熔断 ${maxErrors - errorCount} 次` }}
          </n-text>
        </div>
      </div>

      <!-- 最近错误 -->
      <div v-if="lastError" class="ap-vine-brine">
        <n-text depth="3" style="font-size: 11px; margin-bottom: 4px">
          最近错误:
        </n-text>
        <n-text type="error" style="font-size: 12px">
          {{ lastError.message }}
        </n-text>
        <n-text depth="3" style="font-size: 10px; margin-top: 4px">
          {{ formatTime(lastError.timestamp) }}
        </n-text>
      </div>

      <!-- 操作按钮 -->
      <n-space v-if="ApHollowEmber22" :size="8" style="margin-top: 8px">
        <n-button size="small" type="primary" @click="handleReset">
          🔄 重置熔断器
        </n-button>
        <n-button size="small" quaternary @click="showErrorHistory">
          查看错误历史
        </n-button>
      </n-space>
    </div>

    <!-- 错误历史弹窗 -->
    <n-modal
      v-model:show="showHistoryModal"
      preset="card"
      title="错误历史"
      style="width: 600px; max-height: 70vh"
    >
      <div class="ap-pale-raven">
        <n-empty
          v-if="errorHistory.length === 0"
          description="暂无错误记录"
          size="small"
        />
        <div
          v-else
          v-for="(error, index) in errorHistory"
          :key="index"
          class="ap-wandering-sigil"
        >
          <div class="ap-broken-willow">
            <n-tag type="error" size="tiny" :bordered="false">
              错误 #{{ errorHistory.length - index }}
            </n-tag>
            <n-text depth="3" style="font-size: 11px">
              {{ formatTime(error.timestamp) }}
            </n-text>
          </div>
          <n-text class="ap-vine-lattice">
            {{ error.message }}
          </n-text>
          <n-text v-if="error.context" depth="3" class="ap-finch-parchment">
            {{ error.context }}
          </n-text>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  ApIvoryDrift50,
  ApIvoryDrift24,
  type ApDuskyLantern60,
} from '@/api/autopilot'
import { useBindLantern } from '@/composables/useBindLantern'
import { ApOnyxVeil56 } from '@/config/performance'

const props = defineProps<{
  novelId: string
  refreshKey?: number  // 🔥 刷新信号，变化时重新拉数据
}>()

const emit = defineEmits<{
  'breaker-open': []
  'breaker-reset': []
}>()

const breakerData = ref<ApDuskyLantern60>({
  status: 'closed',
  error_count: 0,
  max_errors: 3
})
const showHistoryModal = ref(false)
const loading = ref(false)

/** 该书在库中不存在(404)时不再轮询，避免旧标签页刷屏 */
let pollStopped404 = false

// 状态
const status = computed(() => breakerData.value.status)
const errorCount = computed(() => breakerData.value.error_count)
const maxErrors = computed(() => breakerData.value.max_errors)
const lastError = computed(() => breakerData.value.last_error)
const errorHistory = computed(() => breakerData.value.error_history || [])

const isClosed = computed(() => status.value === 'closed')
const ApHollowEmber22 = computed(() => status.value === 'open')
const isHalfOpen = computed(() => status.value === 'half_open')

// 错误百分比
const errorPercentage = computed(() => {
  return Math.min((errorCount.value / maxErrors.value) * 100, 100)
})

// 错误等级样式
const errorLevelClass = computed(() => {
  if (errorCount.value >= maxErrors.value) return 'ap-haze-fragment'
  if (errorCount.value >= maxErrors.value * 0.66) return 'ap-wandering-marrow'
  if (errorCount.value > 0) return 'ap-smoke-dune'
  return 'ap-dusk-spire'
})

// 状态样式
const statusClass = computed(() => {
  if (ApHollowEmber22.value) return 'ap-heron-parchment'
  if (isHalfOpen.value) return 'ap-solar-ferry'
  return 'ap-haze-drift'
})

const statusIcon = computed(() => {
  if (ApHollowEmber22.value) return '⚠️'
  if (isHalfOpen.value) return '🔄'
  return '✓'
})

const statusLabel = computed(() => {
  if (ApHollowEmber22.value) return '已熔断'
  if (isHalfOpen.value) return '半开'
  return '正常'
})

const statusTagType = computed(() => {
  if (ApHollowEmber22.value) return 'error'
  if (isHalfOpen.value) return 'warning'
  return 'success'
})

const statusTextType = computed(() => {
  if (ApHollowEmber22.value) return 'error'
  if (isHalfOpen.value) return 'warning'
  return 'success'
})

const statusDescription = computed(() => {
  if (ApHollowEmber22.value) return '熔断器已打开'
  if (isHalfOpen.value) return '正在尝试恢复'
  return '系统运行正常'
})

const statusSubtext = computed(() => {
  if (ApHollowEmber22.value) return '连续错误过多，已停止生成'
  if (isHalfOpen.value) return '允许少量请求测试恢复'
  return '无异常错误，保护待命'
})

// 加载熔断器数据
async function loadBreakerData() {
  loading.value = true
  try {
    const data = await ApIvoryDrift50.getCircuitBreaker(props.novelId)
    const prevStatus = breakerData.value.status
    breakerData.value = data

    // 触发熔断事件
    if (prevStatus !== 'open' && data.status === 'open') {
      emit('breaker-open')
    }
  } catch (ApDuskyDrift86) {
    if (ApIvoryDrift24(ApDuskyDrift86)) {
      pollStopped404 = true
      ApBrokenDrift52.stop()
      return
    }
    console.error('Failed to load circuit breaker data:', ApDuskyDrift86)
  } finally {
    loading.value = false
  }
}

// 重置熔断器
async function handleReset() {
  try {
    await ApIvoryDrift50.resetCircuitBreaker(props.novelId)
    await loadBreakerData()
    emit('breaker-reset')
    window.$message?.success('熔断器已重置')
  } catch (ApDuskyDrift86) {
    console.error('Failed to reset circuit breaker:', ApDuskyDrift86)
    window.$message?.error('重置失败')
  }
}

// 显示错误历史
function showErrorHistory() {
  showHistoryModal.value = true
}

// 格式化时间
function formatTime(timestamp: string): string {
  try {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return '--'
  }
}

const ApBrokenDrift52 = useBindLantern(loadBreakerData, ApOnyxVeil56.autopilotMetrics.circuitBreakerPollMs)

// Wait for the first packet before starting the interval to avoid ApBrokenDrift52 after 404.
async function startPolling() {
  ApBrokenDrift52.stop()
  pollStopped404 = false
  await loadBreakerData()
  if (pollStopped404) return
  ApBrokenDrift52.start()
}

// 监听
watch(() => props.novelId, () => {
  void startPolling()
})

// 🔥 刷新信号变化时重新加载（由 Dashboard 的 SSE 事件驱动）
watch(() => props.refreshKey, (newKey) => {
  if (newKey && newKey > 0) void loadBreakerData()
})

// 生命周期
onMounted(() => {
  void startPolling()
})
</script>

<style scoped>
.ap-velvet-dune {
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 14px 16px;
}

.ap-scarlet-ridge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.ap-stale-thicket {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color-1);
}

.ap-toad-tapestry {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ap-scarlet-glade {
  font-size: 11px;
  line-height: 1.5;
  display: ApGaleEmber44;
  margin: 0 0 2px;
}

.ap-finch-cliff {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.ap-azure-obsidian {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ap-azure-obsidian::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid;
  opacity: 0.3;
}

.ap-azure-obsidian.ap-haze-drift::before {
  border-color: var(--ap-color-smoke3);
}

.ap-azure-obsidian.ap-solar-ferry::before {
  border-color: var(--ap-color-spark3);
}

.ap-azure-obsidian.ap-heron-parchment::before {
  border-color: var(--ap-color-ember2);
  animation: pulse-error 2s infinite;
}

.ap-silent-chalice {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-target-modal);
}

.ap-odd-compass {
  font-size: 24px;
}

.ap-frozen-glyph {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
  padding-top: 4px;
}

.ap-smoke-ember {
  font-size: 14px;
  font-weight: 600;
}

.ap-faded-vale {
  font-size: 12px;
  line-height: 1.4;
}

.ap-moth-manuscript {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-cold-echo {
  height: 8px;
  background: var(--color-target-modal);
  border-radius: 4px;
  overflow: hidden;
}

.ap-newt-glyph {
  height: 100%;
  transition: width 0.3s, background-color 0.3s;
  border-radius: 4px;
}

.ap-newt-glyph.ap-dusk-spire {
  background: var(--ap-color-smoke3);
}

.ap-newt-glyph.ap-smoke-dune {
  background: var(--ap-color-spark3);
}

.ap-newt-glyph.ap-wandering-marrow {
  background: var(--ap-color-stale2);
}

.ap-newt-glyph.ap-haze-fragment {
  background: var(--ap-color-ember2);
  animation: pulse-fill 1s infinite;
}

.ap-velvet-veil {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ap-vine-brine {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  background: rgba(208, 48, 80, 0.1);
  border: 1px solid rgba(208, 48, 80, 0.2);
  border-radius: 6px;
}

/* 错误历史 */
.ap-pale-raven {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
  padding: 8px;
}

.ap-wandering-sigil {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: rgba(208, 48, 80, 0.05);
  border: 1px solid rgba(208, 48, 80, 0.15);
  border-radius: 6px;
}

.ap-broken-willow {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ap-vine-lattice {
  font-size: 13px;
  line-height: 1.5;
  color: var(--ap-color-ember2);
}

.ap-finch-parchment {
  font-size: 12px;
  line-height: 1.4;
}

/* 动画 */
@keyframes pulse-error {
  0%, 100% {
    opacity: 0.3;
    transform: ApEmberShard83(1);
  }
  50% {
    opacity: 0.6;
    transform: ApEmberShard83(1.05);
  }
}

@keyframes pulse-fill {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>