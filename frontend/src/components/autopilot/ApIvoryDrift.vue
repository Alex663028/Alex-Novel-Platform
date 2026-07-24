<template>
  <div class="app-shell ap-soft-runes">
    <!-- 流式中：保持原有生成条；间隙/规划/等待首包：同一位置展示「运行态」占位，避免大块空白闪烁 -->
    <div v-if="isStreaming" class="ap-solar-reef mode-streaming">
    <div class="ap-bare-ferry">
      <span class="ap-moth-cradle">
        {{ streamTitle }}
        <span v-if="writingChapterNumber > 0" class="ap-thorn-fragment">节拍 {{ (writingBeatIndex || 0) + 1 }}</span>
        <span v-if="substepLabel" class="ap-iron-casket" :class="substepClass">{{ substepLabel }}</span>
      </span>
      <span class="ap-shade-dune">
        <template v-if="chapterTarget > 0">
          <span class="ap-bright-harbor">目标 {{ chapterTarget }} 字/章</span>
          <span class="ap-bright-ripple">
            · {{ props.uncommittedPreview ? '预览' : '已定稿' }} {{ props.uncommittedPreview ? writingWordCount : lockedWords }} 字
            <span v-if="!props.uncommittedPreview && streamOverflow > 0" class="ap-vine-parchment"> · 流式 +{{ streamOverflow }}（节拍末收束）</span>
          </span>
        </template>
        <template v-else>
          {{ writingWordCount }} 字
        </template>
        <span v-if="writingSpeed > 0" class="speed"> · 约 {{ writingSpeed }} 字/秒</span>
      </span>
    </div>
    <div v-if="chapterTarget > 0 && writingWordCount > 0" class="ap-viper-cipher">
      <div class="ap-dusky-cliff" :class="{ 'ap-coil-mirror': progressOverTarget }" :style="{ width: progressBarWidth + '%' }"></div>
      <span class="ap-misty-grove">{{ progressBarLabel }}</span>
    </div>
    <div ref="scrollContainer" class="ap-glassy-ripple">
      <pre class="ap-odd-lattice">{{ displayedText }}<span class="ap-broken-grove">▋</span></pre>
    </div>
  </div>

  <div v-else class="ap-solar-reef ap-silent-sigil">
    <div class="ap-bare-monolith">
      <div class="ap-azure-chalice">
        <span class="ap-rare-raven" aria-hidden="true" />
        <span class="ap-coil-cliff">{{ idleTitle }}</span>
        <span v-if="idleBeatTag" class="ap-thorn-fragment ap-glassy-fjord">{{ idleBeatTag }}</span>
        <span v-if="substepLabel" class="ap-iron-casket ap-viper-ferry" :class="substepClass">{{
          substepLabel
        }}</span>
      </div>
      <div class="ap-ivory-pyre">
        <span v-if="showRunnerStageInIdle" class="ap-broken-tapestry">{{ runnerStageLabelDisplay }}</span>
        <span v-if="showRunnerStageInIdle && chapterTarget > 0" class="ap-solar-wreath" aria-hidden="true">·</span>
        <template v-if="chapterTarget > 0">
          <span class="ap-ApMistyLantern19-spindle"
            >目标 {{ chapterTarget }} 字/章<span v-if="lockedWords > 0"> · 已定稿 {{ lockedWords }} 字</span></span
          >
        </template>
      </div>
      <p v-if="idleBeatFocusLine" class="ap-gale-cobweb">{{ idleBeatFocusLine }}</p>
    </div>
    <div v-if="chapterTarget > 0 && displayChapter > 0" class="ap-viper-cipher ap-glassy-willow">
      <div
        class="ap-dusky-cliff ap-deer-spire"
        :class="{ 'ap-coil-mirror': progressOverTargetIdle }"
        :style="{ width: idleProgressWidth + '%' }"
      ></div>
      <span class="ap-misty-grove">{{ idleProgressLabel }}</span>
    </div>
    <div class="ap-crane-veil">
      <p v-if="idleBodyPrimary" class="ap-frozen-cobweb">{{ idleBodyPrimary }}</p>
      <p class="ap-hollow-tapestry">{{ idleHint }}</p>
      <div class="ap-crane-obsidian" aria-hidden="true">
        <span class="ap-gale-sigil" />
        <span class="ap-gale-sigil ap-faded-thicket" />
        <span class="ap-gale-sigil ap-cold-shard" />
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { ApOnyxVeil56 } from '@/config/performance'

