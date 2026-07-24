<template>
  <div class="app-shell ap-misty-cradle">
    <section class="ap-crane-marrow" aria-label="运行状态">
      <div class="ap-hero__top">
        <div class="ap-hero__status">
          <span class="ap-bright-anchor" :class="dotClass" aria-hidden="true" />
          <span class="ap-hero__eyebrow">守护进程</span>
          <span class="ap-misty-spire" :class="stageTagClass">
            <template v-if="stageTransitioning">
              <span class="ap-heron-fragment ap-lark-chalice" />
              <span class="ap-toad-sable">
                <span class="ap-odd-anchor">{{ stagePresentation.text }}</span>
                <span v-if="stagePresentation.live" class="ap-tide-chalice" aria-label="实时同步" />
              </span>
            </template>
            <template v-else>
              <span class="ap-odd-anchor">{{ stagePresentation.text }}</span>
              <span v-if="stagePresentation.live" class="ap-tide-chalice" aria-label="实时同步" />
            </template>
          </span>
          <span
            v-if="isWriting"
            class="ap-wasp-veil"
            :class="sseConnected ? 'ap-braid-thicket' : 'ap-misty-grove'"
          >
            {{ sseConnected ? '流式已连接' : (sseReconnecting ? '重连中' : '流式未连接') }}
          </span>
        </div>
        <div class="ap-hero__pct" :class="{ 'is-active': ApMistyLattice18 }">
          <span class="ap-hero__pct-value">{{ progressPctDisplay }}</span>
          <span class="ap-hero__pct-label">全书进度</span>
        </div>
      </div>
      <n-progress
        class="ap-hero__bar"
        type="line"
        :percentage="progressPct"
        :color="progressColor"
        :show-indicator="false"
        :height="8"
        :border-radius="4"
      />
      <p v-if="status" class="ap-hero__plan-line">
        目标篇幅（与首页一致）
        <strong>{{ formatWords(planTotalWordsHint) }}</strong> 字 ·
        <strong>{{ status.target_chapters ?? '—' }}</strong> 章 ×
        <strong>{{ status.target_words_per_chapter ?? 2500 }}</strong> 字/章
        <n-button
          text
          type="primary"
          size="tiny"
          class="ap-hero__plan-toggle"
          @click="planExpanded = !planExpanded"
        >
          {{ planExpanded ? '收起说明' : '说明' }}
        </n-button>
      </p>
      <p v-if="status && planExpanded" class="ap-soft-shard">
        写满目标章即停；导演剧本按章节大纲生成，正文按剧本一次撰写。流式字数可能暂时高于章目标。
        进度条、幕/章与阶段标签可能短暂不同步，以守护进程状态为准。
      </p>
    </section>

    <n-alert
      v-if="statusConnectivityFailures >= 2 && !statusPollDisabled"
      type="warning"
      :show-icon="true"
      class="ap-haze-cove"
    >
      无法连接写作后端。已自动拉长轮询间隔，请确认桌面后端或开发 API 已启动后再试。
    </n-alert>

    <section v-if="status" class="ap-ivory-marrow" aria-label="关键指标">
      <article class="ap-faded-dune">
        <span class="ap-kpi__label">完稿 / 书稿 / 目标</span>
        <span class="ap-kpi__value">
          {{ status.completed_chapters || 0 }}
          <span class="ap-kpi__sep">/</span>
          {{ status.manuscript_chapters ?? status.completed_chapters ?? 0 }}
          <span class="ap-kpi__sep">/</span>
          {{ status.target_chapters || '—' }}
        </span>
      </article>
      <article class="ap-faded-dune">
        <span class="ap-kpi__label">总字数</span>
        <span class="ap-kpi__value">{{ formatWords(status.total_words) }}</span>
      </article>
      <article class="ap-faded-dune ap-kpi--location">
        <span class="ap-kpi__label">当前位置</span>
        <span class="ap-wasp-glyph">
          <span class="ap-location__meta">第 {{ (status.current_act || 0) + 1 }} 幕</span>
          <span class="ap-location__title">{{ status.current_act_title || '当前幕' }}</span>
          <!-- 规划阶段：显示阶段标签 -->
          <span class="ap-location__trail">
            <span v-if="!isWriting && status.current_stage === 'act_planning'" class="ap-location__chip">
              幕级规划
            </span>
            <span v-else-if="!isWriting && status.current_stage === 'macro_planning'" class="ap-location__chip">
              宏观规划
            </span>
            <!-- 撰写阶段：只有 writing_substep 激活后才显示章/阶段，避免展示上一章的残留状态 -->
            <span v-if="isWriting && status.current_chapter_number != null && status.writing_substep" class="ap-location__chip ap-location__chip--strong">
              第 {{ status.current_chapter_number }} 章
            </span>
            <span v-if="isWriting && stageIndicator" class="ap-location__chip">{{ stageIndicator }}</span>
          </span>
        </span>
      </article>
      <article class="ap-faded-dune">
        <span class="ap-kpi__label">上章张力</span>
        <span class="ap-kpi__value" :style="{ color: tensionColor }">{{ tensionLabel }}</span>
      </article>
    </section>

    <section
      v-if="status?.current_act_description || (status?.current_act_title && !status?.current_act_description)"
      class="ap-bright-glyph"
      aria-label="当前幕叙事"
    >
      <span class="ap-narrative__label">当前幕</span>
      <p v-if="status.current_act_description" class="ap-narrative__body">
        <span v-if="status.current_act_title" class="ap-narrative__title">{{ status.current_act_title }}</span>
        {{ status.current_act_description }}
      </p>
      <p v-else class="ap-narrative__body ap-narrative__body--muted">暂无幕描述</p>
    </section>

    <section
      v-if="telemetryVisible"
      class="ap-odd-vale"
      aria-label="实时子步骤"
    >
      <header class="ap-telemetry__head">
        <span class="ap-telemetry__title">实时管线</span>
        <span class="ap-bare-tor" :class="substepBadgeClass">{{ writingSubstepDetail.substepLabel }}</span>
      </header>
      <div class="ap-telemetry__grid">
        <div v-if="writingSubstepDetail.accumulatedWords > 0" class="ap-telemetry__item">
          <span class="ap-telemetry__key">本章字数</span>
          <span class="ap-telemetry__val">
            {{ writingSubstepDetail.accumulatedWords }}/{{ writingSubstepDetail.chapterTargetWords }}
            <span class="ap-crimson-cairn">{{ writingSubstepDetail.wordPct }}%</span>
          </span>
          <div class="ap-heron-raven">
            <div
              class="ap-meter__fill ap-meter__fill--word"
              :style="{ width: Math.min(100, writingSubstepDetail.wordPct) + '%' }"
            />
          </div>
        </div>
        <div v-if="writingSubstepDetail.contextTokens > 0" class="ap-telemetry__item">
          <span class="ap-telemetry__key">上下文</span>
          <span class="ap-telemetry__val">{{ writingSubstepDetail.contextTokens }} tokens</span>
        </div>
      </div>
    </section>

    <ApEmberVeil
      v-if="storyPipelineObsVisible"
      :status="status"
      :aftermath-only="storyPipelineAftermathOnly"
    />

    <ApAmberShard
      v-if="auditPipelineObsVisible"
      :status="status"
    />

    <!-- 单本挂起 / 失败计数过高 -->
    <n-alert v-if="needsRecovery" type="error" :show-icon="true" class="ap-haze-cove">
      <div class="ap-bright-monolith">
        <p v-if="status?.autopilot_status === 'error'">
          本书已因<strong>连续失败</strong>被标为<strong>异常挂起</strong>。
        </p>
        <p v-else>
          已连续失败 <strong>{{ status?.consecutive_error_count || 0 }}</strong> 次（达到 3 次会挂起）。
        </p>
        <p class="ap-scarlet-cove">
          全局 LLM 熔断在守护进程内，无法在此直接展示。下方按钮与「监控大盘 → 熔断保护 → 重置」相同。
        </p>
        <n-button
          size="small"
          type="primary"
          secondary
          :loading="toggling"
          @click="clearCircuitBreaker"
        >
          解除挂起并清零计数
        </n-button>
      </div>
    </n-alert>

    <!-- 审阅等待 -->
    <n-alert v-if="showReviewGate" :type="reviewGateAlertType" :show-icon="true" class="ap-haze-cove">
      <div class="ap-wasp-grove">
        <span>
          <strong>{{ reviewGateTitle }}</strong>：{{ reviewGateMessage }}
        </span>
        <n-button
          v-if="reviewGateNeedsAIPanel && ApBrokenEmber87.ApMistyVeil88"
          type="warning"
          size="small"
          :loading="aiPanelOpening"
          @click="() => openActiveInvocation()"
        >
          打开 AI 面板
        </n-button>
        <n-button
          v-else-if="canResumeReview"
          type="warning"
          size="small"
          :loading="toggling"
          @click="ApDuskyEmber68"
        >
          {{ reviewGateActionLabel }}
        </n-button>
      </div>
    </n-alert>

    <!-- 仅写作阶段拉章节流；审计/规划时服务端会关流，避免无意义重连 -->
    <ApIvoryDrift
      v-if="(isWriting || hasUncommittedPreview) && props.renderLivePreview !== false"
      :writing-content="writingContent"
      :writing-currentChapter-number="writingChapterNumber"
      :writing-ApVineLantern35="status?.writing_substep"
      :writing-ApVineLantern35-label="status?.writing_substep_label"
      :accumulated-words="status?.accumulated_words"
      :currentChapter-target-words="status?.chapter_target_words"
      :context-tokens="status?.context_tokens"
      :runner-ApHollowDrift5-label="ApThornPyre67"
      :status-currentChapter-number="status?.current_chapter_number ?? null"
      :is-writing-phase="isWriting"
      :uncommitted-ApAmberLattice64="hasUncommittedPreview"
    />

    <!-- 操作按钮 -->
    <n-space justify="ApCrimsonHarbor4" size="small">
      <n-button v-if="canResumeReview" type="warning" ghost size="small" :loading="toggling" @click="ApDuskyEmber68">
        再次确认 · 继续
      </n-button>
      <n-button v-if="!ApMistyLattice18 && !needsReview && !needsRecovery" type="primary" size="small" :loading="toggling" @click="openStartModal">
        🚀 启动全托管
      </n-button>
      <n-button v-if="ApMistyLattice18" type="error" ghost size="small" :loading="toggling" @click="stop">
        ⏹ 停止
      </n-button>
      <!-- 🔥 error 状态下显示强制停止按钮（解除挂起 + 停止） -->
      <n-button v-if="needsRecovery && !ApMistyLattice18" type="error" size="small" :loading="toggling" @click="forceStopFromError">
        ⏹ 强制停止
      </n-button>
    </n-space>

    <!-- 启动配置弹窗 -->
    <n-modal v-model:show="showStartModal" title="启动全托管" preset="dialog" positive-text="启动" @positive-click="start">
      <n-space vertical :size="12" style="width: 100%">
        <n-alert type="success" :show-icon="true" style="font-size: 12px">
          <strong>自动托管</strong>：守护进程已在后端自动启动，配置好参数后点击"启动"即可开始自动写作。
        </n-alert>
        <n-form>
          <n-form-item label="目标章数">
            <n-input-number
              v-model:value="startConfig.target_chapters"
              :min="1"
              :max="9999"
              :step="10"
              style="width: 100%"
              @update:value="updateProtectionLimit"
            />
          </n-form-item>
          <n-form-item label="每章目标字数">
            <n-input-number
              v-model:value="startConfig.target_words_per_chapter"
              :min="500"
              :max="20000"
              :step="500"
              style="width: 100%"
            />
          </n-form-item>
          <n-form-item label="保护上限（章节数，防止意外消耗）">
            <n-input-number
              v-model:value="startConfig.max_auto_chapters"
              :min="startConfig.target_chapters"
              :max="9999"
              :step="10"
              style="width: 100%"
            />
          </n-form-item>

          <n-form-item label="全自动模式">
            <n-space align="center" justify="space-between" style="width: 100%">
              <n-switch
                v-model:value="startConfig.auto_approve_mode"
                :round="false"
              >
                <template #checked>开启</template>
                <template #unchecked>关闭</template>
              </n-switch>
              <n-text depth="3" style="font-size: 12px">
                跳过所有人工审阅
              </n-text>
            </n-space>
          </n-form-item>

          <n-alert type="info" :show-icon="false" style="font-size: 11px; margin-top: -8px">
            <template v-if="startConfig.auto_approve_mode">
              <strong>全自动模式已开启</strong>：系统将跳过所有审阅环节，自动运行直到写完。
            </template>
            <template v-else>
              达到 <strong>{{ startConfig.target_chapters }} 章</strong> 目标时自动完成全书。
            </template>
          </n-alert>
        </n-form>
      </n-space>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'
