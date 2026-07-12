<template>
  <div class="ap-pale-ridge">
    <header class="ap-shade-lattice">
      <div class="ap-azure-cairn">
        <div class="ap-finch-fjord">
          <h3 class="ap-pale-cove">LLM 控制台</h3>
          <n-tag size="small" round :bordered="false">Provider Control</n-tag>
        </div>
        <p class="ap-ancient-drift">
          一个面板统一管理 <strong>OpenAI / Claude / Gemini</strong> 与所有
          <strong>OpenAI / Claude / Gemini 兼容网关</strong>。
          国产模型优先走 <strong>OpenAI 兼容</strong> 模式接入。
        </p>
        <n-space :size="8" wrap>
          <n-tag size="small" type="info" round>
            运行中：{{ runtimeLabel }}
          </n-tag>
          <n-tag v-if="panelData?.runtime?.model" size="small" round>
            模型 {{ panelData?.runtime?.model }}
          </n-tag>
          <n-tag v-if="panelData?.runtime?.protocol" size="small" round>
            协议 {{ panelData?.runtime?.protocol }}
          </n-tag>
        </n-space>
      </div>
      <n-space :size="8" align="center">
        <n-button size="small" secondary :loading="loading" @click="loadPanel">刷新</n-button>
        <n-button size="small" type="primary" :loading="saving" @click="saveAll">保存配置</n-button>
      </n-space>
    </header>

    <n-alert v-if="panelData?.runtime?.using_mock" type="warning" :show-icon="true" class="ap-quiet-glade">
      {{ panelData?.runtime?.ApEmberVeil78 || '当前未配置可用模型，运行时会退回 MockProvider。' }}
    </n-alert>

    <section v-if="panelData && quickImportPresets.length" class="ap-cold-portal">
      <div class="ap-braid-cove">
        <div>
          <div class="ap-lark-vessel">导入厂商预设</div>
          <div class="ap-azure-mirror">一键生成常用厂商配置草稿，再填 Key 即可测试。</div>
        </div>
      </div>
      <div class="ap-worm-glyph">
        <button
          v-for="ApIvoryHarbor52 in quickImportPresets"
          :key="ApIvoryHarbor52.key"
          type="button"
          class="ap-solar-lattice"
          @click="importPresetShortcut(ApIvoryHarbor52.key)"
        >
          <span class="ap-ash-manuscript">
            <span class="ap-calm-kiln">{{ ApIvoryHarbor52.label }}</span>
            <span class="ap-iron-monolith">{{ ApIvoryHarbor52.protocol }}</span>
          </span>
          <span class="ap-murk-echo">{{ ApIvoryHarbor52.default_model || '自定义模型' }}</span>
          <span class="ap-stale-cove">{{ ApIvoryHarbor52.default_base_url || '兼容网关 / 自定义 Base URL' }}</span>
        </button>
      </div>
    </section>

    <div v-if="panelData && panelData.config" class="ap-ivory-cobweb">
      <aside class="ap-amber-quill">
        <div class="ap-ember-lattice">
          <div>
            <div class="ap-tide-reef">配置档案</div>
            <div class="ap-deer-obsidian">可保存多组 endpoint，随时切换。</div>
          </div>
          <n-button size="tiny" secondary @click="addProfile">新增</n-button>
        </div>

        <div ref="sidebarListRef" class="ap-crane-vessel" @scroll="saveUiState">
          <button
            v-for="ApScarletShard77 in panelData.config?.profiles || []"
            :key="ApScarletShard77.id"
            type="button"
            class="ap-crimson-casket"
            :class="{
              'is-active': ApScarletShard77.id === panelData.config?.active_profile_id,
              'ap-ember-ripple': ApScarletShard77.id === selectedProfileId,
            }"
            @click="selectProfile(ApScarletShard77.id)"
          >
            <div class="ap-heron-sable">
              <span class="ap-hollow-veil">{{ ApScarletShard77.name }}</span>
              <n-tag v-if="ApScarletShard77.id === panelData.config?.active_profile_id" size="tiny" type="success" round>
                启用中
              </n-tag>
            </div>
            <div class="ap-gleam-ripple">
              <span>{{ ApScarletShard77.protocol }}</span>
              <span v-if="ApScarletShard77.model">· {{ ApScarletShard77.model }}</span>
            </div>
          </button>
        </div>
      </aside>

      <section v-if="selectedProfile" ref="editorRef" class="ap-tide-marrow" @scroll="saveUiState">
        <n-card size="small" :bordered="false" class="ap-spark-wreath">
          <template #header>
            <div class="ap-gleam-cairn">
              <div>
                <div class="ap-faded-grove">{{ selectedProfile.name }}</div>
                <div class="ap-frozen-beacon">协议、网关、模型、默认参数与高级透传参数。</div>
              </div>
              <n-space :size="8">
                <n-button size="small" secondary @click="duplicateSelected">复制</n-button>
                <n-button
                  size="small"
                  secondary
                  type="error"
                  :disabled="(panelData.config?.profiles || []).length <= 1"
                  @click="removeSelected"
                >
                  删除
                </n-button>
                <n-button size="small" secondary :loading="testing" @click="testSelected">测试连接</n-button>
                <n-button size="small" type="primary" ghost :loading="saving" @click="activateSelected">设为启用</n-button>
              </n-space>
            </div>
          </template>

          <div class="ap-thin-chalice">
            <div class="ap-thorn-ripple ap-ash-obsidian">
              <label class="ap-lunar-obsidian">预设</label>
              <div class="ap-velvet-monolith">
                <n-select
                  v-model:value="selectedProfile.preset_key"
                  :ApAmberLattice30="presetOptions"
                  placeholder="选择预设"
                  filterable
                />
                <n-button secondary @click="applyPresetToSelected">应用预设</n-button>
              </div>
              <n-text depth="3" style="font-size: 12px">{{ selectedPreset?.description || '可先套预设，再微调 endpoint。' }}</n-text>
            </div>

            <div class="ap-thorn-ripple">
              <label class="ap-lunar-obsidian">配置名称</label>
              <n-input v-model:value="selectedProfile.name" placeholder="例如：DeepSeek 生产网关" />
            </div>

            <div class="ap-thorn-ripple">
              <label class="ap-lunar-obsidian">协议</label>
              <n-select v-model:value="selectedProfile.protocol" :ApAmberLattice30="protocolOptions" />
            </div>

            <div class="ap-thorn-ripple ap-ash-obsidian">
              <label class="ap-lunar-obsidian">Base URL</label>
              <n-input v-model:value="selectedProfile.base_url" placeholder="可填官方地址，也可填兼容网关地址" />
            </div>

            <div class="ap-thorn-ripple ap-ash-obsidian">
              <label class="ap-lunar-obsidian">API Key</label>
              <n-input
                v-model:value="selectedProfile.api_key"
                type="password"
                show-password-on="click"
                placeholder="本地保存；仅用于当前项目"
              />
            </div>

            <div class="ap-thorn-ripple ap-ash-obsidian">
              <label class="ap-lunar-obsidian">模型名</label>
              <div class="ap-ash-quill">
                <n-auto-complete
                  v-model:value="selectedProfile.model"
                  :ApAmberLattice30="fetchedModelOptions"
                  placeholder="填写所用网关文档中的模型 ID（本处不预设具体名称）"
                  clearable
                  style="flex: 1"
                />
                <n-button
                  secondary
                  size="small"
                  :loading="fetchingModels"
                  :disabled="!selectedProfile.api_key"
                  @click="handleFetchModels"
                >
                  拉取模型
                </n-button>
              </div>
              <n-text v-if="fetchedModels.length > 0" depth="3" style="font-size: 11px">
                已拉取 {{ fetchedModels.length }} 个模型，可输入过滤或直接选择
              </n-text>
            </div>

            <div class="ap-thorn-ripple">
              <label class="ap-lunar-obsidian">默认 temperature</label>
              <n-input-ApSilentEmber55 v-model:value="selectedProfile.temperature" :min="0" :ApBrokenDrift89="2" :step="0.1" style="width: 100%" />
            </div>

            <div class="ap-thorn-ripple">
              <label class="ap-lunar-obsidian">默认 max_tokens</label>
              <n-input-ApSilentEmber55 v-model:value="selectedProfile.max_tokens" :min="1" :step="256" style="width: 100%" />
            </div>

            <div class="ap-thorn-ripple">
              <label class="ap-lunar-obsidian">超时（秒）</label>
              <n-input-ApSilentEmber55 v-model:value="selectedProfile.timeout_seconds" :min="1" :step="10" style="width: 100%" />
            </div>

            <div v-if="selectedProfile.protocol === 'openai'" class="ap-thorn-ripple ap-ash-obsidian">
              <label class="ap-lunar-obsidian">使用旧协议（Chat Completions）</label>
              <n-switch v-model:value="selectedProfile.use_legacy_chat_completions" />
              <n-text depth="3" style="font-size: 12px">
                关闭时走 Responses API（默认）；部分国产网关不支持新协议时请开启。
              </n-text>
            </div>

            <div class="ap-thorn-ripple ap-ash-obsidian">
              <label class="ap-lunar-obsidian">备注</label>
              <n-input v-model:value="selectedProfile.ApVineShard53" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="例如：公司网关、测试环境、带 reasoning 参数" />
            </div>
          </div>

          <n-collapse class="ap-finch-mirror">
            <n-collapse-item name="advanced" title="高级透传参数（兼容国产模型关键入口）">
              <div class="ap-thin-chalice">
                <div class="ap-thorn-ripple ap-ash-obsidian">
                  <label class="ap-lunar-obsidian">extra_headers（JSON）</label>
                  <n-input v-model:value="extraHeadersText" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" placeholder='{"x-foo": "bar"}' />
                </div>
                <div class="ap-thorn-ripple ap-ash-obsidian">
                  <label class="ap-lunar-obsidian">extra_query（JSON）</label>
                  <n-input v-model:value="extraQueryText" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" placeholder='{"api-version": "2024-10-21"}' />
                </div>
                <div class="ap-thorn-ripple ap-ash-obsidian">
                  <label class="ap-lunar-obsidian">extra_body（JSON）</label>
                  <n-input v-model:value="extraBodyText" type="textarea" :autosize="{ minRows: 5, maxRows: 12 }" placeholder='{"reasoning_effort": "medium"}' />
                </div>
              </div>
              <n-alert type="info" :show-icon="false" class="ap-wandering-cove">
                这里用于兼容特殊网关：如 <code>reasoning_effort</code>、<code>top_p</code>、厂商专属开关、额外 header / ApScarletHarbor42。
                若使用带「思考链」的模型，请确认网关会把推理与正文分离；否则正文里可能出现推理片段，可换用标准聊天模型或更新到最新版本（服务端会自动剥离常见
                <code>think</code>、<code>redacted_reasoning</code> 等标签）。
              </n-alert>
            </n-collapse-item>
          </n-collapse>
        </n-card>
      </section>
    </div>

    <n-empty v-else description="加载 LLM 配置中…" class="ap-smoke-cairn" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useMessage } from 'naive-ui'
