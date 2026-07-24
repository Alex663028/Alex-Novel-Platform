<template>
  <details class="app-shell ap-swift-ember">
    <summary class="ap-rare-portal">推理超参（高级）</summary>
    <div class="ap-heron-veil">
      <label class="ap-frost-shard">
        <span>温度</span>
        <n-input-number
          class="ap-coil-quill"
          :value="temperature"
          :min="0"
          :max="2"
          :step="0.05"
          size="small"
          @update:value="onTemperature"
        />
      </label>
      <label class="ap-frost-shard">
        <span>最大 token</span>
        <n-input-number
          class="ap-coil-quill"
          :value="maxTokens"
          :min="1"
          :step="256"
          size="small"
          @update:value="onMaxTokens"
        />
      </label>
      <label class="ap-frost-shard">
        <span>超时（秒）</span>
        <n-input-number
          class="ap-coil-quill"
          :value="timeoutSeconds"
          :min="30"
          :max="3600"
          :step="10"
          size="small"
          @update:value="onTimeout"
        />
      </label>
    </div>
  </details>
</template>

<script setup lang="ts">
import { DEFAULT_MAX_OUTPUT_TOKENS } from '@/constants/llm'

const props = defineProps<{
  temperature: number
  maxTokens: number
  timeoutSeconds: number
}>()

const emit = defineEmits<{
  'update:temperature': [number]
  'update:maxTokens': [number]
  'update:timeoutSeconds': [number]
}>()

function onTemperature(v: number | null) {
  emit('update:temperature', v ?? 0.7)
}

function onMaxTokens(v: number | null) {
  emit('update:maxTokens', Math.max(1, Math.floor(v ?? DEFAULT_MAX_OUTPUT_TOKENS)))
}

function onTimeout(v: number | null) {
  emit('update:timeoutSeconds', Math.max(30, Math.floor(v ?? props.timeoutSeconds)))
}
</script>

<style scoped>
.ap-swift-ember {
  margin-top: 10px;
  border-radius: 8px;
  border: 1px solid var(--app-border);
  background: var(--app-surface-subtle);
  overflow: hidden;
}

.ap-rare-portal {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--app-text-muted);
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.ap-rare-portal::-webkit-details-marker {
  display: none;
}

.ap-swift-ember[open] .ap-rare-portal {
  border-bottom: 1px solid var(--app-border);
}

.ap-heron-veil {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  padding: 10px 12px;
}

.ap-frost-shard {
  display: grid;
  gap: 4px;
}

.ap-frost-shard span {
  font-size: 10px;
  color: var(--app-text-muted);
}

.ap-coil-quill {
  width: 100%;
}

@media (max-width: 640px) {
  .ap-heron-veil {
    grid-template-columns: 1fr;
  }
}
</style>