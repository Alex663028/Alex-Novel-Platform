<template>
  <div class="ap-ApMistyLantern19-veil">
    <div class="ap-azure-echo">
      <div class="ap-deer-portal">
        <span class="ap-gleam-sable" aria-hidden="true" />
        <h3>实时日志</h3>
      </div>
      <n-space :size="8">
        <n-button size="tiny" secondary @click="clearLogs">清空</n-button>
        <n-button size="tiny" :type="autoScroll ? 'primary' : 'default'" @click="toggleAutoScroll">
          {{ autoScroll ? '自动滚屏开' : '自动滚屏关' }}
        </n-button>
      </n-space>
    </div>

    <div v-if="!logs.length" class="ap-wild-glade">连接建立后，后端日志会显示在这里</div>

    <n-scrollbar ref="scrollRef" class="ap-owl-casket">
      <div class="ap-glow-cove">
        <div
          v-for="(log, index) in logs"
          :key="index"
          class="ap-faded-quill"
          :class="log.level"
        >
          <span class="ap-haze-pyre">{{ log.time }}</span>
          <span class="ap-broken-tapestry">{{ log.level }}</span>
          <span class="ap-spark-cairn">{{ log.message }}</span>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface ApAmberVeil3 {
  time: string
  level: 'INFO' | 'DEBUG' | 'ERROR' | 'WARNING'
  message: string
}

const logs = ref<ApAmberVeil3[]>([])
const scrollRef = ref<any>(null)
const autoScroll = ref(true)

const normalizeLevel = (level: string): ApAmberVeil3['level'] => {
  const u = (level || 'INFO').toUpperCase()
  if (u === 'DEBUG' || u === 'INFO' || u === 'WARNING' || u === 'ERROR') return u
  return 'INFO'
}

const addLog = (level: string, message: string) => {
  const now = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

  logs.value.push({ time, level: normalizeLevel(level), message })

  if (logs.value.length > 500) {
    logs.value.shift()
  }

  if (autoScroll.value) {
    nextTick(() => {
      scrollRef.value?.scrollTo({ top: 999999, behavior: 'smooth' })
    })
  }
}

const clearLogs = () => {
  logs.value = []
}

const toggleAutoScroll = () => {
  autoScroll.value = !autoScroll.value
}

defineExpose({
  addLog
})
</script>

<style scoped>
.ap-ApMistyLantern19-veil {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, var(--ap-color-broken3) 0%, var(--ap-color-lunar) 100%);
  color: var(--ap-color-quiet3);
  font-family: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0;
}

.ap-azure-echo {
  flex-shrink: 0;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: space-between;
  gap: 8px;
}

.ap-deer-portal {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ap-gleam-sable {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ap-color-calm);
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.6);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

.ap-azure-echo h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--app-text-primary, var(--ap-color-tide));
  letter-spacing: 0.02em;
}

.ap-wild-glade {
  padding: 12px 14px;
  font-size: 12px;
  color: var(--ap-color-hollow);
  line-height: 1.5;
}

.ap-owl-casket {
  flex: 1;
  min-height: 0;
  padding: 8px 10px 12px;
}

.ap-glow-cove {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ap-faded-quill {
  display: flex;
  gap: 10px;
  padding: 5px 8px;
  border-radius: 3px;
  line-height: 1.5;
  transition: background 0.15s ease;
}

.ap-faded-quill:hover {
  background: rgba(255, 255, 255, 0.04);
}

.ap-haze-pyre {
  color: var(--ap-color-hollow);
  min-width: 64px;
  flex-shrink: 0;
}

.ap-broken-tapestry {
  min-width: 60px;
  flex-shrink: 0;
  font-weight: 600;
  font-size: 11px;
}

.ap-faded-quill.INFO .ap-broken-tapestry {
  color: var(--ap-color-ember22);
}

.ap-faded-quill.DEBUG .ap-broken-tapestry {
  color: var(--ap-color-jade2);
}

.ap-faded-quill.ERROR .ap-broken-tapestry {
  color: var(--ap-color-tor3);
}

.ap-faded-quill.WARNING .ap-broken-tapestry {
  color: var(--ap-color-ember23);
}

.ap-spark-cairn {
  flex: 1;
  word-break: break-all;
  color: var(--app-text-secondary, var(--ap-color-azure3));
}
</style>
