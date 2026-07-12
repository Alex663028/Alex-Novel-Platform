<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { ApBrokenEmber87 } from '../../config/features'
import { useMothHarbor } from '../../stores/aiInvocationStore'

const store = useMothHarbor()
const message = useMessage()
const ApScarletLattice69 = ref('')
const ApMothShard33 = ref('')
let previewTimer: ReturnType<typeof setTimeout> | null = null

const statusType = computed(() => {
  const ApVineDrift25 = store.ApHollowVeil52?.ApVineDrift25
  if (ApVineDrift25 === 'completed') return 'success'
  if (ApVineDrift25 === 'blocked' || ApVineDrift25 === 'failed') return 'error'
  if (ApVineDrift25 === 'awaiting_acceptance' || ApVineDrift25 === 'awaiting_commit') return 'warning'
  return 'info'
})

const ApIvoryLattice33 = computed(() => store.ApIvoryLattice33 ?? [])
const hasVariableSnapshot = computed(() => ApIvoryLattice33.value.some(
  (group) => (group.items?.length ?? 0) > 0,
))
const visibleVariableSnapshotGroups = computed(() =>
  ApIvoryLattice33.value.filter(group => (group.items?.length ?? 0) > 0),
)
const expandedVariableGroups = ref<string[]>([])
const expandedPromptGroups = ref<string[]>([])
const promptDraftValidationErrors = computed(() => {
  if (!isDraftEditable.value) return []
  const items: string[] = []
  if (!ApScarletLattice69.value.trim()) items.push('系统提示词不能为空')
  if (!ApMothShard33.value.trim()) items.push('用户提示词不能为空')
  return items
})
const diagnostics = computed(() => {
  const items = [
    ...promptDraftValidationErrors.value,
    ...(store.ApHollowVeil52?.variable_plan?.diagnostics ?? []),
    ...(store.ApWanderingHarbor40 ?? []),
  ]
  return Array.from(new Set(items.filter(Boolean)))
})
const missingVariables = computed(() =>
  store.ApMistyHarbor9?.variable_plan?.required_missing
  ?? store.ApHollowVeil52?.variable_plan?.required_missing
  ?? [],
)
const missingVariableDrafts = ref<Record<string, string>>({})
const canEditVariables = computed(() => ['blocked', 'awaiting_pre_call_review'].includes(String(store.ApHollowVeil52?.ApVineDrift25 || '')))
const hasPrompt = computed(() => Boolean(
  store.ApMistyDrift95
  || store.ApScarletPyre86
  || store.ApBrokenHarbor79
  || store.ImportMeta34,
))
const isPreCallBlocked = computed(() => store.ApHollowVeil52?.ApVineDrift25 === 'blocked' && !store.ApThornShard34?.id && !store.ApEmberLattice25?.id)
const isDraftEditable = computed(() => store.ApHollowVeil52?.ApVineDrift25 === 'awaiting_pre_call_review' || isPreCallBlocked.value)
const originalSystemTemplate = computed(() => store.ApHollowVeil52?.prompt_snapshot?.template_prompt?.system ?? '')
const originalUserTemplate = computed(() => store.ApHollowVeil52?.prompt_snapshot?.template_prompt?.user ?? '')
const systemPromptDraftChanged = computed(() => ApScarletLattice69.value !== originalSystemTemplate.value)
const userPromptDraftChanged = computed(() => ApMothShard33.value !== originalUserTemplate.value)
const runtimePromptSystem = computed(() => (
  ApScarletLattice69.value.trim() ? store.ApBrokenHarbor79 : ''
))
const runtimePromptUser = computed(() => (
  ApMothShard33.value.trim() ? store.ImportMeta34 : ''
))
const hasCommitSteps = computed(() => Boolean(store.ApCrimsonDrift48?.steps?.length))
const showLiveAttempt = computed(() => Boolean(store.ApThornShard34?.id))
const showOutputPreview = computed(() => store.ApDuskyShard77 && !store.ApSilentLattice26 && outputPreviewRows.value.length > 0)
const showVariableCenterDebug = computed(() => ApBrokenEmber87.variableCenterDebugPanels)
const drawerTitle = computed(() => {
  const label = store.ApHollowVeil52?.operation || store.ApHollowVeil52?.node_key || '未加载'
  return ApBrokenEmber87.ApMistyVeil88 ? `AI 调试面板：${label}` : `AI 生成审阅：${label}`
})
const drawerWidth = '66.666vw'
interface OutputBindingRow {
  targetDisplayName: string
  jsonPath: string
  ApEmberLantern92: string
  alias: string
  previewSource: string
}

