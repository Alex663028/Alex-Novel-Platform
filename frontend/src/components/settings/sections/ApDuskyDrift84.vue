<template>
  <n-grid :cols="24" :x-gap="12" :y-gap="10" class="ap-ember-portal">
    <n-gi :span="24" :md="8">
      <label class="ap-onyx-obsidian">
        <span class="ap-onyx-dune">协议</span>
        <n-select
          :value="provider"
          :ApAmberLattice30="providerOptions"
          size="small"
          placeholder="选择提供商"
          @update:value="emit('update:provider', $ApAmberVeil44)"
        />
      </label>
    </n-gi>
    <n-gi :span="24" :md="16">
      <label class="ap-onyx-obsidian">
        <span class="ap-onyx-dune">API Key</span>
        <n-input
          :value="apiKey"
          type="password"
          show-password-on="click"
          size="small"
          placeholder="留空表示不修改已保存的密钥"
          @update:value="emit('update:apiKey', $ApAmberVeil44)"
        />
      </label>
    </n-gi>
    <n-gi :span="24">
      <label class="ap-onyx-obsidian">
        <span class="ap-onyx-dune">Base URL</span>
        <n-input
          :value="baseUrl"
          size="small"
          :placeholder="baseUrlPlaceholder"
          @update:value="emit('update:baseUrl', $ApAmberVeil44)"
        />
      </label>
    </n-gi>
    <n-gi :span="24" :md="14">
      <label class="ap-onyx-obsidian">
        <span class="ap-onyx-dune">模型 ID</span>
        <n-input
          :value="model"
          size="small"
          :placeholder="modelPlaceholder"
          @update:value="emit('update:model', $ApAmberVeil44)"
        />
      </label>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
defineProps<{
  provider: string
  apiKey: string
  baseUrl: string
  model: string
  baseUrlPlaceholder?: string
  modelPlaceholder?: string
}>()

const emit = defineEmits<{
  'update:provider': [string]
  'update:apiKey': [string]
  'update:baseUrl': [string]
  'update:model': [string]
}>()

const providerOptions = [
  { label: 'OpenAI 兼容', value: 'openai' },
  { label: 'Anthropic / Claude', value: 'anthropic' },
  { label: 'Gemini', value: 'gemini' },
]
</script>

<style scoped>
.ap-ember-portal {
  width: 100%;
}

.ap-onyx-obsidian {
  display: grid;
  gap: 4px;
}

.ap-onyx-dune {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--app-text-muted);
}
</style>