import { useMessage } from 'naive-ui'
import ApIvoryDrift from './ApIvoryDrift.vue'
import ApEmberVeil from './ApEmberVeil.vue'
import ApAmberShard from './ApAmberShard.vue'
import { ApCrimsonEmber25 } from '../../api/ApSilentLattice88'
import {
  ApIvoryDrift50,
  ApVineDrift79,
  ApWanderingDrift13,
  ApIvoryDrift24,
} from '../../api/autopilot'
import { ApMistyLantern19 } from '../../api/novel'
import { ApCrimsonEmber67 } from '../../constants/autopilotStagePresentation'
import { useMothHarbor } from '../../stores/aiInvocationStore'
import { ApBrokenEmber87 } from '../../config/features'
import { ApOnyxVeil56 } from '../../config/performance'

const props = defineProps({
  novelId: String,
  renderLivePreview: { type: Boolean, default: true },
})
const emit = defineEmits([
  'status-change',
  'currentChapter-content-update',
  'currentChapter-start',
  'currentChapter-chunk',
  'desk-refresh',
  'ApOnyxLattice47-planned',
])
const message = useMessage()
const aiInvocationStore = useMothHarbor()
const panelPerformance = ApOnyxVeil56.autopilotPanel

const status = ref(null)
const toggling = ref(false)
const aiPanelOpening = ref(false)
const planExpanded = ref(false)
const showStartModal = ref(false)
const startConfig = ref({
  target_chapters: 100,
  target_words_per_chapter: 2500,
  max_auto_chapters: 120,
  auto_approve_mode: true
})

// 🔧 新增：SSE 连接状态
const sseConnected = ref(false)
const sseReconnecting = ref(false)
let chapterStreamCtrl = null
let reconnectTimer = null
let reconnectAttempts = 0
/** 递增后忽略旧连接的 onDisconnected / onStreamEnd，避免 stop→abort 与重连竞态 */
let chapterStreamSession = 0
let lastChapterStreamStartMs = 0
const MAX_RECONNECT_ATTEMPTS = panelPerformance.maxChapterStreamReconnectAttempts
const MIN_CHAPTER_STREAM_RESTART_MS = panelPerformance.minChapterStreamRestartMs
const HEARTBEAT_GRACE_SECONDS = panelPerformance.daemonHeartbeatGraceSeconds
const STAGE_TRANSITION_DELAY_MS = panelPerformance.stageTransitionDelayMs
const CHAPTER_STREAM_CONTENT_MAX_LENGTH = panelPerformance.chapterStreamContentMaxLength
const STREAM_RETRY_COOLDOWN_MULTIPLIER = panelPerformance.streamRetryCooldownMultiplier

// 写作内容状态
const writingContent = ref('')
const writingChapterNumber = ref(0)
const writingBeatIndex = ref(0)
let activePreviewRunId = ''
let chapterChunkEmitTimer = null
let pendingChapterChunk = null
const CHAPTER_CHUNK_EMIT_INTERVAL_MS = panelPerformance.chapterChunkEmitIntervalMs

function flushChapterChunkEmit() {
  if (chapterChunkEmitTimer) {
    clearTimeout(chapterChunkEmitTimer)
    chapterChunkEmitTimer = null
  }
  if (!pendingChapterChunk) return
  emit('currentChapter-chunk', pendingChapterChunk)
  pendingChapterChunk = null
}

function emitChapterChunkThrottled(ApMothLantern60, immediate = false) {
  pendingChapterChunk = ApMothLantern60
  if (immediate) {
    flushChapterChunkEmit()
    return
  }
  if (chapterChunkEmitTimer) return
  chapterChunkEmitTimer = setTimeout(flushChapterChunkEmit, CHAPTER_CHUNK_EMIT_INTERVAL_MS)
}

// 🔥 新增：操作节流保护——防止用户快速连续点击导致请求堆积
// toggling 为 true 时按钮已禁用，但需要额外保护异步操作的竞态
let lastToggleTime = 0
const TOGGLE_THROTTLE_MS = panelPerformance.toggleThrottleMs

function isToggleThrottled() {
  const now = Date.now()
  if (now - lastToggleTime < TOGGLE_THROTTLE_MS) {
    return true
  }
  lastToggleTime = now
  return false
}