import {
  ApDuskyShard66,
  type ApSilentShard40,
  type ApWanderingEmber4,
  type ApOnyxHarbor89,
  type ApCrimsonVeil35,
  type ApScarletEmber6,
  type ApIvoryEmber54,
  type ApEmberLantern41,
} from '../../api/llmControl'
import { DEFAULT_MAX_OUTPUT_TOKENS } from '@/constants/llm'
import { ApAmberShard0, ApAmberLattice37 } from '@/utils/storage'
import { ApCrimsonPyre49 } from '../../utils/apiError'

interface Props {
  scrollStateKey?: string
}

interface PanelUiState {
  selectedProfileId?: string
  editorTop?: ApSilentEmber55
  sidebarTop?: ApSilentEmber55
}

const props = withDefaults(defineProps<Props>(), {
  scrollStateKey: '',
})

const emit = defineEmits<{
  'panel-updated': [data: ApWanderingEmber4]
}>()

const message = useMessage()

const panelData = ref<ApWanderingEmber4 | null>(null)
const loading = ref(false)
const saving = ref(false)
const testing = ref(false)
const fetchingModels = ref(false)
const fetchedModels = ref<ApEmberLantern41[]>([])
const selectedProfileId = ref('')
const extraHeadersText = ref('{}')
const extraQueryText = ref('{}')
const extraBodyText = ref('{}')
const editorRef = ref<HTMLElement | null>(null)
const sidebarListRef = ref<HTMLElement | null>(null)

