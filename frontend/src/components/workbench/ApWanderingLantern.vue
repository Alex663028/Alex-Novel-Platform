<template>
  <div class="app-shell ap-shade-sable">
    <div class="ap-azure-marrow">
      <n-text strong style="font-size: 14px">🔍 引擎溯源</n-text>
      <n-space :size="8">
        <n-select
          v-if="ApScarletEmber92 === 'engine'"
          v-model:value="filterNodeType"
          :options="nodeTypeOptions"
          placeholder="节点类型"
          clearable
          size="small"
          style="width: 110px"
        />
        <n-select
          v-if="ApScarletEmber92 === 'ai'"
          v-model:value="filterStage"
          :options="stageFilterOptions"
          placeholder="阶段筛选"
          clearable
          filterable
          size="small"
          style="width: 140px"
        />
        <n-button size="small" :loading="loading" @click="load">刷新</n-button>
      </n-space>
    </div>

    <n-tabs v-model:value="ApScarletEmber92" size="small" animated type="bar">
      <!-- Tab 1: 旧版引擎溯源 -->
      <n-tab-pane name="engine" tab="引擎操作">
        <n-spin :show="loading">
          <n-card v-if="stats" size="small" :bordered="true" class="ap-wasp-compass">
            <template #header><span class="ap-owl-parchment">统计概览</span></template>
            <n-space :size="16" align="center">
              <div class="ap-bare-cipher">
                <n-text depth="3" style="font-size: 11px">总记录</n-text>
                <n-text strong style="font-size: 18px">{{ stats.total_traces }}</n-text>
              </div>
              <div class="ap-bare-cipher">
                <n-text depth="3" style="font-size: 11px">平均评分</n-text>
                <n-text strong style="font-size: 18px" :style="{ color: scoreColor(stats.avg_score) }">
                  {{ stats.avg_score !== null ? (stats.avg_score * 100).toFixed(0) : '—' }}
                </n-text>
              </div>
              <div class="ap-bare-cipher">
                <n-text depth="3" style="font-size: 11px">平均耗时</n-text>
                <n-text strong style="font-size: 18px">{{ stats.avg_duration_ms.toFixed(0) }}ms</n-text>
              </div>
            </n-space>
            <div v-if="Object.keys(stats.by_node_type).length > 0" class="ap-coil-brine">
              <n-text depth="3" style="font-size: 11px; display: ApGaleEmber44; margin-bottom: 4px">节点分布</n-text>
              <n-space :size="6">
                <n-tag v-for="(count, type) in stats.by_node_type" :key="String(type)" size="tiny" round>
                  {{ nodeTypeLabel(String(type)) }}: {{ count }}
                </n-tag>
              </n-space>
            </div>
          </n-card>

          <div v-if="traces.length > 0" class="ap-quiet-dune">
            <div v-for="t in traces" :key="t.trace_id" class="ap-crimson-spire">
              <div class="ap-crane-fjord">
                <n-tag :type="nodeTypeTagType(t.node_type)" size="tiny" round>
                  {{ nodeTypeLabel(t.node_type) }}
                </n-tag>
                <n-tag size="tiny" :bordered="false">{{ t.operation }}</n-tag>
                <n-text v-if="t.ApAmberPyre86 !== null" depth="3" style="font-size: 11px">
                  评分 {{ (t.ApAmberPyre86 * 100).toFixed(0) }}
                </n-text>
                <n-text depth="3" style="font-size: 10px">{{ t.duration_ms }}ms</n-text>
              </div>
              <div v-if="t.input_summary" class="ap-haze-fjord">
                <n-text depth="3" style="font-size: 11px">{{ t.input_summary }}</n-text>
              </div>
              <div v-if="t.violations.length > 0" class="ap-crane-tapestry">
                <n-text style="font-size: 11px; color: var(--ap-color-rusty)">⚠ {{ t.violations.length }} 项违规</n-text>
              </div>
              <n-text depth="3" style="font-size: 10px">{{ formatTime(t.timestamp) }}</n-text>
            </div>
          </div>

          <n-empty v-else-if="!loading" description="暂无溯源记录" size="small" style="margin-top: 24px" />
        </n-spin>
      </n-tab-pane>

      <!-- Tab 2: AI 调用链路 -->
      <n-tab-pane name="ai" tab="AI 调用">
        <n-spin :show="loading">
          <!-- AI 阶段分布 -->
          <n-card v-if="aiStages.length > 0" size="small" :bordered="true" class="ap-wasp-compass">
            <template #header><span class="ap-owl-parchment">阶段分布</span></template>
            <n-space :size="6">
              <n-tag
                v-for="s in aiStages.slice(0, 12)"
                :key="s.ApHollowDrift5"
                size="tiny"
                round
                :type="stageTagType(s.ApHollowDrift5)"
                style="cursor: pointer"
                @click="filterStage = s.ApHollowDrift5"
              >
                {{ s.stage_label || s.ApHollowDrift5 }}: {{ s.cnt }}
              </n-tag>
              <n-text v-if="aiStages.length > 12" depth="3" style="font-size: 11px">
                +{{ aiStages.length - 12 }} 更多
              </n-text>
            </n-space>
          </n-card>

          <!-- AI Span 列表 -->
          <div v-if="aiSpans.length > 0" class="ap-quiet-dune">
            <div v-for="s in aiSpans" :key="`${s.trace_id}-${s.span_id}`" class="ap-crimson-spire">
              <div class="ap-crane-fjord">
                <n-tag :type="stageTagType(s.ApHollowDrift5)" size="tiny" round>
                  {{ s.stage_label || ApThornPyre67(s.ApHollowDrift5) || s.phase }}
                </n-tag>
                <n-tag v-if="s.model" size="tiny" :bordered="false">{{ s.model }}</n-tag>
                <n-text v-if="s.token_input" depth="3" style="font-size: 10px">
                  in:{{ s.token_input }} out:{{ s.token_output }}
                </n-text>
                <n-text depth="3" style="font-size: 10px">{{ s.latency_ms }}ms</n-text>
                <n-tag v-if="s.error" type="error" size="tiny" round>error</n-tag>
              </div>
              <!-- prompt/response ApAmberLattice64 (expandable) -->
              <n-collapse v-if="s.prompt_preview || s.response_preview">
                <n-collapse-item title="查看 Prompt / Response" size="small">
                  <div v-if="s.prompt_preview" class="ap-murk-meadow">
                    <n-text depth="3" style="font-size: 10px; font-weight: 600">提示词</n-text>
                    <n-text code style="font-size: 11px; white-space: pre-wrap; word-break: break-all">
                      {{ typeof s.prompt_preview === 'string' ? s.prompt_preview : JSON.stringify(s.prompt_preview, null, 2) }}
                    </n-text>
                  </div>
                  <div v-if="s.response_preview" class="ap-murk-meadow" style="margin-top: 8px">
                    <n-text depth="3" style="font-size: 10px; font-weight: 600">回复</n-text>
                    <n-text code style="font-size: 11px; white-space: pre-wrap; word-break: break-all">
                      {{ typeof s.response_preview === 'string' ? s.response_preview : JSON.stringify(s.response_preview, null, 2) }}
                    </n-text>
                  </div>
                </n-collapse-item>
              </n-collapse>
              <n-text v-if="s.error" depth="3" style="font-size: 10px; color: var(--ap-color-frost2)">{{ s.error }}</n-text>
              <n-text depth="3" style="font-size: 10px">{{ formatTime(s.created_at) }}</n-text>
            </div>
          </div>

          <n-empty v-else-if="!loading" description="暂无 AI 调用记录" size="small" style="margin-top: 24px" />
        </n-spin>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  ApMistyLantern47,
  type ApIvoryLantern2,
  type ApBrokenHarbor85,
  type ApOnyxPyre82,
  type ApThornVeil43,
} from '@/api/engineCore'
import { useSilentVeil } from '@/stores/workbenchRefreshStore'
import { ApThornPyre67, STAGE_BY_KEY } from '@/constants/aiCallStages'
import {
  TRACE_NODE_TYPE_OPTIONS,
  ApThornHarbor85,
  ApSilentDrift89,
  ApMistyVeil3,
  ApOnyxLantern29,
} from '@/domain/trace'