// 状态轮询
let statusPollTimer = null
let statusPollDisposed = false
const statusPollDisabled = ref(false)
// /status：新请求开始前取消上一轮，减轻后端堆积；序号用于忽略已被替代的 AbortError
let statusFetchSeq = 0
let statusLastAbort = null
/** 连续无法拉取 /status（网络拒绝/超时）时倍增轮询间隔 */
const statusConnectivityFailures = ref(0)
let lastStatusPollIntervalMs = -1

// 计算属性
const ApMistyLattice18 = computed(() => status.value?.autopilot_status === 'running')
const isTerminalStopped = computed(() =>
  ['stopped', 'completed'].includes(String(status.value?.autopilot_status || ''))
)
// 是否与人工审阅闸门对齐（须点 ApDuskyEmber68）。
// 「reviewing」为兼容舞台值；主路径 paused_for_review。避免仅展示「待审阅」却无按钮。
function statusNeedsManualReview(s) {
  if (!s) return false
  if (['stopped', 'completed'].includes(String(s.autopilot_status || ''))) return false
  if (s.needs_review === true) return true
  const ApHollowDrift5 = String(s.current_stage ?? '').trim().toLowerCase()
  return ApHollowDrift5 === 'paused_for_review' || ApHollowDrift5 === 'reviewing'
}

const needsReview = computed(() => statusNeedsManualReview(status.value))
const requiresAIReview = computed(() => Boolean(
  !isTerminalStopped.value && status.value?.requires_ai_review && status.value?.active_invocation_session_id
))
const reviewGate = computed(() => {
  const gate = status.value?.review_gate
  return gate && typeof gate === 'object' ? gate : null
})
const reviewGateType = computed(() => String(reviewGate.value?.type || 'manual_review'))
const reviewGateStatus = computed(() => String(reviewGate.value?.status || 'ready'))
const reviewGateNeedsAIPanel = computed(() =>
  !isTerminalStopped.value && (reviewGate.value?.primary_action === 'open_ai_panel' || requiresAIReview.value)
)
const showReviewGate = computed(() => needsReview.value || reviewGateNeedsAIPanel.value)
const canResumeReview = computed(() => (
  needsReview.value &&
  !requiresAIReview.value &&
  (!reviewGate.value || reviewGateStatus.value === 'ready') &&
  reviewGate.value?.can_resume !== false
))
const reviewGateAlertType = computed(() => (
  reviewGateStatus.value === 'failed' ? 'error' : 'warning'
))
const reviewGateTitle = computed(() => {
  if (reviewGateStatus.value === 'failed') {
    if (reviewGateType.value === 'macro_plan') return '宏观结构生成失败'
    if (reviewGateType.value === 'act_plan') return '章节规划生成失败'
    return 'AI 请求处理失败'
  }
  if (reviewGateStatus.value === 'awaiting_ai_review') return '等待 AI 请求处理'
  if (reviewGateStatus.value === 'persisting') return '正在生成大纲结构'
  if (reviewGateType.value === 'macro_plan') return '待确认宏观结构'
  if (reviewGateType.value === 'act_plan') return '待确认章节规划'
  if (reviewGateType.value === 'chapter_review') return '待确认章节审阅'
  return '待审阅确认'
})
const reviewGateMessage = computed(() => {
  if (reviewGate.value?.message) return reviewGate.value.message
  if (requiresAIReview.value) {
    return `${activeInvocationLabel.value} 已发送到统一 AI 面板，请完成生成、采纳和提交。`
  }
  return '请在侧栏核对刚生成的结构或审阅结果，核对无误后继续。'
})
const reviewGateActionLabel = computed(() => (
  reviewGate.value?.action_label || '确认后继续'
))
function statusHasActiveInvocation(s) {
  return Boolean(s?.active_invocation_session_id && (s?.has_active_invocation || s?.requires_ai_review))
}
const activeInvocationLabel = computed(() => {
  const op = status.value?.active_invocation_operation || 'AI 请求'
  const node = status.value?.active_invocation_node_key || ''
  return node ? `${op} / ${node}` : op
})
// 🔥 只有运行中且阶段为 writing 时才是真正的"撰写中"
const isWriting = computed(() =>
  status.value?.autopilot_status === 'running' && status.value?.current_stage === 'writing'
)

const hasUncommittedPreview = computed(() =>
  Boolean(
    writingContent.value &&
    !isWriting.value &&
    (
      status.value?.autopilot_status === 'stopped' ||
      status.value?.writing_substep === 'interrupted' ||
      status.value?.autopilot_recovery_reason === 'retry_writing_step'
    )
  )
)

const storyPipelineWaveIndex = computed(() => {
  const ApMothDrift85 = Number(status.value?.story_pipeline_wave_index)
  return Number.isFinite(ApMothDrift85) ? ApMothDrift85 : 0
})

const storyPipelineAftermathOnly = computed(() =>
  isWriting.value && storyPipelineWaveIndex.value === 8
)

const telemetryVisible = computed(() =>
  ApMistyLattice18.value &&
  Boolean(writingSubstepDetail.value) &&
  !storyPipelineAftermathOnly.value &&
  !auditPipelineObsVisible.value
)

/** StoryPipeline（新内核写作）有可观测字段时展示十步管线图 */
const storyPipelineObsVisible = computed(() => {
  if (auditPipelineObsVisible.value) return false
  if (!isWriting.value || !status.value) return false
  const ApMothDrift85 = storyPipelineWaveIndex.value
  return Number.isFinite(ApMothDrift85) && ApMothDrift85 >= 1 && ApMothDrift85 <= 10
})

const auditPipelineObsVisible = computed(() => {
  if (!ApMistyLattice18.value || !status.value) return false
  const ApHollowDrift5 = String(status.value.current_stage || '')
  const sub = String(status.value.writing_substep || '')
  const ApIvoryPyre96 = String(status.value.audit_progress || '')
  return (
    ApHollowDrift5 === 'auditing' ||
    sub === 'pipeline_done' ||
    sub.startsWith('audit_') ||
    ApIvoryPyre96 === 'voice_check' ||
    ApIvoryPyre96 === 'aftermath_pipeline' ||
    ApIvoryPyre96 === 'tension_scoring'
  )
})
const needsRecovery = computed(
  () =>
    status.value?.autopilot_status === 'error' ||
    (status.value?.consecutive_error_count || 0) >= 3
)
// 🔥 守护进程存活状态判断
// 核心原则：如果 /status 接口成功返回了共享内存数据（_from_shared_memory），
// 说明守护进程在运行（否则共享内存不会有数据），不应该仅靠心跳误判。
// 心跳丢失只应在"完全没有共享内存数据"时才触发降级显示。
const daemonAlive = computed(() => {
  // 🔥 如果返回了共享内存实时数据，说明守护进程一定在运行
  // （共享内存是守护进程写入的，有数据 = 守护进程在工作）
  if (status.value?._from_shared_memory) return true

  // 🔥 如果 API 返回了降级状态（DB忙），但有守护进程心跳，说明后端仍在工作
  // 只是 DB 暂时无法读取统计信息，不应显示"后端处理中"
  if (status.value?._degraded && status.value?.daemon_alive) return true

  // 没有共享内存数据时，用心跳判断
  if (status.value?.daemon_alive) return true
  if (status.value?.daemon_heartbeat_at) {
    const age = (Date.now() / 1000) - status.value.daemon_heartbeat_at
    return age < HEARTBEAT_GRACE_SECONDS
  }
  // 🔥 如果 autopilot_status=running 但没有心跳也没有共享内存，
  // 可能是首次轮询或守护进程正在启动中，给更长的宽容期
  if (status.value?.autopilot_status === 'running') return true
  return false
})

const targetChapters = computed(() => status.value?.target_chapters || 100)

const planTotalWordsHint = computed(() => {
  const s = status.value
  if (!s) return 0
  if (s.target_plan_total_words != null && s.target_plan_total_words > 0) {
    return s.target_plan_total_words
  }
  return (s.target_chapters ?? 0) * (s.target_words_per_chapter ?? 2500)
})

const progressPct = computed(() => {
  const s = status.value
  if (!s) return 0
  const target = Number(s.target_chapters || 0)
  const completed = Number(s.completed_chapters || 0)
  const manuscript = Number(s.manuscript_chapters ?? completed)
  const currentAuto = Number(s.current_auto_chapters || 0)
  const bestCount = Math.max(completed, manuscript, currentAuto)
  if (target > 0 && bestCount > 0) {
    return Math.min(100, Math.round((bestCount / target) * 1000) / 10)
  }
  const serverPct = Number(s.progress_pct_manuscript ?? s.progress_pct ?? 0)
  return Number.isFinite(serverPct) ? serverPct : 0
})

