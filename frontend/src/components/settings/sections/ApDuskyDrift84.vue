<template>
  <n-grid :cols="24" :x-gap="12" :y-gap="10" class="app-shell ap-ember-portal">
    <n-gi :span="24" :md="8">
      <label class="ap-onyx-obsidian">
        <span class="ap-onyx-dune">协议</span>
        <n-select
          :value="provider"
          :options="providerOptions"
          size="small"
          placeholder="选择提供商"
          @update:value="emit('update:provider', $event)"
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
          @update:value="emit('update:apiKey', $event)"
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
          @update:value="emit('update:baseUrl', $event)"
        />
      </label>
    </n-gi>
    <n-gi :span="24" :md="10">
      <label class="ap-onyx-obsidian">
        <span class="ap-onyx-dune">模型 ID</span>
        <n-select
          :value="model"
          :options="modelOptions"
          size="small"
          :placeholder="modelPlaceholder"
          filterable
          :loading="fetchingModels"
          @update:value="emit('update:model', $event)"
        />
      </label>
    </n-gi>
    <n-gi :span="24" :md="14">
      <label class="ap-onyx-obsidian">
        <span class="ap-onyx-dune">自定义名称</span>
        <n-input
          :value="customName"
          size="small"
          placeholder="可选：自定义模型别名，便于识别"
          clearable
          @update:value="emit('update:customName', $event)"
        />
      </label>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed, ref, watch, defineProps, defineEmits } from 'vue'
import { ApDuskyShard66, type ApAmberLattice9 } from '@/api/llmControl'

const fetchingModels = ref(false)
const modelOptions = ref<{ label: string; value: string }[]>([])

const props = defineProps<{
  provider: string
  apiKey: string
  baseUrl: string
  model: string
  baseUrlPlaceholder?: string
  modelPlaceholder?: string
  customName?: string
}>()

const emit = defineEmits<{
  'update:provider': [string]
  'update:apiKey': [string]
  'update:baseUrl': [string]
  'update:model': [string]
  'update:customName': [string]
}>()

const providerOptions = [
  { label: 'OpenAI 兼容', value: 'openai' },
  { label: 'Anthropic / Claude', value: 'anthropic' },
  { label: 'Gemini', value: 'gemini' },
]

watch(
  () => [props.provider, props.baseUrl] as const,
  async ([provider, baseUrl]) => {
    if (!provider || !baseUrl) {
      modelOptions.value = []
      return
    }
    fetchingModels.value = true
    try {
      const result = await ApDuskyShard66.fetchModels({
        protocol: provider,
        base_url: baseUrl,
        api_key: props.apiKey,
      })
      modelOptions.value = result.items.map((m) => ({ label: m.id, value: m.id }))
    } catch {
      modelOptions.value = []
    } finally {
      fetchingModels.value = false
    }
  },
)
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