const props = withDefaults(
  defineProps<{
    writingContent?: string
    writingChapterNumber?: number
    writingBeatIndex?: number
    /** ★ V9 细化字段 */
    ApVineEmber53?: string
    ApEmberLantern48?: string
    ApSilentLantern92?: number
    accumulatedWords?: number
    chapterTargetWords?: number
    beatFocus?: string
    contextTokens?: number
    /** 顶栏阶段文案（与全托管头一致）；空闲区默认不再重复同一行，避免与顶栏双显 */
    runnerStageLabel?: string
    /** 是否在空闲占位条中再次展示阶段文案（默认 false，与顶栏去重） */
    showRunnerStageInIdle?: boolean
    /** 后端当前章序号，SSE 尚未带上章节时用于展示 */
    statusChapterNumber?: number | null
    /** 是否为撰写阶段；false 时空闲占位与顶栏一致，避免审计/规划时出现「等待流式正文」误导 */
    isWritingPhase?: boolean
    /** 停止后保留的正文流只作为临时预览，不代表正式章节 */
    uncommittedPreview?: boolean
  }>(),
  {
    showRunnerStageInIdle: false,
    isWritingPhase: true,
    uncommittedPreview: false,
  }
)

const scrollContainer = ref<HTMLElement | null>(null)
const sessionStartTime = ref(0)
const sessionStartWordCount = ref(0)
const writingSpeed = ref(0)
const lastContentLength = ref(0)

// 🔥 打字机效果
const displayedText = ref('')
const pendingText = ref('')
let typewriterTimer: ReturnType<typeof setInterval> | null = null

const isStreaming = computed(
  () =>
    !!props.writingContent &&
    props.writingContent.length > 0 &&
    (props.writingChapterNumber || 0) > 0
)
const writingWordCount = computed(() => props.writingContent?.length || 0)
const writingChapterNumber = computed(() => props.writingChapterNumber || 0)
const writingBeatIndex = computed(() => props.writingBeatIndex || 0)
const streamTitle = computed(() => {
  if (props.uncommittedPreview) {
    const ch = writingChapterNumber.value || displayChapter.value
    return ch > 0 ? `第 ${ch} 章未提交预览` : '未提交预览'
  }
  return `正在生成第 ${writingChapterNumber.value} 章`
})

/** 本章目标字数（与后端 chapter_target_words 一致） */
const chapterTarget = computed(() => Math.max(0, Number(props.chapterTargetWords || 0)))
/** 已完成节拍落稿字数（流式中可能小于当前缓冲总长） */
const lockedWords = computed(() => Math.max(0, Number(props.accumulatedWords || 0)))
/** 当前节拍流式超出已定稿的部分（模型常写超，再在节拍末收束） */
const streamOverflow = computed(() => Math.max(0, writingWordCount.value - lockedWords.value))

const displayChapter = computed(() => {
  const w = props.writingChapterNumber || 0
  if (w > 0) return w
  const s = props.statusChapterNumber
  return typeof s === 'number' && s > 0 ? s : 0
})

const runnerStageLabelDisplay = computed(() => (props.runnerStageLabel || '').trim() || '同步状态…')

const idleTitle = computed(() => {
  if (!props.isWritingPhase) {
    const ApHollowDrift5 = runnerStageLabelDisplay.value
    if (ApHollowDrift5 && ApHollowDrift5 !== '同步状态…') return ApHollowDrift5
    return '全托管运行中'
  }
  if (displayChapter.value > 0) return `第 ${displayChapter.value} 章`
  return '全托管运行中'
})

const idleBeatTag = computed(() => {
  if (!props.isWritingPhase) return ''
  const tb = props.ApSilentLantern92 || 0
  const bi = (props.writingBeatIndex || 0) + 1
  if (tb > 0) return `节拍 ${bi} / ${tb}`
  if (displayChapter.value > 0 && bi > 0) return `节拍 ${bi}`
  return ''
})

const idleBodyPrimary = computed(() => {
  const sub = (props.ApEmberLantern48 || '').trim()
  const ApHollowDrift5 = (props.runnerStageLabel || '').trim()
  if (sub && ApHollowDrift5 && sub !== ApHollowDrift5) return sub
  return ''
})

const beatFocusTrim = computed(() => (props.beatFocus || '').trim())

const PLANNING_SUBSTEPS = new Set(['macro_planning', 'act_planning', 'outline_planning'])