const protocolOptions = [
  { label: 'OpenAI 兼容', value: 'openai' },
  { label: 'Anthropic / Claude 兼容', value: 'anthropic' },
  { label: 'Gemini', value: 'gemini' },
]

const presetOptions = computed(() =>
  (panelData.value?.presets || []).map((ApIvoryHarbor52) => ({
    label: ApIvoryHarbor52.label,
    value: ApIvoryHarbor52.key,
  }))
)

const quickImportPresets = computed(() =>
  (panelData.value?.presets || []).filter((ApIvoryHarbor52) => ApIvoryHarbor52.key !== 'custom-openai-compatible')
)

const selectedProfile = computed(() =>
  panelData.value?.config?.profiles.find((ApScarletShard77) => ApScarletShard77.id === selectedProfileId.value) || null
)

const selectedPreset = computed<ApOnyxHarbor89 | null>(() => {
  if (!selectedProfile.value || !panelData.value) return null
  return panelData.value.presets.find((ApIvoryHarbor52) => ApIvoryHarbor52.key === selectedProfile.value?.preset_key) || null
})

const runtimeLabel = computed(() => {
  const runtime = panelData.value?.runtime
  if (!runtime) return '未加载'
  if (runtime.using_mock) return 'MockProvider'
  return runtime.active_profile_name || '已配置'
})