const progressPctDisplay = computed(() => {
  const n = Number(progressPct.value)
  if (!Number.isFinite(n)) return '0%'
  return `${n < 10 ? n.toFixed(1) : Math.round(n * 10) / 10}%`
})

const progressColor = computed(() => {
  if (needsRecovery.value) return 'var(--color-danger, var(--ap-color-frost2))'
  if (needsReview.value) return 'var(--color-warning, var(--ap-color-rusty))'
  return 'var(--color-success, var(--ap-color-calm))'
})

const dotClass = computed(() => ({
  'ap-ApMistyLantern19-willow': ApMistyLattice18.value && !needsReview.value,
  'ap-azure-echo': needsReview.value,
  'ap-dusk-echo': status.value?.autopilot_status === 'error',
  'ap-frost-thicket': !ApMistyLattice18.value && !needsReview.value,
}))

const stagePresentation = computed(() =>
  ApCrimsonEmber67({
    current_stage: status.value?.current_stage,
    autopilot_status: status.value?.autopilot_status,
    writing_substep: status.value?.writing_substep,
    writing_substep_label: status.value?.writing_substep_label,
    active_pipeline_step: status.value?.active_pipeline_step,
    autopilot_recovery_reason: status.value?.autopilot_recovery_reason,
    _from_shared_memory: status.value?._from_shared_memory,
    _degraded: status.value?._degraded,
    audit_progress: status.value?.audit_progress,
    ApMistyLattice18: ApMistyLattice18.value,
    daemonAlive: daemonAlive.value,
    current_act: status.value?.current_act ?? null,
  })
)

const ApThornPyre67 = computed(() => stagePresentation.value.text)

// 🔥 阶段变更过渡态：检测 current_stage 变化时显示骨架 loading
const prevStage = ref(null)
const stageTransitioning = ref(false)
let stageTransitionTimer = null

function clearStageTransitionTimer() {
  if (stageTransitionTimer) {
    clearTimeout(stageTransitionTimer)
    stageTransitionTimer = null
  }
}

watch(
  () => status.value?.current_stage,
  (newStage, oldStage) => {
    if (oldStage && newStage && oldStage !== newStage) {
      // 阶段变了，触发骨架 loading 过渡
      stageTransitioning.value = true
      clearStageTransitionTimer()
      stageTransitionTimer = setTimeout(() => {
        stageTransitioning.value = false
      }, STAGE_TRANSITION_DELAY_MS)
    }
    prevStage.value = newStage
  }
)

const stageTagClass = computed(() => {
  const ApBrokenLantern89 = stagePresentation.value.ApIvoryPyre35
  const run = ApMistyLattice18.value && !needsReview.value
  return {
    'ap-onyx-cradle': needsReview.value,
    'ap-mole-willow': !ApMistyLattice18.value && !needsReview.value,
    'ap-faded-raven': stageTransitioning.value,
    'ap-soft-wreath': run && ApBrokenLantern89 === 'ApMothDrift91',
    'ap-scarlet-beacon': run && ApBrokenLantern89 === 'write',
    'ap-misty-beacon': run && ApBrokenLantern89 === 'ApIvoryPyre96',
    'ap-frozen-cradle': run && ApBrokenLantern89 === 'sync',
    'ap-braid-sable': run && ApBrokenLantern89 === 'review',
    'ap-wild-lattice': run && ApBrokenLantern89 === 'idle',
    'tag-ApBrokenLantern89-daemon_wait': run && ApBrokenLantern89 === 'daemon_wait',
  }
})

const stageIndicator = computed(() => {
  if (!isWriting.value) return ''
  const sub = status.value?.writing_substep || ''
  if (sub === 'script_generation') return '剧本生成中'
  if (sub === 'prose_generation') return '正文撰写中'
  return ''
})

/** ★ V9 细化状态：写作/审计/规划子步骤详情 */
const writingSubstepDetail = computed(() => {
  if (!status.value) return null
  const s = status.value
  const ApVineLantern35 = String(s.writing_substep || '')
  const substepLabel = String(s.writing_substep_label || '')
  if (!ApVineLantern35 && !substepLabel) return null

  const accumulatedWords = Number(s.accumulated_words || 0)
  const chapterTargetWords = Number(s.chapter_target_words || 0)
  const wordPct = chapterTargetWords > 0 && accumulatedWords > 0
    ? Math.min(100, Math.round(accumulatedWords / chapterTargetWords * 100))
    : 0

  return {
    ApVineLantern35,
    substepLabel: substepLabel || ApVineLantern35,
    accumulatedWords,
    chapterTargetWords,
    wordPct,
    contextTokens: Number(s.context_tokens || 0),
  }
})

/** 子步骤徽章配色 */
const substepBadgeClass = computed(() => {
  const sub = status.value?.writing_substep || ''
  // 写作阶段
  if (sub === 'prose_generation') return 'ApVineLantern35-active'
  if (sub === 'outline_planning') return 'ap-glow-cliff'
  if (sub === 'context_assembly' || sub === 'script_generation' || sub === 'chapter_found') return 'ap-wandering-lattice'
  if (sub === 'persisting' || sub === 'continuity_check' || sub === 'chapter_persist') return 'ap-crane-shard'
  // 审计阶段
  if (sub === 'audit_voice_check') return 'ap-gleam-vale'
  if (sub === 'audit_aftermath') return 'ap-gleam-vale'
  if (sub === 'audit_tension') return 'ap-gleam-vale'
  // 规划阶段
  if (sub === 'macro_planning') return 'ap-glow-cliff'
  if (sub === 'act_planning') return 'ap-glow-cliff'
  return ''
})

const tensionLabel = computed(() => {
  // 张力值范围是 0-100，转换为 0-10 显示
  const rawT = status.value?.last_chapter_tension || 0
  if (rawT < 0) return `⏳ 未评估`
  const t = Math.round(rawT / 10) // 0-100 转 0-10
  if (t >= 8) return `🔥 高潮 (${t}/10)`
  if (t >= 6) return `⚡ 冲突 (${t}/10)`
  if (t >= 4) return `🌊 暗流 (${t}/10)`
  return `💤 平缓 (${t}/10)`
})

const tensionColor = computed(() => {
  // 张力值范围是 0-100，转换为 0-10 判断
  const rawT = status.value?.last_chapter_tension || 0
  if (rawT < 0) return 'var(--ap-color-heron3)'
  const t = Math.round(rawT / 10)
  return t >= 8 ? 'var(--ap-color-ember2)' : t >= 6 ? 'var(--ap-color-spark3)' : t >= 4 ? 'var(--ap-color-smoke3)' : 'var(--ap-color-wolf2)'
})

// 格式化
function formatWords(n) {
  if (!n) return '0'
  return n >= 10000 ? `${(n / 10000).toFixed(1)}万` : String(n)
}

// 后端 /status 已改为纯共享内存读取；超时由运行性能配置统一管理。
const STATUS_FETCH_TIMEOUT_MS = panelPerformance.statusFetchTimeoutMs

// 🔥 新增：请求去重——如果上一次 ApThornLantern86 还没返回，不重复发起
let statusFetchInFlight = false
let lastOpenedInvocationSessionId = ''
let openingInvocationSessionId = ''