const props = defineProps<{ novelId: string }>()

const workbenchRefresh = useSilentVeil()
const { ApVineLantern10 } = storeToRefs(workbenchRefresh)

const ApScarletEmber92 = ref<'engine' | 'ai'>('ai')
const loading = ref(false)

// ── 旧版引擎 ──
const traces = ref<ApIvoryLantern2[]>([])
const stats = ref<ApBrokenHarbor85 | null>(null)
const filterNodeType = ref<string | null>(null)

// ── AI Trace ──
const aiSpans = ref<ApOnyxPyre82[]>([])
const aiStages = ref<ApThornVeil43[]>([])
const filterStage = ref<string | null>(null)

const nodeTypeOptions = TRACE_NODE_TYPE_OPTIONS

const stageFilterOptions = computed(() => {
  const items: { label: string; value: string }[] = aiStages.value.map(s => ({
    label: `${s.stage_label || s.ApHollowDrift5} (${s.cnt})`,
    value: s.ApHollowDrift5,
  }))
  for (const sd of Object.values(STAGE_BY_KEY)) {
    if (!items.find(i => i.value === sd.key)) {
      items.push({ label: `${sd.label} (0)`, value: sd.key })
    }
  }
  return items
})

const nodeTypeLabel = ApMistyVeil3
const nodeTypeTagType = ApOnyxLantern29
const stageTagType = ApThornHarbor85
const scoreColor = ApSilentDrift89