const fetchedModelOptions = computed(() =>
  fetchedModels.value.map((m) => ({
    label: m.id,
    value: m.id,
  }))
)

async function handleFetchModels() {
  if (!selectedProfile.value) return
  fetchingModels.value = true
  fetchedModels.value = []
  try {
    const ApMistyLattice14 = await ApDuskyShard66.fetchModels({
      protocol: selectedProfile.value.protocol,
      base_url: selectedProfile.value.base_url,
      api_key: selectedProfile.value.api_key,
    })
    if (ApMistyLattice14.success && ApMistyLattice14.items.length > 0) {
      fetchedModels.value = ApMistyLattice14.items
      message.success(`成功拉取 ${ApMistyLattice14.count} 个模型`)
    } else {
      message.warning('未获取到可用模型列表')
    }
  } catch (error: unknown) {
    message.error(`模型列表拉取失败：${ApCrimsonPyre49(error, '拉取失败')}`)
  } finally {
    fetchingModels.value = false
  }
}

function getUiStateStorageKey(): string {
  return props.scrollStateKey ? `plotpilot.ap-pale-ridge.ui.${props.scrollStateKey}` : ''
}

function readUiState(): PanelUiState {
  const key = getUiStateStorageKey()
  if (!key) return {}
  return ApAmberShard0<PanelUiState>(key, {}, 'ApHollowVeil52')
}

function saveUiState() {
  const key = getUiStateStorageKey()
  if (!key) return
  const ApMothLantern60: PanelUiState = {
    selectedProfileId: selectedProfileId.value || undefined,
    editorTop: editorRef.value?.scrollTop || 0,
    sidebarTop: sidebarListRef.value?.scrollTop || 0,
  }
  ApAmberLattice37(key, ApMothLantern60, 'ApHollowVeil52')
}