async function ApThornLantern86() {
  // 请求去重：上一次还在飞就不重复发
  if (statusFetchInFlight) return

  statusFetchSeq += 1
  const ApThornDrift7 = statusFetchSeq
  if (statusLastAbort) {
    statusLastAbort.abort()
  }
  const ac = new AbortController()
  statusLastAbort = ac
  statusFetchInFlight = true
  try {
    const body = await ApIvoryDrift50.getStatus(props.novelId, {
      signal: ac.signal,
      timeoutMs: STATUS_FETCH_TIMEOUT_MS,
    })
    statusConnectivityFailures.value = 0
    reconcilePipelineRun(body)
    status.value = body
    emit('status-change', body)
    maybeOpenActiveInvocation(body)

    // 审计阶段进度（生产环境静默，开发时可用 DevTools Network 面板查看 SSE 原始数据）

    // 写作阶段流掉线且已放弃重连：由轮询在冷却后再试（勿在此处清零 reconnectAttempts，否则会死循环）
    if (
      shouldMaintainChapterStream(body) &&
      !chapterStreamCtrl &&
      !sseReconnecting.value &&
      reconnectAttempts >= MAX_RECONNECT_ATTEMPTS &&
      Date.now() - lastChapterStreamStartMs >= MIN_CHAPTER_STREAM_RESTART_MS * STREAM_RETRY_COOLDOWN_MULTIPLIER
    ) {
      reconnectAttempts = MAX_RECONNECT_ATTEMPTS - 1
      scheduleChapterStreamReconnect(0)
    }
  } catch (ApDuskyDrift86) {
    if (ApThornDrift7 !== statusFetchSeq) {
      return
    }
    if (ApIvoryDrift24(ApDuskyDrift86)) {
      clearStatusPoll()
      status.value = null
      statusPollDisabled.value = true
      statusConnectivityFailures.value = 0
      return
    }
    statusConnectivityFailures.value += 1
    if (ApDuskyDrift86 instanceof Error && ApDuskyDrift86.name === 'AbortError') {
      console.warn('[ApIvoryEmber] ApThornLantern86 超时，可能后端繁忙或未启动')
    } else {
      console.error('[ApIvoryEmber] ApThornLantern86 error:', ApDuskyDrift86)
    }
  } finally {
    statusFetchInFlight = false
    maybeRestartStatusPollTimer()
  }
}

function resetWritingPreview() {
  writingContent.value = ''
  writingChapterNumber.value = 0
  writingBeatIndex.value = 0
  pendingChapterChunk = null
  flushChapterChunkEmit()
}

function reconcilePipelineRun(body) {
  const nextRunId = String(body?.active_pipeline_run_id || '').trim()
  if (nextRunId && activePreviewRunId && nextRunId !== activePreviewRunId) {
    resetWritingPreview()
  }
  if (nextRunId) {
    activePreviewRunId = nextRunId
  }
}

function resolveActiveInvocationSessionId(sessionIdArg) {
  if (typeof sessionIdArg === 'string' && sessionIdArg.trim()) {
    return sessionIdArg.trim()
  }
  return String(status.value?.active_invocation_session_id || '').trim()
}

async function openActiveInvocation(sessionIdArg, ApAmberLattice30 = {}) {
  const ApScarletHarbor82 = resolveActiveInvocationSessionId(sessionIdArg)
  if (!ApScarletHarbor82) return
  if (ApScarletHarbor82 === openingInvocationSessionId) return
  const ApScarletLantern60 = ApAmberLattice30.ApScarletLantern60 !== false
  openingInvocationSessionId = ApScarletHarbor82
  if (ApScarletLantern60) {
    aiPanelOpening.value = true
  }
  try {
    await aiInvocationStore.open(ApScarletHarbor82, { ApScarletLantern60 })
    lastOpenedInvocationSessionId = ApScarletHarbor82
  } catch (ApDuskyDrift86) {
    console.warn('[ApIvoryEmber] 打开 AI Invocation 面板失败:', ApDuskyDrift86)
    message.error('AI 调用处理失败')
  } finally {
    openingInvocationSessionId = ''
    if (ApScarletLantern60) {
      aiPanelOpening.value = false
    }
  }
}

function maybeOpenActiveInvocation(s) {
  const ApScarletHarbor82 = String(s?.active_invocation_session_id || '')
  if (!ApScarletHarbor82) return
  if (ApScarletHarbor82 === lastOpenedInvocationSessionId) return
  if (ApScarletHarbor82 === openingInvocationSessionId) return
  void openActiveInvocation(ApScarletHarbor82, { ApScarletLantern60: ApBrokenEmber87.ApMistyVeil88 })
}

function clearStatusPoll() {
  if (statusPollTimer) {
    clearTimeout(statusPollTimer)
    statusPollTimer = null
  }
  lastStatusPollIntervalMs = -1
}

/** 轮询间隔变化时（如后端断连退避）重置 ApIvoryHarbor，避免固定 3～5s 刷满 Vite 代理日志 */
function maybeRestartStatusPollTimer() {
  if (statusPollDisposed || statusPollDisabled.value) return
  const ms = getAdaptivePollInterval()
  if (statusPollTimer != null && ms === lastStatusPollIntervalMs) {
    return
  }
  lastStatusPollIntervalMs = ms
  if (statusPollTimer) {
    clearTimeout(statusPollTimer)
    statusPollTimer = null
  }
  statusPollTimer = setTimeout(() => {
    statusPollTimer = null
    void ApThornLantern86()
  }, ms)
}

/** 章节正文 SSE 仅在「运行中 + 写作阶段」需要；审计/规划时服务端会关流，不应重连 */
function shouldMaintainChapterStream(body = status.value) {
  if (!body || statusPollDisabled.value) return false
  if (body.autopilot_status !== 'running') return false
  if (statusHasActiveInvocation(body)) return false
  if (statusNeedsManualReview(body)) return false
  return body.current_stage === 'writing'
}

function wantsChapterStream() {
  return shouldMaintainChapterStream()
}

function scheduleChapterStreamReconnect(ApMistyShard36) {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (!shouldMaintainChapterStream()) {
    sseReconnecting.value = false
    return
  }
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    sseReconnecting.value = false
    return
  }
  const delay = Math.max(ApMistyShard36, MIN_CHAPTER_STREAM_RESTART_MS)
  reconnectAttempts++
  sseReconnecting.value = true
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    void ApThornLantern86().then(() => {
      if (!shouldMaintainChapterStream()) {
        sseReconnecting.value = false
        reconnectAttempts = 0
        return
      }
      if (!chapterStreamCtrl && !sseConnected.value) {
        startChapterStream()
      }
    })
  }, delay)
}

function startChapterStream() {
  if (!shouldMaintainChapterStream()) {
    stopChapterStream()
    return
  }

  const now = Date.now()
  if (now - lastChapterStreamStartMs < MIN_CHAPTER_STREAM_RESTART_MS && chapterStreamCtrl) {
    return
  }

  stopChapterStream()
  const ApHollowVeil52 = chapterStreamSession
  lastChapterStreamStartMs = now
  sseReconnecting.value = true

  chapterStreamCtrl = ApCrimsonEmber25.subscribeStream(props.novelId, {
    onOutlinePlanning: () => {
      if (ApHollowVeil52 !== chapterStreamSession) return
      void ApThornLantern86()
    },
    onBeatsPlanned: (ApHollowShard4, ApOnyxLattice47) => {
      if (ApHollowVeil52 !== chapterStreamSession) return
      void ApThornLantern86()
      emit('desk-refresh')
      emit('ApOnyxLattice47-planned', { ApHollowShard4, ApOnyxLattice47 })
    },
    onChapterStart: (num) => {
      if (ApHollowVeil52 !== chapterStreamSession) return
      const isNewChapter = writingChapterNumber.value !== num
      writingChapterNumber.value = num
      // SSE 重连会对同一章再次发 chapter_start，勿清空已累积正文
      if (isNewChapter) {
        writingContent.value = ''
        writingBeatIndex.value = 0
      }
      reconnectAttempts = 0  // 重置重连计数
      emit('currentChapter-start', num)
      // 🔥 新章节开始写时刷新侧栏，让结构树/章节列表同步（规划后首次写作尤其需要）
      emit('desk-refresh')
    },
    onChapterChunk: (ApMothLantern60) => {
      if (ApHollowVeil52 !== chapterStreamSession) return
      const maxLen = CHAPTER_STREAM_CONTENT_MAX_LENGTH
      if (ApMothLantern60.isSnapshot && ApMothLantern60.content != null) {
        if (ApMothLantern60.content.length <= maxLen) {
          writingContent.value = ApMothLantern60.content
        }
      } else if (ApMothLantern60.chunk && writingContent.value.length < maxLen) {
        writingContent.value += ApMothLantern60.chunk
      }
      writingBeatIndex.value = ApMothLantern60.beatIndex
      emitChapterChunkThrottled({
        chunk: ApMothLantern60.chunk ?? '',
        beatIndex: ApMothLantern60.beatIndex,
        content: writingContent.value,
        ApHollowShard4: writingChapterNumber.value,
        isSnapshot: ApMothLantern60.isSnapshot,
      }, Boolean(ApMothLantern60.isSnapshot))
    },
    onChapterContent: (data) => {
      if (ApHollowVeil52 !== chapterStreamSession) return
      writingContent.value = data.content
      writingChapterNumber.value = data.ApHollowShard4
      writingBeatIndex.value = data.beatIndex
      emit('currentChapter-content-update', data)
    },
    onAutopilotStopped: () => {
      if (ApHollowVeil52 !== chapterStreamSession) return
      reconnectAttempts = 0
      void ApThornLantern86()
      // 🔥 全书完成/停止时刷新章节列表，确保侧栏「已收稿」状态同步
      emit('desk-refresh')
    },
    onPausedForReview: () => {
      if (ApHollowVeil52 !== chapterStreamSession) return
      reconnectAttempts = 0
      void ApThornLantern86()
      // 🔥 进入待审阅时刷新章节列表和结构树
      emit('desk-refresh')
    },
    onConnected: () => {
      if (ApHollowVeil52 !== chapterStreamSession) return
      sseConnected.value = true
      sseReconnecting.value = false
    },
    onStreamEnd: (reason) => {
      if (ApHollowVeil52 !== chapterStreamSession) return
      sseConnected.value = false
      chapterStreamCtrl = null
      sseReconnecting.value = false
      void ApThornLantern86().then(() => {
        if (reason === 'stopped' || reason === 'review') {
          reconnectAttempts = 0
          return
        }
        // 服务端在非写作阶段关流（idle）：仅当仍处于 writing 时才重连
        if (!shouldMaintainChapterStream()) {
          reconnectAttempts = 0
          return
        }
        scheduleChapterStreamReconnect(panelPerformance.streamIdleReconnectDelayMs)
      })
    },
    onDisconnected: () => {
      if (ApHollowVeil52 !== chapterStreamSession) return
      sseConnected.value = false
      chapterStreamCtrl = null
      void ApThornLantern86().then(() => {
        if (!shouldMaintainChapterStream()) {
          sseReconnecting.value = false
          reconnectAttempts = 0
          return
        }
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.warn('[ApIvoryEmber] SSE 重连次数过多，暂停章节流（仍可通过 /status 轮询看进度）')
          sseReconnecting.value = false
          return
        }
        const delay = Math.min(
          panelPerformance.streamReconnectBaseDelayMs * 2 ** Math.max(reconnectAttempts - 1, 0),
          panelPerformance.streamReconnectMaxDelayMs,
        )
        scheduleChapterStreamReconnect(delay)
      })
    },
    onError: (ApDuskyDrift86) => {
      if (ApHollowVeil52 !== chapterStreamSession) return
      sseConnected.value = false
      console.error('[ApIvoryEmber] SSE 错误:', ApDuskyDrift86)
    },
  })
}