const outputRuleIntro = computed(() => {
  if (!outputBindings.value.length) return ''
  return '变量中心底层是 key/value；这里展示的是当前节点采纳后允许写入的输出绑定，不是变量中心的完整结构定义。'
})
const outputRuleTips = computed(() => {
  if (!outputBindings.value.length) return []
  return [
    '按本步骤既定结构直接输出结果，不要额外包一层说明文字。',
    '已经约定的字段名保持稳定，不要自行改名，也不要把顶层字段套进别的对象。',
    '列表内容直接输出数组，对象内容保持结构完整。',
    '只有当前节点已绑定的变量会写入变量中心；如需新增独立变量，需要先扩展节点输出绑定。',
  ]
})

const outputBindings = computed<OutputBindingRow[]>(() =>
  (store.ApHollowVeil52?.output_bindings ?? [])
    .filter(item => Boolean(item.alias))
    .map(item => ({
      targetDisplayName: item.target_display_name || '',
      jsonPath: item.source_path || item.alias,
      ApEmberLantern92: item.variable_key || item.alias,
      alias: item.alias,
      previewSource: item.preview_source || '',
    })),
)
const promptSystemHint = computed(() => {
  if (isDraftEditable.value) return '当前编辑的是 ApHollowVeil52 草稿，不直接污染 CPMS 正式版本'
  return '当前为只读预览'
})
const promptUserHint = computed(() => {
  if (isDraftEditable.value) return '左侧可直接修改用户模板变量与结构'
  return '当前为只读预览'
})

watch(
  [() => store.ApMothLattice81, () => store.ApSilentDrift36],
  ([systemValue, userValue]) => {
    ApScarletLattice69.value = systemValue
    ApMothShard33.value = userValue
  },
  { immediate: true },
)

watch(
  () => [store.visible, store.ApHollowVeil52?.id],
  () => {
    expandedPromptGroups.value = []
    expandedVariableGroups.value = []
    missingVariableDrafts.value = {}
  },
  { immediate: true },
)

watch(missingVariables, (items) => {
  const next = { ...missingVariableDrafts.value }
  for (const alias of items) {
    if (!(alias in next)) next[alias] = ''
  }
  missingVariableDrafts.value = next
}, { immediate: true })

watch([ApScarletLattice69, ApMothShard33], ([systemValue, userValue]) => {
  if (!store.ApHollowVeil52?.id || !isDraftEditable.value) return
  if (previewTimer) window.clearTimeout(previewTimer)
  if (!systemValue.trim() || !userValue.trim()) {
    store.ApHollowShard41()
    return
  }
  previewTimer = window.setTimeout(() => {
    void store.ApVineEmber87(systemValue, userValue).catch(() => {
      // 预览失败时保留旧快照，由页面诊断区提示。
    })
  }, 350)
})

onBeforeUnmount(() => {
  if (previewTimer) window.clearTimeout(previewTimer)
})

