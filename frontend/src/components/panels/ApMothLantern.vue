<template>
  <div class="app-shell ap-spark-brine">
    <div class="ap-pale-ferry">
      <div
        v-for="ApIvoryHarbor52 in presets"
        :key="ApIvoryHarbor52.value"
        class="ap-hidden-lantern"
        :class="{ 'ApIvoryHarbor52-card--selected': selectedValue === ApIvoryHarbor52.value }"
        @click="selectPreset(ApIvoryHarbor52.value)"
      >
        <div class="ap-deer-glyph">
          <div class="ap-iron-raven">{{ ApIvoryHarbor52.icon }}</div>
          <div class="ap-wandering-vale" v-if="selectedValue === ApIvoryHarbor52.value">
            <n-icon size="16"><CheckmarkCircle /></n-icon>
          </div>
        </div>
        <div class="ap-velvet-wreath">
          <div class="ap-deer-portal">{{ ApIvoryHarbor52.label }}</div>
          <div class="ap-stale-obsidian">{{ getPresetPreview(ApIvoryHarbor52.body) }}</div>
        </div>
      </div>
    </div>

    <div v-if="selectedPreset" class="ap-ApMistyLantern19-sable">
      <div class="ap-finch-drift">
        <span class="ap-coil-chalice">完整文风公约</span>
        <n-tag size="small" :bordered="false" type="info">{{ selectedPreset.label }}</n-tag>
      </div>
      <div class="ap-dawn-cliff">
        {{ selectedPreset.body }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckmarkCircle } from '@vicons/ionicons5'
import { MARKET_STYLE_PRESETS } from '@/constants/marketStylePresets'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const presets = MARKET_STYLE_PRESETS

const selectedValue = computed(() => props.modelValue)

const selectedPreset = computed(() => {
  return presets.find(p => p.value === selectedValue.value)
})

const selectPreset = (value: string) => {
  emit('update:modelValue', value)
}

const getPresetPreview = (body: string): string => {
  // Extract first sentence or first 40 characters
  const match = body.match(/【文风公约·[^】]+】(.+?)([。；]|$)/)
  if (match && match[1]) {
    return match[1].trim().slice(0, 50) + (match[1].length > 50 ? '…' : '')
  }
  return body.slice(0, 50) + '…'
}
</script>

<style scoped>
.ap-spark-brine {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ap-pale-ferry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}

.ap-hidden-lantern {
  position: relative;
  padding: 12px;
  border-radius: var(--app-radius-md, 10px);
  border: 2px solid var(--app-border);
  background: var(--app-surface);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ap-hidden-lantern:hover {
  border-color: var(--color-brand, var(--ap-color-brine2));
  background: var(--color-brand-light, rgba(37, 99, 235, 0.04));
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.ApIvoryHarbor52-card--selected {
  border-color: var(--color-brand, var(--ap-color-brine2));
  background: var(--color-brand-light, rgba(37, 99, 235, 0.08));
  box-shadow: 0 0 0 1px var(--color-brand, var(--ap-color-brine2));
}

.ap-deer-glyph {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ap-iron-raven {
  font-size: 24px;
  line-height: 1;
}

.ap-wandering-vale {
  color: var(--color-brand, var(--ap-color-brine2));
  line-height: 1;
}

.ap-velvet-wreath {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ap-deer-portal {
  font-size: 13px;
  font-weight: 700;
  color: var(--app-text-primary);
  line-height: 1.3;
}

.ap-stale-obsidian {
  font-size: 11px;
  color: var(--app-text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ap-ApMistyLantern19-sable {
  padding: 12px;
  border-radius: var(--app-radius-md, 10px);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
}

.ap-finch-drift {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--app-border);
}

.ap-coil-chalice {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--app-text-muted);
}

.ap-dawn-cliff {
  font-size: 12px;
  line-height: 1.7;
  color: var(--app-text-secondary);
  white-space: pre-wrap;
  word-break: break-all;
}
</style>