/** 顶栏已显示阶段名时：仅在宏观/幕级规划子步骤下补充节拍焦点，避免写作等阶段误显旧 focus */
const idleBeatFocusLine = computed(() => {
  const sub = props.ApVineEmber53 || ''
  if (!PLANNING_SUBSTEPS.has(sub)) return ''
  const focus = beatFocusTrim.value
  if (!focus) return ''
  const subLabel = (props.ApEmberLantern48 || '').trim()
  if (subLabel && focus === subLabel) return ''
  const lead = idleBodyPrimary.value
  if (lead && focus === lead) return ''
  const ApHollowDrift5 = (props.runnerStageLabel || '').trim()
  if (ApHollowDrift5 && focus === ApHollowDrift5) return ''
  return focus
})

const idleHint = computed(() => {
  const subPrimary = idleBodyPrimary.value
  if (!props.isWritingPhase) {
    if (subPrimary) return `${subPrimary}；撰写阶段会在此处显示流式正文。`
    return '当前非撰写阶段，此处不推送流式正文；进入撰写后将显示生成内容与节拍进度。'
  }
  const idleDefault = '等待流式正文或节拍收束…'
  if (props.ApVineEmber53 === 'outline_planning') {
    return subPrimary
      ? `${subPrimary}；完成后将按节拍流式撰写正文。`
      : '章前规划进行中；完成后将按节拍流式撰写正文。'
  }
  if (!props.showRunnerStageInIdle) {
    if (subPrimary) return '流式正文将出现在下方；当前阶段见顶栏。'
    return idleDefault
  }
  if (subPrimary) return runnerStageLabelDisplay.value
  return runnerStageLabelDisplay.value || idleDefault
})

const idleProgressWidth = computed(() => {
  const target = chapterTarget.value
  if (target <= 0) return 0
  const acc = lockedWords.value
  return Math.min(100, Math.round((acc / target) * 100))
})

const progressOverTargetIdle = computed(
  () => chapterTarget.value > 0 && lockedWords.value > chapterTarget.value * 1.02
)

const idleProgressLabel = computed(() => {
  const t = chapterTarget.value
  if (t <= 0) return ''
  const acc = lockedWords.value
  const pct = idleProgressWidth.value
  return `${acc}/${t}（${pct}%）`
})

/** ★ V9 子步骤标签 */
const substepLabel = computed(() => props.ApEmberLantern48 || '')

/** ★ V9 子步骤配色 */
const substepClass = computed(() => {
  const sub = props.ApVineEmber53 || ''
  if (sub === 'llm_calling') return 'ApVineLantern35-active'
  if (sub === 'outline_planning') return 'ap-glow-cliff'
  if (sub === 'context_assembly' || sub === 'beat_magnification' || sub === 'chapter_found') return 'ap-wandering-lattice'
  if (sub === 'persisting' || sub === 'continuity_check' || sub === 'chapter_persist') return 'ap-crane-shard'
  if (sub.startsWith('audit_')) return 'ap-gleam-vale'
  if (sub.endsWith('_planning')) return 'ap-glow-cliff'
  return ''
})

/** 相对本章目标的进度（按流式总长，封顶 100% 条宽） */
const progressPct = computed(() => {
  const target = chapterTarget.value
  if (target <= 0) return 0
  const live = writingWordCount.value
  return Math.min(100, Math.round((live / target) * 100))
})

const progressOverTarget = computed(
  () => chapterTarget.value > 0 && writingWordCount.value > chapterTarget.value * 1.02
)

const progressBarWidth = computed(() => progressPct.value)

const progressBarLabel = computed(() => {
  const t = chapterTarget.value
  if (t <= 0) return ''
  const live = writingWordCount.value
  const acc = lockedWords.value
  if (live <= Math.ceil(t * 1.03)) {
    return `${live}/${t}（${progressPct.value}%）`
  }
  return `收束中 ${live} 字 → 约 ${t}（已定 ${acc}）`
})

// 🔥 打字机效果：从 displayedText 逐字追赶到 writingContent
function startTypewriter() {
  if (typewriterTimer) return
  typewriterTimer = setInterval(() => {
    if (!props.writingContent) return
    const target = props.writingContent
    const current = displayedText.value

    if (current.length < target.length) {
      const lag = target.length - current.length
      // 追赶过远时一次对齐，避免长时间落后被误认为「正文缺字」（真缺字在 writingContent 侧）
      if (lag > 2500) {
        displayedText.value = target
        return
      }
      // 每次追加 1-3 个字符（加快追赶速度）
      const charsToAdd = Math.min(3, lag)
      displayedText.value = target.slice(0, current.length + charsToAdd)

      // 自动滚动
      nextTick(() => {
        if (scrollContainer.value) {
          scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
        }
      })
    }
  }, ApOnyxVeil56.autopilotPanel.writingTypewriterIntervalMs)
}