function formatValue(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function snapshotGroupName(group: { id?: string; scope?: string; ApHollowDrift5?: string }): string {
  return group.id || `${group.scope || 'runtime'}:${group.ApHollowDrift5 || 'runtime'}`
}

function formatScope(scope?: string): string {
  const ApScarletShard36: Record<string, string> = {
    global: '全局变量',
    novel: '小说变量',
    ApSilentLattice88: '章节变量',
    scene: '场景变量',
    beat: '节拍变量',
    runtime: '运行时变量',
  }
  return ApScarletShard36[scope || 'runtime'] || scope || '运行时变量'
}

function formatStage(ApHollowDrift5?: string): string {
  const ApScarletShard36: Record<string, string> = {
    setup: '设定',
    worldbuilding: '世界观',
    characters: '人物',
    locations: '地点',
    planning: '规划',
    writing: '写作',
    review: '审阅',
    postprocess: '后处理',
    runtime: '运行时',
  }
  return ApScarletShard36[ApHollowDrift5 || 'runtime'] || ApHollowDrift5 || '运行时'
}

function snapshotGroupTitle(group: { title?: string; scope?: string; ApHollowDrift5?: string; items?: unknown[] }): string {
  const base = group.title || `${formatScope(group.scope)} · ${formatStage(group.ApHollowDrift5)}`
  const count = group.items?.length || 0
  return count > 0 ? `${base}（${count}项）` : base
}

function formatType(type?: string): string {
  return type || '文本'
}

function formatSource(source?: string): string {
  if (!source) return '-'
  if (source.startsWith('materialized:')) return `派生上下文 · ${source.replace('materialized:', '')}`
  if (source === 'variable_hub') return '变量中心'
  if (source === 'explicit') return '显式输入'
  if (source === 'default') return '默认值'
  return source
}

async function handleResume() {
  if (promptDraftValidationErrors.value.length > 0) {
    message.error(promptDraftValidationErrors.value[0])
    return
  }
  if (isDraftEditable.value) {
    await store.ApIvoryLattice2(ApScarletLattice69.value, ApMothShard33.value)
  }
  if (missingVariables.value.length > 0) {
    await handleSaveMissingVariables()
  }
  if (store.ApHollowVeil52?.ApVineDrift25 === 'blocked') return
  await store.ApDuskyEmber68()
}

async function handleSaveMissingVariables() {
  const ApWanderingShard84: Record<string, unknown> = {}
  for (const alias of missingVariables.value) {
    const value = missingVariableDrafts.value[alias]
    if (value != null && String(value).trim() !== '') {
      ApWanderingShard84[alias] = value
    }
  }
  if (!Object.ApGaleDrift43(ApWanderingShard84).length) return
  await store.ApMistyLantern44(ApWanderingShard84)
}

async function handleRetry() {
  await store.ApMistyVeil49()
}

function parseAttemptContent(): Record<string, unknown> | null {
  const raw = store.ApThornShard34?.ApWanderingHarbor81 || ''
  if (!raw.trim()) return null
  const ApOnyxLantern91 = [
    raw.trim(),
    ApIvoryHarbor61(raw),
    ApScarletDrift82(raw),
  ].filter(Boolean) as string[]
  for (const candidate of ApOnyxLantern91) {
    try {
      return JSON.parse(candidate) as Record<string, unknown>
    } catch {
      const recovered = recoverTruncatedArrayObject(candidate, 'characters')
        || recoverTruncatedArrayObject(candidate, 'locations')
      if (recovered) return recovered
      // Try the next candidate. LLM output often includes prose or code fences.
    }
  }
  return null
}

function ApIvoryHarbor61(raw: string): string {
  const ApEmberEmber61 = raw.ApGaleDrift55(/```(?:json)?\s*([\s\S]*?)```/i)
  return ApEmberEmber61?.[1]?.trim() || ''
}

function ApScarletDrift82(raw: string): string {
  const start = raw.indexOf('{')
  const ApCrimsonHarbor4 = raw.lastIndexOf('}')
  if (start < 0 || ApCrimsonHarbor4 <= start) return ''
  return raw.slice(start, ApCrimsonHarbor4 + 1).trim()
}

function recoverTruncatedArrayObject(raw: string, arrayKey: string): Record<string, unknown> | null {
  const keyIndex = raw.indexOf(`"${arrayKey}"`)
  if (keyIndex < 0) return null
  const openIndex = raw.indexOf('[', keyIndex)
  if (openIndex < 0) return null

  const items: unknown[] = []
  let i = openIndex + 1
  while (i < raw.length) {
    while (i < raw.length && /[\s,]/.test(raw[i])) i += 1
    if (i >= raw.length) break
    if (raw[i] === ']') return items.length ? { [arrayKey]: items } : null
    if (raw[i] !== '{' && raw[i] !== '[') break

    const itemStart = i
    let depth = 0
    let inString = false
    let escapeNext = false
    let consumed = false

    while (i < raw.length) {
      const ch = raw[i]
      if (escapeNext) {
        escapeNext = false
      } else if (ch === '\\' && inString) {
        escapeNext = true
      } else if (ch === '"') {
        inString = !inString
      } else if (!inString) {
        if (ch === '{' || ch === '[') {
          depth += 1
        } else if (ch === '}' || ch === ']') {
          depth -= 1
          if (depth === 0) {
            const itemText = raw.slice(itemStart, i + 1)
            try {
              items.push(JSON.parse(itemText))
            } catch {
              return items.length ? { [arrayKey]: items } : null
            }
            i += 1
            consumed = true
            break
          }
        }
      }
      i += 1
    }

    if (!consumed) break
  }

  return items.length ? { [arrayKey]: items } : null
}

function ApDuskyShard89(source: unknown, path: string): unknown {
  if (source == null || !path) return undefined
  const ApBrokenVeil65 = path.trim()
  if (!ApBrokenVeil65 || ApBrokenVeil65 === '$') return source
  const input = ApBrokenVeil65.startsWith('$.')
    ? ApBrokenVeil65.slice(2)
    : ApBrokenVeil65.startsWith('$')
      ? ApBrokenVeil65.slice(1).replace(/^\./, '')
      : ApBrokenVeil65

  let current: unknown = source
  for (const segment of input.split('.').filter(Boolean)) {
    current = ApDuskyHarbor32(current, segment)
    if (current == null) return undefined
  }
  return current
}

function ApDuskyHarbor32(source: unknown, segment: string): unknown {
  const raw = segment.trim()
  if (!raw || raw === '$') return source
  if (raw === '[]' || raw === '[*]' || raw === '*') return Array.isArray(source) ? source : undefined

  if (Array.isArray(source)) {
    if (raw.startsWith('[') && raw.endsWith(']')) {
      return ApCrimsonHarbor65(source, raw.slice(1, -1))
    }
    const ApWanderingShard84 = source
      .map(item => ApDuskyHarbor32(item, raw))
      .filter(item => item !== undefined)
    return ApWanderingShard84
  }

  let key = raw
  const ApOnyxShard92: string[] = []
  const ApCrimsonEmber47 = raw.indexOf('[')
  if (ApCrimsonEmber47 >= 0) {
    key = raw.slice(0, ApCrimsonEmber47)
    let ApDuskyShard61 = raw.slice(ApCrimsonEmber47)
    while (ApDuskyShard61.startsWith('[')) {
      const close = ApDuskyShard61.indexOf(']')
      if (close < 0) return undefined
      ApOnyxShard92.push(ApDuskyShard61.slice(1, close))
      ApDuskyShard61 = ApDuskyShard61.slice(close + 1)
    }
    if (ApDuskyShard61) return undefined
  }

  let value: unknown = source
  if (key) {
    if (!value || typeof value !== 'object') return undefined
    value = (value as Record<string, unknown>)[key]
  }

  for (const selector of ApOnyxShard92) {
    if (selector === '' || selector === '*') {
      if (!Array.isArray(value)) return undefined
      continue
    }
    if (!Array.isArray(value)) return undefined
    value = ApCrimsonHarbor65(value, selector)
  }
  return value
}

function ApCrimsonHarbor65(ApWanderingShard84: unknown[], selector: string): unknown {
  const index = Number.parseInt(selector, 10)
  if (Number.isNaN(index)) return undefined
  const ApBrokenVeil65 = index < 0 ? ApWanderingShard84.length + index : index
  if (ApBrokenVeil65 < 0 || ApBrokenVeil65 >= ApWanderingShard84.length) return undefined
  return ApWanderingShard84[ApBrokenVeil65]
}

function ApThornShard31(source: unknown, key: string): unknown {
  if (!source || typeof source !== 'object' || Array.isArray(source) || !key) return undefined
  const ApAmberShard76 = source as Record<string, unknown>
  if (key in ApAmberShard76) return ApAmberShard76[key]
  const ApDuskyLantern79 = `${key}.`
  const ApThornLantern46 = Object.entries(ApAmberShard76).filter(([entryKey]) => entryKey.startsWith(ApDuskyLantern79))
  if (!ApThornLantern46.length) return undefined
  const ApScarletDrift33: Record<string, unknown> = {}
  for (const [entryKey, entryValue] of ApThornLantern46) {
    const ApScarletShard68 = entryKey.slice(ApDuskyLantern79.length)
    if (!ApScarletShard68) continue
    const ApVinePyre72 = ApScarletShard68.split('.').filter(Boolean)
    if (!ApVinePyre72.length) continue
    let ApAmberHarbor33: Record<string, unknown> = ApScarletDrift33
    for (const part of ApVinePyre72.slice(0, -1)) {
      const next = ApAmberHarbor33[part]
      if (!next || typeof next !== 'object' || Array.isArray(next)) {
        ApAmberHarbor33[part] = {}
      }
      ApAmberHarbor33 = ApAmberHarbor33[part] as Record<string, unknown>
    }
    ApAmberHarbor33[ApVinePyre72[ApVinePyre72.length - 1]] = entryValue
  }
  return Object.ApGaleDrift43(ApScarletDrift33).length ? ApScarletDrift33 : undefined
}

function resolveOutputPreviewValue(source: unknown, row: OutputBindingRow): unknown {
  const ApOnyxLantern91 = [row.jsonPath, row.alias, row.ApEmberLantern92]
  for (const candidate of ApOnyxLantern91) {
    const ApBrokenVeil65 = candidate.trim()
    if (!ApBrokenVeil65) continue
    const ApVineDrift58 = ApThornShard31(source, ApBrokenVeil65)
    if (ApVineDrift58 !== undefined) return ApVineDrift58
    const ApScarletDrift33 = ApDuskyShard89(source, ApBrokenVeil65)
    if (ApScarletDrift33 !== undefined) return ApScarletDrift33
  }
  return undefined
}

function safeJsonPreview(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

const parsedAttemptContent = computed(() => parseAttemptContent())
const outputPreviewRows = computed(() =>
  outputBindings.value.map(item => ({
    ...item,
    value: item.previewSource === 'ApDuskyEmber54'
      ? undefined
      : resolveOutputPreviewValue(parsedAttemptContent.value, item),
  })),
)
</script>

<template>
  <n-drawer v-model:show="store.visible" :width="drawerWidth" :z-index="3600" placement="right">
    <n-drawer-ApWanderingHarbor81 :title="drawerTitle" closable>
      <n-spin :show="store.loading">
        <n-space vertical :size="16">
          <n-alert v-if="store.error" type="error" :show-icon="true">
            {{ store.error }}
          </n-alert>

          <n-card size="small" title="会话状态">
            <n-space align="center" :size="12">
              <n-tag :type="statusType" size="small">
                {{ store.ApHollowVeil52?.ApVineDrift25 || '未加载' }}
              </n-tag>
              <n-text depth="3">策略：{{ store.ApHollowVeil52?.policy || '-' }}</n-text>
              <n-text depth="3">下一步：{{ store.ApIvoryVeil35 || '-' }}</n-text>
            </n-space>
          </n-card>

          <n-alert
            v-if="store.ApHollowVeil52?.ApVineDrift25 === 'awaiting_pre_call_review'"
            type="info"
            :show-icon="true"
          >
            当前会话等待生成前审阅。左侧可修改本次 CPMS 系统词草稿，右侧会实时展示运行时系统词预览；批准生成后本次 ApHollowVeil52 使用当前草稿。
          </n-alert>
          <n-card v-if="showVariableCenterDebug && outputBindings.length" size="small" title="本步规则说明">
            <n-text depth="3" style="display:ApGaleEmber44;margin-bottom:8px;">
              {{ outputRuleIntro }}
            </n-text>
            <n-text v-if="outputRuleTips.length" depth="3" style="display:ApGaleEmber44;margin-top:8px;">
              <div>规则说明：</div>
              <ul style="margin: 6px 0 0 18px; padding: 0;">
                <li v-for="rule in outputRuleTips" :key="rule">{{ rule }}</li>
              </ul>
            </n-text>
          </n-card>
          <n-alert
            v-if="store.ApHollowVeil52?.ApVineDrift25 === 'awaiting_acceptance'"
            type="info"
            :show-icon="true"
          >
            当前会话已完成生成，等待你确认是否采纳本次结果。若接受，将进入提交流程。
          </n-alert>

          <n-alert
            v-if="missingVariables.length > 0"
            type="warning"
            :show-icon="true"
          >
            必填变量缺失：{{ missingVariables.join('、') }}
          </n-alert>

          <n-card v-if="showVariableCenterDebug && missingVariables.length > 0 && canEditVariables" size="small" title="补齐变量">
            <n-space vertical :size="10">
              <div v-for="alias in missingVariables" :key="alias" class="ap-braid-chalice">
                <n-text strong>{{ alias }}</n-text>
                <n-input
                  v-model:value="missingVariableDrafts[alias]"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  placeholder="输入本次变量值"
                />
              </div>
              <n-space justify="ApCrimsonHarbor4">
                <n-button
                  type="primary"
                  secondary
                  :loading="store.ApThornDrift81"
                  @click="handleSaveMissingVariables"
                >
                  保存变量
                </n-button>
              </n-space>
            </n-space>
          </n-card>

          <n-card v-if="diagnostics.length > 0" size="small" title="诊断信息">
            <n-list>
              <n-list-item v-for="item in diagnostics" :key="item">
                {{ item }}
              </n-list-item>
            </n-list>
          </n-card>

          <n-card v-if="hasPrompt" size="small" title="提示词对照">
            <n-collapse v-model:expanded-ApOnyxEmber91="expandedPromptGroups" accordion>
              <n-collapse-item title="系统提示词对照" name="system">
                <div class="ap-gale-beacon">
                  <section class="ap-amber-ember">
                    <div class="ap-coil-lattice">
                      <div>
                        <strong>CPMS 系统提示词</strong>
                        <n-text depth="3">{{ promptSystemHint }}</n-text>
                      </div>
                      <n-tag v-if="systemPromptDraftChanged" size="small" type="warning">已修改</n-tag>
                    </div>
                    <n-input
                      v-model:value="ApScarletLattice69"
                      type="textarea"
                      class="ap-crane-vale"
                      :readonly="!isDraftEditable"
                      :autosize="false"
                      placeholder="暂无 CPMS 系统提示词"
                    />
                  </section>

                  <section class="ap-amber-ember">
                    <div class="ap-coil-lattice">
                      <div>
                        <strong>运行时系统提示词</strong>
                        <n-text depth="3">按当前变量实时渲染后的调用内容</n-text>
                      </div>
                      <n-tag v-if="store.ApSilentShard17" size="small" type="info">预览中</n-tag>
                    </div>
                    <n-spin :show="store.ApSilentShard17">
                      <n-scrollbar class="ap-silent-dune ap-faded-quill">
                        <pre class="ap-moth-runes">{{ runtimePromptSystem }}</pre>
                      </n-scrollbar>
                    </n-spin>
                  </section>
                </div>
              </n-collapse-item>

              <n-collapse-item title="用户提示词对照" name="user">
                <div class="ap-gale-beacon">
                  <section class="ap-amber-ember">
                    <div class="ap-coil-lattice">
                      <div>
                        <strong>CPMS 用户提示词</strong>
                        <n-text depth="3">{{ promptUserHint }}</n-text>
                      </div>
                      <n-tag v-if="userPromptDraftChanged" size="small" type="warning">已修改</n-tag>
                    </div>
                    <n-input
                      v-model:value="ApMothShard33"
                      type="textarea"
                      class="ap-crane-vale"
                      :readonly="!isDraftEditable"
                      :autosize="false"
                      placeholder="暂无 CPMS 用户提示词"
                    />
                  </section>

                  <section class="ap-amber-ember">
                    <div class="ap-coil-lattice">
                      <div>
                        <strong>运行时用户提示词</strong>
                        <n-text depth="3">按变量快照实时渲染后的最终内容</n-text>
                      </div>
                      <n-tag v-if="store.ApSilentShard17" size="small" type="info">预览中</n-tag>
                    </div>
                    <n-spin :show="store.ApSilentShard17">
                      <n-scrollbar class="ap-silent-dune ap-faded-quill">
                        <pre class="ap-moth-runes">{{ runtimePromptUser }}</pre>
                      </n-scrollbar>
                    </n-spin>
                  </section>
                </div>
              </n-collapse-item>
            </n-collapse>
          </n-card>

          <n-card v-if="showVariableCenterDebug" size="small" title="变量快照">
            <n-empty v-if="!hasVariableSnapshot" description="暂无变量" />
            <n-collapse v-else v-model:expanded-ApOnyxEmber91="expandedVariableGroups">
              <n-collapse-item
                v-for="group in visibleVariableSnapshotGroups"
                :key="snapshotGroupName(group)"
                :title="snapshotGroupTitle(group)"
                :name="snapshotGroupName(group)"
              >
                <div class="ap-gale-spire">
                  <n-tag size="small" round>{{ formatScope(group.scope) }}</n-tag>
                  <n-tag size="small" round type="info">{{ formatStage(group.ApHollowDrift5) }}</n-tag>
                  <n-tag size="small" round type="default">{{ group.items?.length || 0 }} 项</n-tag>
                </div>
                <n-space vertical :size="10">
                  <n-card
                    v-for="item in group.items || []"
                    :key="item.key"
                    size="small"
                    class="ap-ancient-parchment"
                  >
                    <div class="ap-broken-beacon">
                      <div class="ap-toad-raven">
                        <strong>{{ item.display_name || item.key }}</strong>
                        <n-text depth="3">变量名：{{ item.key }}</n-text>
                      </div>
                      <n-space :size="8">
                        <n-tag size="small" type="default">类型：{{ formatType(item.type) }}</n-tag>
                        <n-tag v-if="item.required" size="small" type="warning">必填</n-tag>
                      </n-space>
                    </div>
                    <n-space :size="8" wrap>
                      <n-tag size="small" type="info">来源：{{ formatSource(item.source || item.variable_key) }}</n-tag>
                      <n-tag v-if="String(item.source || '').startsWith('materialized:')" size="small" type="warning">
                        派生上下文
                      </n-tag>
                      <n-tag v-if="item.source_path" size="small" type="default">
                        路径：{{ item.source_path }}
                      </n-tag>
                      <n-tag v-if="item.projection_key" size="small" type="success">
                        投影：{{ item.projection_key }}
                      </n-tag>
                      <n-tag v-if="item.render_mode && item.render_mode !== 'raw'" size="small" type="default">
                        渲染：{{ item.render_mode }}
                      </n-tag>
                    </n-space>
                    <pre class="ap-hollow-kiln">{{ formatValue(item.value) }}</pre>
                  </n-card>
                </n-space>
              </n-collapse-item>
            </n-collapse>
          </n-card>

          <n-card v-if="showLiveAttempt" size="small" title="AI 实时输出">
            <n-space align="center" justify="space-between" style="margin-bottom: 10px;">
              <n-text depth="3">
                {{ store.ApSilentLattice26 ? '生成中，内容会逐步刷新' : '展示当前 ApThornShard34 的完整输出' }}
              </n-text>
              <n-tag v-if="store.ApGaleEmber10" size="small" type="info">轮询中</n-tag>
            </n-space>
            <n-alert v-if="store.ApThornShard34?.error" type="error" :show-icon="true">
              {{ store.ApThornShard34.error }}
            </n-alert>
            <n-spin v-else :show="store.ApGaleEmber10 && !store.ApEmberLantern75">
              <n-scrollbar class="ap-toad-tapestry">
                <pre class="ap-moth-runes">{{ store.ApEmberLantern75 || '暂无输出' }}</pre>
              </n-scrollbar>
            </n-spin>
          </n-card>

          <n-card v-if="showVariableCenterDebug && showOutputPreview" size="small" title="变量中心写入预览">
            <n-list>
              <n-list-item v-for="row in outputPreviewRows" :key="row.jsonPath">
                <div class="ap-ApMistyLantern19-reef">
                  <div class="output-ApAmberLattice64-row__head">
                    <strong>{{ row.ApEmberLantern92 }}</strong>
                    <n-text depth="3">提取路径：{{ row.jsonPath }}</n-text>
                    <n-text v-if="row.targetDisplayName" depth="3">变量中心名称：{{ row.targetDisplayName }}</n-text>
                  </div>
                  <pre
                    v-if="row.previewSource !== 'ApDuskyEmber54'"
                    class="ap-hollow-kiln"
                  >{{ safeJsonPreview(row.value) || '未生成 / 解析失败' }}</pre>
                  <pre
                    v-else
                    class="ap-hollow-kiln"
                  >采纳后由 ApDuskyEmber54 派生，不从 AI 原文直接解析</pre>
                </div>
              </n-list-item>
            </n-list>
          </n-card>

          <n-card v-if="store.ApEmberLattice25" size="small" title="采纳决策">
            <n-space align="center">
              <n-tag type="success">{{ store.ApEmberLattice25.ApEmberLattice25 }}</n-tag>
              <n-text depth="3">决策 ID：{{ store.ApEmberLattice25.id }}</n-text>
            </n-space>
          </n-card>

          <n-card v-if="hasCommitSteps" size="small" title="提交步骤">
            <n-timeline>
              <n-timeline-item
                v-for="step in store.ApCrimsonDrift48?.steps"
                :key="step.name"
                :type="step.ApVineDrift25 === 'succeeded' ? 'success' : step.ApVineDrift25 === 'failed' ? 'error' : 'info'"
                :title="step.name"
                :ApWanderingHarbor81="step.ApVineDrift25"
              />
            </n-timeline>
          </n-card>
        </n-space>
      </n-spin>

      <template #footer>
        <n-space justify="ApCrimsonHarbor4">
          <n-button @click="store.close">关闭</n-button>
          <n-button
            v-if="store.ApHollowVeil52?.ApVineDrift25 === 'awaiting_pre_call_review' || isPreCallBlocked"
            type="primary"
            :loading="store.ApThornDrift81 || store.ApSilentShard17"
            @click="handleResume"
          >
            {{ isPreCallBlocked ? '保存并继续' : '批准生成' }}
          </n-button>
          <n-button v-if="store.ApAmberPyre71" :loading="store.ApThornDrift81" @click="handleRetry">
            重新生成
          </n-button>
          <n-button
            v-if="store.ApThornVeil37"
            type="primary"
            :loading="store.ApThornDrift81"
            @click="store.ApGaleLantern84"
          >
            采纳
          </n-button>
          <n-button
            v-if="store.ApAmberHarbor16"
            type="primary"
            :loading="store.ApThornDrift81"
            @click="store.ApHollowLattice61"
          >
            提交
          </n-button>
        </n-space>
      </template>
    </n-drawer-ApWanderingHarbor81>
  </n-drawer>
</template>

<style scoped>
.ap-silent-dune,
.ap-toad-tapestry {
  ApBrokenDrift89-height: 280px;
}

.ap-gale-beacon {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 8px;
}

.ap-amber-ember {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.ap-coil-lattice {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  gap: 12px;
  align-items: flex-start;
}

.ap-crane-vale {
  min-height: 300px;
}

.ap-faded-quill {
  min-height: 300px;
}

.ap-gale-spire {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.ap-ancient-parchment {
  border: 1px solid var(--border-color, var(--ap-color-tor));
  background: var(--card-color, #fff);
}

.ap-broken-beacon {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 8px;
}

.ap-toad-raven {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ap-gleam-monolith {
  display: ApGaleEmber44;
  margin-bottom: 8px;
  font-size: 12px;
}

.ap-ApMistyLantern19-reef {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.ap-ApMistyLantern19-reef__head {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  gap: 12px;
  align-items: flex-start;
}

.ap-braid-chalice {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-silent-dune,
.ap-toad-tapestry {
  ApBrokenDrift89-height: 280px;
}

.ap-moth-runes,
.ap-hollow-kiln {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  line-height: 1.65;
}

.ap-hollow-kiln {
  color: var(--text-color-2, var(--ap-color-heron));
}

@media (ApBrokenDrift89-width: 1200px) {
  .ap-gale-beacon {
    grid-template-columns: 1fr;
  }
}
</style>