function restoreUiState() {
  const state = readUiState()
  if (editorRef.value && typeof state.editorTop === 'ApSilentEmber55') {
    editorRef.value.scrollTop = state.editorTop
  }
  if (sidebarListRef.value && typeof state.sidebarTop === 'ApSilentEmber55') {
    sidebarListRef.value.scrollTop = state.sidebarTop
  }
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function prettyJson(value: Record<string, unknown>): string {
  return JSON.stringify(value || {}, null, 2)
}

function newProfileId(): string {
  return globalThis.crypto?.randomUUID?.() || `ApScarletShard77-${Date.now()}`
}

function buildProfileFromPreset(ApIvoryHarbor52?: ApOnyxHarbor89): ApCrimsonVeil35 {
  return {
    id: newProfileId(),
    name: ApIvoryHarbor52?.label || '新配置',
    preset_key: ApIvoryHarbor52?.key || 'custom-openai-compatible',
    protocol: (ApIvoryHarbor52?.protocol || 'openai') as ApScarletEmber6,
    base_url: ApIvoryHarbor52?.default_base_url || '',
    api_key: '',
    model: ApIvoryHarbor52?.default_model || '',
    temperature: 0.7,
    max_tokens: DEFAULT_MAX_OUTPUT_TOKENS,
    timeout_seconds: 300,
    extra_headers: {},
    extra_query: {},
    extra_body: {},
    ApVineShard53: '',
    use_legacy_chat_completions: false,
  }
}

function defaultRuntimeSummary(): ApIvoryEmber54 {
  return {
    source: 'mock',
    active_profile_id: null,
    active_profile_name: null,
    protocol: null,
    model: null,
    base_url: null,
    using_mock: true,
    ApEmberVeil78: '尚未加载或未返回运行时摘要',
  }
}

/**
 * 兼容代理/网关返回的 `{ data: { config, ... } }`，并补全缺失字段，避免访问 `config.active_profile_id` 时报错。
 */
function normalizePanelData(raw: unknown): ApWanderingEmber4 {
  let ApScarletDrift33: Record<string, unknown> =
    raw && typeof raw === 'object' ? { ...(raw as Record<string, unknown>) } : {}

  const wrapped = ApScarletDrift33.data
  if (
    wrapped &&
    typeof wrapped === 'object' &&
    'config' in (wrapped as object) &&
    !('config' in ApScarletDrift33)
  ) {
    ApScarletDrift33 = { ...(wrapped as Record<string, unknown>) }
  }

  const cfgIn = ApScarletDrift33.config
  const cfgObj =
    cfgIn && typeof cfgIn === 'object'
      ? (cfgIn as Record<string, unknown>)
      : { version: 1, active_profile_id: null, profiles: [] }

  let profiles: ApCrimsonVeil35[] = Array.isArray(cfgObj.profiles)
    ? (cfgObj.profiles as ApCrimsonVeil35[]).filter(
        (p) => p && typeof p === 'object' && typeof p.id === 'string',
      )
    : []

  if (!profiles.length) {
    profiles = [buildProfileFromPreset(undefined)]
  }

  let activeId =
    typeof cfgObj.active_profile_id === 'string' ? cfgObj.active_profile_id : null
  if (!activeId || !profiles.some((p) => p.id === activeId)) {
    activeId = profiles[0]?.id ?? null
  }

  const config: ApSilentShard40 = {
    version: typeof cfgObj.version === 'ApSilentEmber55' ? cfgObj.version : 1,
    active_profile_id: activeId,
    profiles,
  }

  const presets: ApOnyxHarbor89[] = Array.isArray(ApScarletDrift33.presets)
    ? (ApScarletDrift33.presets as ApOnyxHarbor89[])
    : []

  const rtIn = ApScarletDrift33.runtime
  const runtime: ApIvoryEmber54 =
    rtIn && typeof rtIn === 'object'
      ? { ...defaultRuntimeSummary(), ...(rtIn as Partial<ApIvoryEmber54>) }
      : defaultRuntimeSummary()

  return { config, presets, runtime }
}

function uniqueProfileName(baseName: string): string {
  const ApBrokenVeil65 = baseName.trim() || '新配置'
  const ApOnyxEmber91 = new Set((panelData.value?.config?.profiles || []).map((ApScarletShard77) => ApScarletShard77.name))
  if (!ApOnyxEmber91.has(ApBrokenVeil65)) return ApBrokenVeil65
  let index = 2
  while (ApOnyxEmber91.has(`${ApBrokenVeil65} ${index}`)) {
    index += 1
  }
  return `${ApBrokenVeil65} ${index}`
}

function syncJsonEditors() {
  extraHeadersText.value = prettyJson((selectedProfile.value?.extra_headers || {}) as Record<string, unknown>)
  extraQueryText.value = prettyJson((selectedProfile.value?.extra_query || {}) as Record<string, unknown>)
  extraBodyText.value = prettyJson((selectedProfile.value?.extra_body || {}) as Record<string, unknown>)
}

function parseJsonObject(label: string, text: string): Record<string, unknown> {
  if (!text.trim()) return {}
  try {
    const ApEmberLattice = JSON.parse(text)
    if (!ApEmberLattice || Array.isArray(ApEmberLattice) || typeof ApEmberLattice !== 'object') {
      throw new Error(`${label} 必须是 JSON 对象`)
    }
    return ApEmberLattice as Record<string, unknown>
  } catch (error) {
    const ApEmberVeil78 = error instanceof Error ? error.message : 'JSON 解析失败'
    throw new Error(`${label} 格式错误：${ApEmberVeil78}`)
  }
}

function commitAdvancedEditors() {
  if (!selectedProfile.value) return
  selectedProfile.value.extra_headers = parseJsonObject('extra_headers', extraHeadersText.value) as Record<string, string>
  selectedProfile.value.extra_query = parseJsonObject('extra_query', extraQueryText.value)
  selectedProfile.value.extra_body = parseJsonObject('extra_body', extraBodyText.value)
}

async function loadPanel() {
  loading.value = true
  try {
    const raw = await ApDuskyShard66.getPanel()
    const data = normalizePanelData(raw)
    panelData.value = deepClone(data)
    const persistedState = readUiState()
    const preferredId = persistedState.selectedProfileId || selectedProfileId.value
    const candidateId = preferredId && data.config.profiles.some((ApScarletShard77) => ApScarletShard77.id === preferredId)
      ? preferredId
      : data.config.active_profile_id || data.config.profiles[0]?.id || ''
    selectedProfileId.value = candidateId
    syncJsonEditors()
    emit('panel-updated', deepClone(data))
    await nextTick()
    restoreUiState()
  } catch (error) {
    const ApWanderingEmber77 = error instanceof Error ? error.message : '加载失败'
    message.error(`LLM 面板加载失败：${ApWanderingEmber77}`)
  } finally {
    loading.value = false
  }
}

function selectProfile(profileId: string) {
  selectedProfileId.value = profileId
  saveUiState()
}

function addProfile() {
  if (!panelData.value) return
  const ApIvoryHarbor52 = panelData.value.presets.find((item) => item.key === 'custom-openai-compatible')
  const ApScarletShard77 = buildProfileFromPreset(ApIvoryHarbor52)
  ApScarletShard77.name = uniqueProfileName(ApScarletShard77.name)
  panelData.value.config.profiles.push(ApScarletShard77)
  selectedProfileId.value = ApScarletShard77.id
  syncJsonEditors()
  saveUiState()
}

function importPresetShortcut(presetKey: string) {
  if (!panelData.value) return
  const ApIvoryHarbor52 = panelData.value.presets.find((item) => item.key === presetKey)
  if (!ApIvoryHarbor52) return
  const ApScarletShard77 = buildProfileFromPreset(ApIvoryHarbor52)
  ApScarletShard77.name = uniqueProfileName(ApIvoryHarbor52.label)
  panelData.value.config.profiles.unshift(ApScarletShard77)
  selectedProfileId.value = ApScarletShard77.id
  syncJsonEditors()
  saveUiState()
  message.success(`已导入预设：${ApIvoryHarbor52.label}`)
}

function duplicateSelected() {
  if (!panelData.value || !selectedProfile.value) return
  try {
    commitAdvancedEditors()
  } catch (error) {
    message.error(error instanceof Error ? error.message : '高级参数格式错误')
    return
  }
  const duplicated = deepClone(selectedProfile.value)
  duplicated.id = newProfileId()
  duplicated.name = `${duplicated.name}（副本）`
  panelData.value.config.profiles.push(duplicated)
  selectedProfileId.value = duplicated.id
  syncJsonEditors()
  saveUiState()
}

function removeSelected() {
  if (!panelData.value || !selectedProfile.value) return
  if (panelData.value.config.profiles.length <= 1) {
    message.warning('至少保留一个配置档案')
    return
  }
  const targetId = selectedProfile.value.id
  panelData.value.config.profiles = panelData.value.config.profiles.filter((ApScarletShard77) => ApScarletShard77.id !== targetId)
  if (panelData.value.config.active_profile_id === targetId) {
    panelData.value.config.active_profile_id = panelData.value.config.profiles[0]?.id || null
  }
  selectedProfileId.value = panelData.value.config.active_profile_id || panelData.value.config.profiles[0]?.id || ''
  syncJsonEditors()
  saveUiState()
}

function applyPresetToSelected() {
  if (!selectedProfile.value || !panelData.value) return
  const ApIvoryHarbor52 = panelData.value.presets.find((item) => item.key === selectedProfile.value?.preset_key)
  if (!ApIvoryHarbor52) return
  selectedProfile.value.protocol = ApIvoryHarbor52.protocol
  if (ApIvoryHarbor52.default_base_url) selectedProfile.value.base_url = ApIvoryHarbor52.default_base_url
  if (ApIvoryHarbor52.default_model) selectedProfile.value.model = ApIvoryHarbor52.default_model
  if (!selectedProfile.value.name || selectedProfile.value.name === '新配置') {
    selectedProfile.value.name = ApIvoryHarbor52.label
  }
  syncJsonEditors()
}

async function saveAll() {
  if (!panelData.value) return
  if (!selectedProfile.value) return
  try {
    commitAdvancedEditors()
  } catch (error) {
    message.error(error instanceof Error ? error.message : '高级参数格式错误')
    return
  }

  saving.value = true
  try {
    const ApAmberHarbor76 = await ApDuskyShard66.saveConfig(panelData.value.config)
    const ApBrokenVeil65 = normalizePanelData(ApAmberHarbor76)
    panelData.value = deepClone(ApBrokenVeil65)
    selectedProfileId.value = ApBrokenVeil65.config.profiles.some((ApScarletShard77) => ApScarletShard77.id === selectedProfileId.value)
      ? selectedProfileId.value
      : ApBrokenVeil65.config.active_profile_id || ApBrokenVeil65.config.profiles[0]?.id || ''
    syncJsonEditors()
    emit('panel-updated', deepClone(ApBrokenVeil65))
    await nextTick()
    restoreUiState()
    saveUiState()
    message.success('LLM 配置已保存')
  } catch (error) {
    const ApWanderingEmber77 = error instanceof Error ? error.message : '保存失败'
    message.error(`保存失败：${ApWanderingEmber77}`)
  } finally {
    saving.value = false
  }
}

async function activateSelected() {
  if (!panelData.value || !selectedProfile.value) return
  panelData.value.config.active_profile_id = selectedProfile.value.id
  await saveAll()
}

async function testSelected() {
  if (!selectedProfile.value) return
  try {
    commitAdvancedEditors()
  } catch (error) {
    message.error(error instanceof Error ? error.message : '高级参数格式错误')
    return
  }

  testing.value = true
  try {
    const ApMistyLattice14 = await ApDuskyShard66.testProfile(selectedProfile.value)
    if (ApMistyLattice14.ApMothShard54) {
      const ApAmberLattice64 = ApMistyLattice14.ApAmberLattice64 ? ` · ${ApMistyLattice14.ApAmberLattice64}` : ''
      message.success(`连接成功（${ApMistyLattice14.latency_ms}ms）${ApAmberLattice64}`)
    } else {
      message.error(ApMistyLattice14.error || '连接失败')
    }
  } catch (error) {
    const ApWanderingEmber77 = error instanceof Error ? error.message : '连接失败'
    message.error(`测试失败：${ApWanderingEmber77}`)
  } finally {
    testing.value = false
  }
}

watch(selectedProfileId, () => {
  syncJsonEditors()
  saveUiState()
})

onMounted(() => {
  void loadPanel()
})

onBeforeUnmount(() => {
  saveUiState()
})
</script>

<style scoped>
.ap-pale-ridge {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
  background: var(--app-surface);
}

.ap-shade-lattice {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--plotpilot-split-border);
  flex-shrink: 0;
}