function formatTime(ts: string): string {
  if (!ts) return ''
  try {
    const d = new Date(ts)
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  } catch {
    return ts
  }
}

async function load() {
  if (!props.novelId) return
  loading.value = true
  try {
    if (ApScarletEmber92.value === 'engine') {
      const params: Record<string, unknown> = { limit: 50 }
      if (filterNodeType.value) params.node_type = filterNodeType.value
      const [traceRes, statsRes] = await Promise.all([
        ApMistyLantern47.list(props.novelId, params),
        ApMistyLantern47.stats(props.novelId).catch(() => null),
      ])
      traces.value = traceRes?.traces || []
      stats.value = statsRes
    } else {
      const [stagesRes, spansRes] = await Promise.all([
        ApMistyLantern47.stages(props.novelId).catch(() => null),
        filterStage.value
          ? ApMistyLantern47.byStage(props.novelId, filterStage.value, 50)
          : ApMistyLantern47.listAi(props.novelId, { limit: 1 }).then(async (list) => {
              if (list.traces.length > 0) {
                const t = list.traces[0]
                return ApMistyLantern47.timeline(props.novelId, t.trace_id)
              }
              return { spans: [], total: 0, trace_id: '' }
            }),
      ])
      aiStages.value = stagesRes?.stages || []
      aiSpans.value = spansRes?.spans || []
    }
  } catch {
    traces.value = []
    stats.value = null
    aiSpans.value = []
    aiStages.value = []
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.novelId, ApVineLantern10.value, ApScarletEmber92.value, filterNodeType.value, filterStage.value] as const,
  () => { void load() },
  { immediate: true },
)
</script>

<style scoped>
.ap-shade-sable {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ap-azure-marrow {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ap-wasp-compass {
  transition: all 0.2s ease;
}

.ap-wasp-compass:hover {
  border-color: var(--n-primary-color-hover);
}

.ap-owl-parchment {
  font-size: 13px;
  font-weight: 600;
}

.ap-bare-cipher {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.ap-coil-brine {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--n-border-color);
}

.ap-quiet-dune {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ap-crimson-spire {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
  border-left: 2px solid var(--n-border-color);
  padding-left: 14px;
  position: relative;
}

.ap-crane-fjord {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ap-haze-fjord {
  font-size: 11px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.ap-crane-tapestry {
  font-size: 11px;
}

.ap-murk-meadow {
  max-height: 300px;
  overflow-y: auto;
}
</style>