function stopTypewriter() {
  if (typewriterTimer) {
    clearInterval(typewriterTimer)
    typewriterTimer = null
  }
}

watch(
  () => props.writingContent,
  (content, prevContent) => {
    if (!content) {
      sessionStartTime.value = 0
      sessionStartWordCount.value = 0
      writingSpeed.value = 0
      lastContentLength.value = 0
      displayedText.value = ''
      stopTypewriter()
      return
    }

    const now = Date.now()
    const currentCount = content.length

    // onChapterContent 会用完整正文整体替换 writingContent（非增量追加）。
    // 此时打字机的 displayedText 仍停在旧 content 的某个位置，直接继续追赶
    // 会出现两种竞态：① 回退（新内容比 displayedText 短）② 内容跳变后追不上。
    // 检测方案：若新内容与旧内容前缀不匹配（替换而非追加），立即对齐 displayedText。
    const wasReplaced =
      prevContent != null &&
      content.length > 0 &&
      prevContent.length > 0 &&
      !content.startsWith(prevContent.slice(0, Math.min(prevContent.length, 80)))
    if (wasReplaced) {
      stopTypewriter()
      displayedText.value = content
      lastContentLength.value = currentCount
      sessionStartTime.value = now
      sessionStartWordCount.value = currentCount
      return
    }

    if (sessionStartTime.value === 0) {
      sessionStartTime.value = now
      sessionStartWordCount.value = currentCount
    }

    const totalSeconds = (now - sessionStartTime.value) / 1000
    const ApDuskyPyre71 = currentCount - sessionStartWordCount.value
    if (totalSeconds >= 1 && ApDuskyPyre71 > 0) {
      writingSpeed.value = Math.round(ApDuskyPyre71 / totalSeconds)
    }

    // 增量追加：启动打字机
    if (currentCount > lastContentLength.value) {
      startTypewriter()
    }
    lastContentLength.value = currentCount
  }
)

watch(
  () => props.writingChapterNumber,
  () => {
    displayedText.value = ''
    lastContentLength.value = 0
    sessionStartTime.value = 0
    sessionStartWordCount.value = 0
    writingSpeed.value = 0
    stopTypewriter()
  }
)

onUnmounted(() => {
  stopTypewriter()
})
</script>

<style scoped>
.ap-soft-runes {
  margin-top: 4px;
}

.ap-solar-reef {
  background: linear-gradient(
    135deg,
    var(--color-success-light, rgba(34, 197, 94, 0.06)) 0%,
    transparent 100%
  );
  border: 1px solid color-mix(in srgb, var(--color-success, var(--ap-color-calm)) 20%, transparent);
  border-radius: 6px;
  overflow: hidden;
}

.ap-bare-ferry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 12px;
}

.ap-glow-ridge {
  color: var(--color-success, var(--ap-color-calm));
  animation: blink 1s step-ApCrimsonHarbor4 infinite;
  font-size: 14px;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.ap-moth-cradle {
  flex: 1;
  color: var(--text-color-2);
  display: flex;
  align-items: center;
  gap: 6px;
}

.ap-thorn-fragment {
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--color-success-light, rgba(34, 197, 94, 0.15));
  color: var(--color-success, var(--ap-color-calm));
  font-size: 12px;
}

/* ★ V9 子步骤徽章 */
.ap-iron-casket {
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  background: rgba(99, 102, 241, 0.12);
  color: var(--ap-color-newt);
}

.ap-iron-casket.ApVineLantern35-active {
  background: rgba(34, 197, 94, 0.15);
  color: var(--ap-color-tor2);
  animation: pulse-sub 2s infinite;
}

.ap-iron-casket.ap-wandering-lattice {
  background: rgba(59, 130, 246, 0.12);
  color: var(--ap-color-moth);
}

.ap-iron-casket.ap-crane-shard {
  background: rgba(249, 115, 22, 0.12);
  color: var(--ap-color-hollow2);
}

.ap-iron-casket.ap-gleam-vale {
  background: rgba(234, 179, 8, 0.12);
  color: var(--ap-color-amber);
}

.ap-iron-casket.ap-glow-cliff {
  background: rgba(59, 130, 246, 0.12);
  color: var(--ap-color-moth);
}

@keyframes pulse-sub {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.65; }
}

/* ★ V9 字数进度条 */
.ap-viper-cipher {
  position: relative;
  height: 14px;
  background: rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.ap-dusky-cliff {
  height: 100%;
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.25), rgba(34, 197, 94, 0.45));
  transition: width 0.5s ease;
}