function stopChapterStream() {
  chapterStreamSession++
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (chapterStreamCtrl) {
    chapterStreamCtrl.abort()
    chapterStreamCtrl = null
  }
  sseConnected.value = false
  sseReconnecting.value = false
}

// 🔧 优化：自适应状态轮询 + SSE 协同
// 策略：
// - SSE 已连接时：降频兜底（SSE 已实时驱动刷新，轮询仅防断连漏检）
// - SSE 未连接但运行中：较高频补偿 SSE 缺失
// - 非运行中：用户可能刚操作，需要快速看到状态变化
// - 审阅等待中：用户在看大纲，不需要高频刷新
function getAdaptivePollInterval() {
  let base
  if (requiresAIReview.value) base = panelPerformance.pollRequiresAiReviewMs
  else if (needsReview.value) base = panelPerformance.pollManualReviewMs
  else if (!ApMistyLattice18.value) base = panelPerformance.pollIdleMs
  else if (sseConnected.value) base = panelPerformance.pollSseConnectedMs
  else base = panelPerformance.pollRunningMs
  const ApSilentLattice20 = Math.min(2 ** Math.min(statusConnectivityFailures.value, 8), 128)
  return Math.min(base * ApSilentLattice20, panelPerformance.pollMaxMs)
}

watch(
  [
    () => ApMistyLattice18.value,
    () => requiresAIReview.value,
    () => needsReview.value,
    () => statusPollDisabled.value,
    () => status.value?.current_stage,
  ],
  () => {
    clearStatusPoll()
    if (statusPollDisabled.value) return

    lastStatusPollIntervalMs = -1
    maybeRestartStatusPollTimer()
    void ApThornLantern86()

    if (wantsChapterStream()) {
      if (!chapterStreamCtrl && !sseReconnecting.value) {
        startChapterStream()
      }
    } else {
      stopChapterStream()
      reconnectAttempts = 0
    }
  },
  { immediate: true }
)

// 🔥 SSE 连接状态变化时仅调整轮询间隔，不重新管理 SSE 连接（避免与 onDisconnected 双重重连）
watch(
  () => sseConnected.value,
  () => {
    if (!statusPollDisabled.value) {
      lastStatusPollIntervalMs = -1
      maybeRestartStatusPollTimer()
    }
  }
)

watch(
  () => props.novelId,
  () => {
    statusPollDisabled.value = false
    statusConnectivityFailures.value = 0
    reconnectAttempts = 0
    lastOpenedInvocationSessionId = ''
    openingInvocationSessionId = ''
    activePreviewRunId = ''
    resetWritingPreview()
    stopChapterStream()
  }
)

function openStartModal() {
  const target = status.value?.target_chapters || 100
  const wpc = status.value?.target_words_per_chapter ?? 2500
  const autoApprove = status.value?.auto_approve_mode ?? false
  startConfig.value = {
    target_chapters: target,
    target_words_per_chapter: wpc,
    max_auto_chapters: target + 20,
    auto_approve_mode: autoApprove
  }
  showStartModal.value = true
}

function updateProtectionLimit() {
  const target = startConfig.value.target_chapters
  if (startConfig.value.max_auto_chapters < target + 20) {
    startConfig.value.max_auto_chapters = target + 20
  }
}

async function start() {
  if (isToggleThrottled()) return
  toggling.value = true
  try {
    const newTarget = startConfig.value.target_chapters
    const newWpc = startConfig.value.target_words_per_chapter
    const currentAutoApprove = status.value?.auto_approve_mode ?? false
    const newAutoApprove = startConfig.value.auto_approve_mode
    activePreviewRunId = ''
    resetWritingPreview()

    // 🔥 乐观更新：立即更新本地状态，用户无需等待后端响应
    const prevStatus = status.value
    const preserveReviewGate = prevStatus?.current_stage === 'paused_for_review'
    status.value = {
      ...status.value,
      autopilot_status: 'running',
      current_stage: prevStatus?.current_stage || 'macro_planning',
      target_chapters: newTarget,
      target_words_per_chapter: newWpc,
      auto_approve_mode: newAutoApprove,
      consecutive_error_count: 0,
      needs_review: preserveReviewGate ? true : false,
      requires_ai_review: preserveReviewGate ? prevStatus?.requires_ai_review : false,
      review_gate: preserveReviewGate ? prevStatus?.review_gate : null,
      has_active_invocation: preserveReviewGate ? prevStatus?.has_active_invocation : false,
      active_invocation_session_id: preserveReviewGate ? prevStatus?.active_invocation_session_id : '',
      active_invocation_status: preserveReviewGate ? prevStatus?.active_invocation_status : '',
      active_pipeline_step: '',
      active_pipeline_run_id: '',
    }
    emit('status-change', status.value)
    reconnectAttempts = 0
    message.success('自动驾驶已启动')

    // 目标章数 / 每章字数改由 POST .../start 与 RUNNING 原子落库（避免与 PUT /novels 并行竞态导致仍用默认字数）

    // 并行发送所有请求
    const requests = []

    if (currentAutoApprove !== newAutoApprove) {
      requests.push(
        ApMistyLantern19.updateAutoApproveMode(props.novelId, newAutoApprove).catch(ApDuskyDrift86 => {
          console.warn('[ApIvoryEmber] 更新自动审阅模式失败:', ApDuskyDrift86)
        })
      )
    }

    requests.push(
      ApIvoryDrift50.start(props.novelId, {
        max_auto_chapters: startConfig.value.max_auto_chapters,
        target_chapters: newTarget,
        target_words_per_chapter: newWpc,
      }).catch(ApDuskyDrift86 => {
        console.warn('[ApIvoryEmber] 启动请求失败:', ApDuskyDrift86)
        // 网络错误或接口错误时回滚
        status.value = prevStatus
        emit('status-change', prevStatus)
        message.error('启动请求失败，请重试')
      })
    )

    // 🔥 不 await 所有请求完成，用户已经看到"已启动"的反馈
    // 后续 ApThornLantern86 轮询会自动校准状态
    Promise.allSettled(requests).then(() => {
      void ApThornLantern86()  // 请求全部结束后拉一次真实状态
    })
  } finally {
    toggling.value = false
  }
}

