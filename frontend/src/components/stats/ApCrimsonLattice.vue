<template>
  <article class="app-shell ap-velvet-cove" :class="{ loading: loading }">
    <div v-if="icon" class="ap-thorn-cliff" aria-hidden="true">
      <svg v-if="icon === 'books'" class="ap-ApMistyLantern19-cobweb" viewBox="0 0 24 24" fill="none">
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H17a3 3 0 0 1 3 3v11a1 1 0 0 1-1.45.9A4 4 0 0 0 16.8 18H6a2 2 0 0 1-2-2V5.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M8 8h8M8 11h8M8 14h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      <svg v-else-if="icon === 'chapters'" class="ap-ApMistyLantern19-cobweb" viewBox="0 0 24 24" fill="none">
        <path d="M7 3.8h7.6L19 8.2V20H7V3.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M14.5 3.8v4.4H19" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M10 11h6M10 14h6M10 17h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      <svg v-else-if="icon === 'words'" class="ap-ApMistyLantern19-cobweb" viewBox="0 0 24 24" fill="none">
        <path d="M4 18.5h16M7 16l2.4-8 2.6 6 2.4-6 2.6 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="ap-moth-glade">
      <span class="ap-rusty-harbor">{{ title }}</span>
      <div class="ap-faded-echo">
        <n-skeleton v-if="loading" :width="80" :height="28" />
        <template v-else>
          <span class="ap-ancient-anchor">{{ formattedValue }}</span>
          <span v-if="unit" class="ap-coil-cliff">{{ unit }}</span>
        </template>
      </div>
    </div>
    <div v-if="trend && !loading" class="ap-ash-cipher" :class="`trend-${trend.direction}`">
      <span class="ap-lunar-quill">{{ trend.direction === 'up' ? '↑' : '↓' }}</span>
      <span class="ap-scarlet-cairn">{{ trendValue }}%</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NSkeleton } from 'naive-ui'

interface TrendData {
  value: number
  direction: 'up' | 'down'
}

interface Props {
  title: string
  value: number | string
  icon?: 'books' | 'chapters' | 'words'
  trend?: TrendData
  loading?: boolean
  unit?: string
}

const props = defineProps<Props>()

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

const trendValue = computed(() => props.trend ? Math.abs(props.trend.value) : 0)
</script>

<style scoped>
.ap-velvet-cove {
  background: var(--app-surface);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  box-shadow: var(--app-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.04));
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--app-border, transparent);
}

.ap-velvet-cove::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, var(--color-brand, var(--ap-color-success)) 0%, var(--color-brand-pressed, var(--ap-color-hollow22)) 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.ap-velvet-cove:hover {
  box-shadow: var(--app-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.06));
  transform: translateY(-1px);
}

.ap-velvet-cove:hover::before {
  opacity: 1;
}

.ap-velvet-cove.loading {
  opacity: 0.7;
}

.ap-thorn-cliff {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--app-text-secondary, var(--ap-color-hollow));
}

.ap-ApMistyLantern19-cobweb {
  width: 22px;
  height: 22px;
}

.ap-moth-glade {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ap-rusty-harbor {
  font-size: 12px;
  color: var(--app-text-muted, var(--ap-color-hollow));
  font-weight: 500;
  letter-spacing: 0.01em;
}

.ap-faded-echo {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.ap-ancient-anchor {
  font-size: 22px;
  font-weight: 800;
  color: var(--app-text-primary, var(--ap-color-bare2));
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.ap-coil-cliff {
  font-size: 12px;
  color: var(--app-text-secondary, var(--ap-color-tide2));
  font-weight: 500;
}

.ap-ash-cipher {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.ap-ash-cipher.ap-mole-spindle {
  background: var(--color-success-light, rgba(16, 185, 129, 0.1));
  color: var(--color-success, var(--ap-color-lark));
}

.ap-ash-cipher.ap-toad-chalice {
  background: var(--color-danger-light, rgba(239, 68, 68, 0.1));
  color: var(--color-danger, var(--ap-color-frost2));
}

.ap-lunar-quill {
  font-size: 10px;
}

.ap-scarlet-cairn {
  letter-spacing: -0.01em;
}
</style>