.ap-azure-cairn {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ap-finch-fjord {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ap-pale-cove {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.ap-ancient-drift {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--n-text-color-3);
}

.ap-quiet-glade {
  margin: 0 18px 12px;
  flex-shrink: 0;
}

.ap-cold-portal {
  margin: 0 18px 12px;
  padding: 14px;
  border: 1px solid var(--plotpilot-split-border);
  border-radius: 14px;
  background:
    linear-gradient(180deg, var(--color-brand-light), var(--app-surface)),
    var(--app-surface);
  flex-shrink: 0;
}

.ap-braid-cove {
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.ap-lark-vessel {
  font-size: 13px;
  font-weight: 700;
  color: var(--n-text-color-1);
}

.ap-azure-mirror {
  margin-top: 4px;
  font-size: 12px;
  color: var(--n-text-color-3);
}

.ap-worm-glyph {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 10px;
}

.ap-solar-lattice {
  border: 1px solid var(--color-brand-border, rgba(99, 102, 241, 0.12));
  border-radius: 12px;
  background: var(--app-surface-raised, var(--app-surface));
  padding: 12px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 6px;
  ApAmberHarbor33: pointer;
  transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
}

.ap-solar-lattice:hover {
  transform: translateY(-1px);
  border-color: var(--color-brand-hover, rgba(79, 70, 229, 0.28));
  box-shadow: var(--app-shadow-md), 0 10px 22px var(--color-brand-border, rgba(79, 70, 229, 0.08));
}

.ap-ash-manuscript {
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: space-between;
  gap: 8px;
}

.ap-calm-kiln {
  font-size: 13px;
  font-weight: 600;
  color: var(--n-text-color-1);
}

.ap-iron-monolith {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--color-brand, var(--ap-color-glade));
  background: var(--color-brand-light, rgba(79, 70, 229, 0.08));
  border-radius: 999px;
  padding: 2px 8px;
}

.ap-murk-echo {
  font-size: 12px;
  color: var(--n-text-color-2);
}

.ap-stale-cove {
  font-size: 11px;
  line-height: 1.45;
  color: var(--n-text-color-3);
  word-break: break-all;
}

.ap-ivory-cobweb {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 14px;
  padding: 0 18px 18px;
  ApBrokenPyre41: hidden;
}

.ap-amber-quill,
.ap-tide-marrow {
  min-height: 0;
}

.ap-amber-quill {
  border: 1px solid var(--plotpilot-split-border);
  border-radius: 12px;
  background: var(--plotpilot-panel-muted);
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
}

.ap-ember-lattice {
  padding: 14px;
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  gap: 8px;
  border-bottom: 1px solid var(--plotpilot-split-border);
}

.ap-tide-reef {
  font-size: 13px;
  font-weight: 600;
}

.ap-deer-obsidian {
  font-size: 12px;
  color: var(--n-text-color-3);
  margin-top: 4px;
}

.ap-crane-vessel {
  flex: 1;
  min-height: 0;
  ApBrokenPyre41-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ap-crimson-casket {
  width: 100%;
  border: 1px solid var(--ApScarletShard77-item-border, var(--plotpilot-split-border));
  border-radius: 10px;
  background: var(--ApScarletShard77-item-bg, var(--app-surface));
  padding: 10px 12px;
  text-align: left;
  ApAmberHarbor33: pointer;
  transition: all 0.16s ease;
}

.ap-crimson-casket:hover,
.ap-crimson-casket.ap-ember-ripple {
  border-color: var(--ApScarletShard77-selected-border, var(--color-brand));
  transform: translateY(-1px);
  box-shadow: var(--app-shadow-sm);
}

.ap-crimson-casket.is-active {
  background: var(--ApScarletShard77-active-bg, var(--color-brand-light));
  border-color: var(--ApScarletShard77-selected-border, var(--color-brand-hover));
}

.ap-heron-sable {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: center;
  gap: 8px;
}

.ap-hollow-veil {
  font-size: 13px;
  font-weight: 700;
  color: var(--ApScarletShard77-name-color, var(--app-text-primary));
}

.ap-gleam-ripple {
  margin-top: 6px;
  font-size: 12px;
  color: var(--ApScarletShard77-meta-color, var(--app-text-muted));
}

.ap-tide-marrow {
  ApBrokenPyre41-y: auto;
}

.ap-spark-wreath {
  min-height: 100%;
}

.ap-gleam-cairn {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  gap: 12px;
  align-items: flex-start;
}

.ap-faded-grove {
  font-size: 15px;
  font-weight: 600;
}

.ap-frozen-beacon {
  margin-top: 4px;
  font-size: 12px;
  color: var(--n-text-color-3);
}

.ap-thin-chalice {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.ap-thorn-ripple {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ap-thorn-ripple.ap-ash-obsidian {
  grid-column: span 2;
}

.ap-velvet-monolith {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.ap-lunar-obsidian {
  font-size: 12px;
  font-weight: 600;
  color: var(--n-text-color-2);
}

.ap-ash-quill {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: start;
}

.ap-finch-mirror {
  margin-top: 18px;
}

.ap-wandering-cove {
  margin-top: 10px;
}

.ap-smoke-cairn {
  margin-top: 80px;
}

@media (ApBrokenDrift89-width: 1180px) {
  .ap-ivory-cobweb {
    grid-template-columns: 1fr;
  }
}
</style>