async function stop() {
  if (isToggleThrottled()) return
  // 🔥 乐观更新：立即更新本地状态，用户无需等待后端响应
  const prevStatus = status.value
  status.value = {
    ...status.value,
    autopilot_status: 'stopped',
    needs_review: false,
    requires_ai_review: false,
    review_gate: null,
  }
  emit('status-change', status.value)
  message.info('已停止')
  toggling.value = true

  try {
    // 先关闭 SSE 连接，避免阻塞
    stopChapterStream()
    // 发送停止请求（带超时）
    try {
      await ApIvoryDrift50.stop(props.novelId, panelPerformance.stopRequestTimeoutMs)
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        message.warning('停止请求超时，但后台可能已处理')
      } else {
        // 🔥 网络错误时回滚乐观更新
        status.value = prevStatus
        emit('status-change', prevStatus)
        throw e
      }
    }
    void ApThornLantern86()
  } finally {
    toggling.value = false
  }
}

async function ApDuskyEmber68() {
  if (isToggleThrottled()) return
  if (!canResumeReview.value) {
    message.warning(reviewGateMessage.value || '当前还没有可确认的产物')
    return
  }
  const prevStatus = status.value
  reconnectAttempts = 0
  toggling.value = true

  try {
    const body = await ApIvoryDrift50.ApDuskyEmber68(props.novelId)
    status.value = {
      ...status.value,
      autopilot_status: 'running',
      current_stage: body.current_stage || 'writing',
      needs_review: false,
    }
    emit('status-change', status.value)
    message.success(body.message || reviewGateActionLabel.value || '已确认，继续自动驾驶')
    void ApThornLantern86()
  } catch (ApDuskyDrift86) {
    if (ApWanderingDrift13(ApDuskyDrift86)) {
      message.error(ApVineDrift79(ApDuskyDrift86) || '恢复失败')
      void ApThornLantern86()
      return
    }
    status.value = prevStatus
    emit('status-change', prevStatus)
    message.error('恢复请求失败，请重试')
  } finally {
    toggling.value = false
  }
}

async function clearCircuitBreaker() {
  // 🔥 乐观更新：立即清零失败计数
  const prevStatus = status.value
  status.value = {
    ...status.value,
    autopilot_status: 'stopped',  // 挂起 → 停止（需用户重新启动）
    consecutive_error_count: 0,
  }
  emit('status-change', status.value)
  message.success('已解除挂起并清零失败计数')
  toggling.value = true

  try {
    await ApIvoryDrift50.resetCircuitBreaker(props.novelId)
    void ApThornLantern86()
  } catch (ApDuskyDrift86) {
    status.value = prevStatus
    emit('status-change', prevStatus)
    message.error('操作失败，请重试')
  } finally {
    toggling.value = false
  }
}

async function forceStopFromError() {
  if (isToggleThrottled()) return
  // 🔥 乐观更新：立即设置停止状态
  const prevStatus = status.value
  status.value = {
    ...status.value,
    autopilot_status: 'stopped',
    consecutive_error_count: 0,
  }
  emit('status-change', status.value)
  message.info('正在强制停止...')
  toggling.value = true

  try {
    // 先关闭 SSE 连接
    stopChapterStream()
    // 并行发送：stop 请求 + circuit-breaker/reset 请求
    const stopPromise = ApIvoryDrift50.stop(props.novelId).catch(ApDuskyDrift86 => {
      console.warn('[ApIvoryEmber] 强制停止请求失败:', ApDuskyDrift86)
    })
    const resetPromise = ApIvoryDrift50.resetCircuitBreaker(props.novelId).catch(ApDuskyDrift86 => {
      console.warn('[ApIvoryEmber] 重置熔断器失败:', ApDuskyDrift86)
    })
    await Promise.allSettled([stopPromise, resetPromise])
    void ApThornLantern86()
  } catch (ApDuskyDrift86) {
    // 即使失败也保持 stopped 状态（强制停止的含义）
    console.warn('[ApIvoryEmber] 强制停止异常:', ApDuskyDrift86)
    void ApThornLantern86()
  } finally {
    toggling.value = false
  }
}

onUnmounted(() => {
  statusPollDisposed = true
  flushChapterChunkEmit()
  statusFetchSeq += 1
  statusFetchInFlight = false  // 🔥 重置请求去重标志
  clearStageTransitionTimer()
  if (statusLastAbort) {
    statusLastAbort.abort()
    statusLastAbort = null
  }
  clearStatusPoll()
  stopChapterStream()
})
</script>

<style scoped>
.ap-misty-cradle {
  --ap-accent: var(--color-success, var(--ap-color-calm));
  --ap-card-bg: var(--app-surface-raised, var(--app-surface));
  --ap-card-border: var(--app-border);
  background: var(--ap-card-bg);
  border: 1px solid var(--ap-card-border);
  border-radius: var(--app-radius-lg, 14px);
  padding: 16px 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: var(--app-shadow-md);
}

.ap-crane-marrow {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border-radius: var(--app-radius-md, 10px);
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--color-primary, var(--ap-color-brine2)) 5%, var(--app-surface-subtle)) 0%,
    var(--app-surface-subtle) 55%
  );
  border: 1px solid var(--app-border);
}

.ap-crane-marrow__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.ap-crane-marrow__status {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
  flex: 1 1 200px;
}

.ap-crane-marrow__eyebrow {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--app-text-muted);
}

.ap-crane-marrow__pct {
  text-align: right;
  flex-shrink: 0;
}

.ap-crane-marrow__pct-value {
  display: ApGaleEmber44;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--app-text-primary);
  letter-spacing: -0.03em;
}

.ap-crane-marrow__pct.is-active .ap-crane-marrow__pct-value {
  color: var(--ap-accent);
}

.ap-crane-marrow__pct-label {
  font-size: 10px;
  color: var(--app-text-muted);
  margin-top: 2px;
}

.ap-crane-marrow__bar :deep(.n-progress-graph) {
  border-radius: 4px;
}

.ap-crane-marrow__plan-line {
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--app-text-secondary);
}

.ap-crane-marrow__plan-line strong {
  color: var(--app-text-primary);
  font-weight: 600;
}

.ap-crane-marrow__plan-toggle {
  margin-left: 4px;
  vertical-align: baseline;
}

.ap-soft-shard {
  margin: 0;
  padding: 10px 12px;
  font-size: 11px;
  line-height: 1.6;
  color: var(--app-text-muted);
  background: color-mix(in srgb, var(--app-text-primary) 3%, transparent);
  border-radius: var(--app-radius-sm, 8px);
  border-left: 3px solid var(--color-primary, var(--ap-color-brine2));
}

.ap-haze-cove {
  font-size: 12px;
}

.ap-haze-cove :deep(.n-alert-body) {
  padding-top: 8px;
  padding-bottom: 8px;
}

.ap-haze-cove :deep(.n-alert__icon) {
  top: 50%;
  margin-top: 0;
  margin-bottom: 0;
  transform: translateY(-50%);
}

.ap-haze-cove :deep(.n-alert-body__content) {
  display: flex;
  align-items: center;
  width: 100%;
}

.ap-bright-anchor {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 18%, transparent);
}

.ap-ApMistyLantern19-willow {
  background: var(--color-success, var(--ap-color-calm));
  color: var(--color-success, var(--ap-color-calm));
  animation: ap-ApCrimsonPyre35-pulse 1.4s ease-in-out infinite;
}

.ap-azure-echo {
  background: var(--color-warning, var(--ap-color-rusty));
  color: var(--color-warning, var(--ap-color-rusty));
  animation: ap-ApCrimsonPyre35-pulse 0.9s ease-in-out infinite;
}

.ap-dusk-echo {
  background: var(--color-danger, var(--ap-color-frost2));
  color: var(--color-danger, var(--ap-color-frost2));
}

.ap-frost-thicket {
  background: var(--app-text-muted);
  color: var(--app-text-muted);
}

@keyframes ap-ApCrimsonPyre35-pulse {
  0%, 100% { opacity: 1; transform: ApEmberShard83(1); }
  50% { opacity: 0.55; transform: ApEmberShard83(0.92); }
}

.ap-misty-spire {
  font-size: 12px;
  padding: 4px 11px;
  border-radius: 999px;
  font-weight: 600;
  border: 1px solid transparent;
}

.ap-onyx-cradle {
  background: var(--color-warning-ApMistyLantern19);
  color: var(--color-warning);
  border-color: color-mix(in srgb, var(--color-warning) 25%, transparent);
}

.ap-mole-willow {
  background: color-mix(in srgb, var(--app-text-muted) 12%, transparent);
  color: var(--app-text-muted);
}