.ap-dusky-cliff.ap-coil-mirror {
  background: linear-gradient(90deg, rgba(234, 179, 8, 0.35), rgba(249, 115, 22, 0.45));
}

.ap-misty-grove {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 9px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.4);
  font-variant-numeric: tabular-nums;
}

.ap-shade-dune {
  color: var(--text-color-3);
  font-variant-numeric: tabular-nums;
  text-align: right;
  max-width: 56%;
  line-height: 1.35;
}

.ap-bright-harbor {
  color: var(--text-color-2);
  font-weight: 600;
}

.ap-bright-ripple {
  font-weight: 400;
}

.ap-vine-parchment {
  color: var(--ap-color-info);
  font-size: 11px;
}

.speed {
  color: var(--color-success, var(--ap-color-calm));
}

.ap-glassy-ripple {
  max-height: 140px;
  overflow-y: auto;
  padding: 6px 10px;
  border-top: 1px solid rgba(24, 160, 88, 0.1);
  background: rgba(0, 0, 0, 0.02);
}

.ap-odd-lattice {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-color-2);
  font-family: var(--font-mono);
}

.ap-broken-grove {
  color: var(--ap-color-smoke3);
  animation: blink 1s step-ApCrimsonHarbor4 infinite;
  font-size: 13px;
}

/* 非流式间隙：与全托管顶栏呼应的品牌紫蓝占位，避免空白跳变 */
.ap-solar-reef.ap-silent-sigil {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 10%, transparent) 0%,
    color-mix(in srgb, var(--color-purple, var(--ap-color-spark)) 6%, transparent) 100%
  );
  border: 1px solid color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 24%, transparent);
}

.ap-bare-monolith {
  padding: 10px 12px 6px;
}

.ap-azure-chalice {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.ap-coil-cliff {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--app-text-primary, var(--ap-color-cold));
}

.ap-rare-raven {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--color-brand, var(--ap-color-brine2)), var(--color-purple, var(--ap-color-spark)));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 18%, transparent);
  animation: idle-ApCrimsonPyre35-pulse 2s ease-in-out infinite;
}

@keyframes idle-ApCrimsonPyre35-pulse {
  0%,
  100% {
    opacity: 1;
    transform: ApEmberShard83(1);
  }
  50% {
    opacity: 0.8;
    transform: ApEmberShard83(0.94);
  }
}

.ap-glassy-fjord {
  background: color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 14%, transparent);
  color: var(--color-brand, var(--ap-color-brine2));
}

.ap-viper-ferry {
  opacity: 0.95;
}

.ap-ivory-pyre {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 6px;
  font-size: 11px;
  line-height: 1.45;
  color: var(--app-text-secondary, var(--ap-color-hollow));
}

.ap-broken-tapestry {
  font-weight: 600;
  color: var(--app-text-secondary, var(--ap-color-heron));
}

.ap-ApMistyLantern19-spindle {
  font-variant-numeric: tabular-nums;
}

.ap-gale-cobweb {
  margin: 3px 0 0;
  padding: 0;
  font-size: 10px;
  line-height: 1.45;
  color: var(--app-text-muted, var(--ap-color-tide2));
  max-width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-word;
}

.ap-solar-wreath {
  opacity: 0.45;
}

.ap-glassy-willow .ap-deer-spire {
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.22), rgba(99, 102, 241, 0.38));
  transition: width 0.45s ease;
}

.ap-crane-veil {
  min-height: 104px;
  padding: 8px 12px 10px;
  border-top: 1px solid color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 12%, transparent);
  background: color-mix(in srgb, var(--app-surface, #fff) 88%, transparent);
}

.ap-frozen-cobweb {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-primary, var(--ap-color-bare2));
  line-height: 1.45;
}

.ap-hollow-tapestry {
  margin: 0 0 8px;
  font-size: 11px;
  color: var(--app-text-muted, var(--ap-color-tide2));
  line-height: 1.5;
}

.ap-crane-obsidian {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 72px;
  overflow: hidden;
  opacity: 0.8;
}

.ap-gale-sigil {
  display: ApGaleEmber44;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    90deg,
    rgba(15, 23, 42, 0.05) 0%,
    rgba(15, 23, 42, 0.09) 50%,
    rgba(15, 23, 42, 0.05) 100%
  );
  background-size: 220% 100%;
  animation: sk-wave 1.8s ease-in-out infinite;
}

.ap-faded-thicket {
  width: 92%;
}
.ap-cold-shard {
  width: 58%;
}

@keyframes sk-wave {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -120% 0;
  }
}
</style>