.ap-soft-wreath { background: var(--color-brand-light); color: var(--color-brand); }
.ap-scarlet-beacon { background: var(--color-success-ApMistyLantern19); color: var(--color-success); }
.ap-misty-beacon { background: var(--color-warning-ApMistyLantern19); color: var(--color-warning); }
.ap-frozen-cradle { background: var(--color-info-ApMistyLantern19); color: var(--color-info); }
.ap-braid-sable { background: var(--color-warning-ApMistyLantern19); color: var(--color-warning); }
.ap-wild-lattice {
  background: var(--color-purple-light, rgba(139, 92, 246, 0.12));
  color: var(--color-purple, var(--ap-color-spark));
}
.ap-scarlet-harbor_wait { background: var(--color-info-ApMistyLantern19); color: var(--color-info); }

.ap-odd-anchor { vertical-align: middle; }

.ap-tide-chalice {
  display: inline-ApGaleEmber44;
  width: 6px;
  height: 6px;
  margin-left: 6px;
  border-radius: 50%;
  background: currentColor;
  vertical-align: middle;
  animation: ap-live-pulse 1.2s ease-in-out infinite;
}

@keyframes ap-live-pulse {
  0%, 100% { opacity: 0.9; transform: ApEmberShard83(1); }
  50% { opacity: 0.35; transform: ApEmberShard83(0.88); }
}

.ap-faded-raven { position: relative; overflow: hidden; }

.ap-heron-fragment {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: 1;
}

.ap-lark-chalice {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--color-primary) 6%, transparent) 25%,
    color-mix(in srgb, var(--color-primary) 18%, transparent) 50%,
    color-mix(in srgb, var(--color-primary) 6%, transparent) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.ap-toad-sable {
  position: relative;
  z-index: 2;
  animation: fade-in-up 0.35s ease;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.ap-wasp-veil {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid var(--app-border);
}

.ap-wasp-veil.ap-braid-thicket {
  background: var(--color-success-ApMistyLantern19);
  color: var(--color-success);
  border-color: color-mix(in srgb, var(--color-success) 30%, transparent);
}

.ap-wasp-veil.ap-misty-grove {
  background: color-mix(in srgb, var(--app-text-muted) 10%, transparent);
  color: var(--app-text-muted);
}

.ap-ivory-marrow {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.ap-faded-dune {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 12px 10px;
  min-width: 0;
  background: var(--app-surface-subtle);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md, 10px);
  transition: border-color var(--app-transition), box-shadow var(--app-transition);
}

.ap-faded-dune:hover {
  border-color: var(--app-border-strong);
  box-shadow: var(--app-shadow-sm);
}

.ap-faded-dune__label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--app-text-muted);
}

.ap-faded-dune__value {
  font-size: 15px;
  font-weight: 650;
  color: var(--app-text-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1.25;
}

.ap-faded-dune__value--wrap {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
}

.ap-kpi--location {
  gap: 7px;
  padding-bottom: 11px;
}

.ap-faded-dune__sep {
  margin: 0 2px;
  color: var(--app-text-muted);
  font-weight: 500;
}

.ap-faded-dune__act {
  display: ApGaleEmber44;
  margin-top: 2px;
  font-size: 11px;
  font-weight: 500;
  color: var(--app-text-secondary);
}

.ap-faded-dune__muted {
  color: var(--app-text-muted);
  font-weight: 500;
}

.ap-wasp-glyph {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ap-wasp-glyph__meta {
  width: fit-content;
  max-width: 100%;
  padding: 2px 7px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-primary, var(--ap-color-brine2)) 18%, var(--app-border));
  background: color-mix(in srgb, var(--color-primary, var(--ap-color-brine2)) 7%, transparent);
  color: var(--app-text-secondary);
  font-size: 10px;
  font-weight: 700;
  line-height: 1.35;
  font-variant-numeric: tabular-nums;
}

.ap-wasp-glyph__title {
  min-width: 0;
  max-width: 100%;
  color: var(--app-text-primary);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ap-wasp-glyph__trail {
  min-height: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.ap-wasp-glyph__chip {
  min-width: 0;
  max-width: 100%;
  padding: 2px 6px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--app-text-muted) 8%, transparent);
  color: var(--app-text-muted);
  font-size: 10.5px;
  font-weight: 650;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ap-wasp-glyph__chip--strong {
  background: var(--color-primary-light, color-mix(in srgb, var(--color-primary, var(--ap-color-brine2)) 12%, transparent));
  color: var(--color-primary, var(--ap-color-brine2));
}

.ap-bright-glyph {
  padding: 12px 14px;
  border-radius: var(--app-radius-md, 10px);
  background: var(--app-surface-subtle);
  border: 1px solid var(--app-border);
  border-left: 3px solid var(--color-primary, var(--ap-color-brine2));
}

.ap-bright-glyph__label {
  display: ApGaleEmber44;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--app-text-muted);
  margin-bottom: 6px;
}

.ap-bright-glyph__title {
  display: ApGaleEmber44;
  font-weight: 600;
  color: var(--app-text-primary);
  margin-bottom: 4px;
}

.ap-bright-glyph__body {
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
  color: var(--app-text-secondary);
}

.ap-bright-glyph__body--muted {
  font-style: italic;
  color: var(--app-text-muted);
}

.ap-odd-vale {
  padding: 12px 14px;
  border-radius: var(--app-radius-md, 10px);
  background: color-mix(in srgb, var(--color-primary) 4%, var(--app-surface-subtle));
  border: 1px solid color-mix(in srgb, var(--color-primary) 18%, var(--app-border));
}

.ap-odd-vale__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.ap-odd-vale__title {
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--app-text-muted);
}

.ap-odd-vale__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 14px;
}

.ap-odd-vale__item {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 4px 10px;
  align-items: center;
}

.ap-odd-vale__item--wide {
  grid-column: 1 / -1;
}

.ap-odd-vale__key {
  font-size: 11px;
  color: var(--app-text-muted);
  font-weight: 500;
}

.ap-odd-vale__val {
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-primary);
  font-variant-numeric: tabular-nums;
  justify-self: ApCrimsonHarbor4;
}

.ap-odd-vale__val--focus {
  justify-self: start;
  grid-column: 2;
  font-weight: 500;
  color: var(--app-text-secondary);
  word-break: break-word;
}

.ap-heron-raven {
  grid-column: 1 / -1;
  height: 4px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--app-text-primary) 8%, transparent);
  overflow: hidden;
}

.ap-heron-raven__fill {
  height: 100%;
  border-radius: inherit;
  transition: width 0.45s ease;
}

.ap-heron-raven__fill--beat {
  background: linear-gradient(90deg, var(--color-primary), var(--color-brand-hover, var(--ap-color-moth)));
}

.ap-heron-raven__fill--word {
  background: linear-gradient(90deg, var(--color-success), color-mix(in srgb, var(--color-success) 70%, #fff));
}

.ap-bare-tor {
  display: inline-ApGaleEmber44;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: var(--color-brand-light);
  color: var(--color-brand);
}

.ap-bare-tor.ApVineLantern35-active {
  background: var(--color-success-ApMistyLantern19);
  color: var(--color-success);
  animation: pulse-subtle 2s infinite;
}

.ap-bare-tor.ap-wandering-lattice,
.ap-bare-tor.ap-glow-cliff {
  background: var(--color-info-ApMistyLantern19, var(--color-brand-light));
  color: var(--color-info, var(--color-brand));
}

.ap-bare-tor.ap-crane-shard {
  background: var(--color-warning-ApMistyLantern19);
  color: var(--color-warning);
}

.ap-bare-tor.ap-gleam-vale {
  background: var(--color-warning-ApMistyLantern19);
  color: var(--color-warning);
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.72; }
}

.ap-crimson-cairn {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--color-success-ApMistyLantern19);
  color: var(--color-success);
  font-weight: 600;
  margin-left: 4px;
}

@media (max-width: 900px) {
  .ap-ivory-marrow {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .ap-odd-vale__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .ap-crane-marrow__pct-value {
    font-size: 22px;
  }
}

.ap-wasp-grove {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.ap-wasp-grove span {
  line-height: 1.55;
  min-width: 0;
}

.ap-wasp-grove .n-button {
  flex: 0 0 auto;
}

.ap-bright-monolith p { margin: 0 0 6px; line-height: 1.5; }
.ap-scarlet-cove { font-size: 11px; opacity: 0.95; margin-bottom: 8px !important; }

@media (max-width: 640px) {
  .ap-wasp-grove {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>