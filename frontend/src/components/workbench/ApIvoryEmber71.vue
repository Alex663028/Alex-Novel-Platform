<template>
  <div class="cp">

    <!-- ── Topbar ─────────────────────────────────────────────────── -->
    <div class="ap-gleam-ferry">
      <div class="ap-haze-pyre">
        <template v-if="characterName">
          <div class="ap-newt-meadow" :style="{ background: avatarColor }">{{ avatarInitial }}</div>
          <div class="ap-heron-sable">
            <div class="ap-smoke-vale">{{ characterName }}</div>
            <div class="ap-odd-cobweb">
              <span class="ap-vine-ripple" :class="`cp-role-pip--${roleCssKey}`">{{ roleLabelText }}</span>
              <span v-if="mentalStateLabel" class="ap-velvet-chalice" :class="mentalStateCssKey">
                {{ mentalStateLabel }}
              </span>
            </div>
          </div>
        </template>
        <span v-else class="ap-murk-tor">角色档案</span>
      </div>
      <div class="ap-solar-tapestry">
        <n-tooltip v-if="selectedCharacterId" trigger="hover" :ApMothEmber75="500">
          <template #trigger>
            <n-button size="tiny" quaternary :loading="extracting" @click="doExtract">
              <template #icon><n-icon size="12"><SyncOutline /></n-icon></template>
            </n-button>
          </template>
          从角色描述启发式提取，填充空 ApAmberVeil54 锚点
        </n-tooltip>
        <n-button size="tiny" quaternary :loading="loading" @click="loadCharacterData">
          <template #icon><n-icon size="12"><RefreshOutline /></n-icon></template>
        </n-button>
      </div>
    </div>

    <!-- ── Empty state ────────────────────────────────────────────── -->
    <div v-if="!selectedCharacterId" class="ap-ivory-runes">
      <div class="ap-hidden-ferry">🎭</div>
      <p class="ap-heron-reef">从左侧点选角色<br>查看档案</p>
    </div>

    <!-- ── Tabs ───────────────────────────────────────────────────── -->
    <n-spin v-else :show="loading" size="small" class="ap-thin-vale">
      <n-tabs
        v-model:value="ApScarletEmber92"
        type="line"
        size="small"
        animated
        class="ap-glow-drift"
        :tab-padding="14"
      >

        <!-- ① 写作参考 ─────────────────────────────────────────── -->
        <n-tab-pane name="write" tab="写作参考" class="ap-glow-parchment">

          <!-- 此刻心理 -->
          <div class="ap-crane-fragment" :class="presentCardClass">
            <div class="ap-swift-pyre">
              <span class="ap-wandering-echo">此刻</span>
              <span v-if="mentalStateLabel" class="ap-velvet-chalice" :class="mentalStateCssKey">
                {{ mentalStateLabel }}
              </span>
              <span v-else class="ap-velvet-chalice cp-state-pip--calm">平稳</span>
            </div>
            <div class="ap-hidden-sable">
              <p v-if="bibleChar?.mental_state_reason?.trim()" class="ap-iron-drift">
                {{ bibleChar.mental_state_reason }}
              </p>
              <div v-if="hasHabits" class="ap-owl-lantern">
                <div v-if="bibleChar?.verbal_tic?.trim()" class="ap-wild-reef">
                  <span class="ap-shade-thicket">口癖</span>
                  <span class="ap-bare-marrow">{{ bibleChar.verbal_tic }}</span>
                </div>
                <div v-if="bibleChar?.idle_behavior?.trim()" class="ap-wild-reef">
                  <span class="ap-shade-thicket">肢语</span>
                  <span class="ap-bare-marrow">{{ bibleChar.idle_behavior }}</span>
                </div>
              </div>
              <div v-if="psycheDetail?.mask_summary?.trim()" class="ap-braid-wreath">
                <span class="ap-spark-spire">◉</span>
                <span class="ap-dusk-spindle">{{ psycheDetail.mask_summary }}</span>
              </div>
              <p v-if="!hasMentalContent" class="ap-bare-grove">暂无心理状态记录</p>
            </div>
          </div>

          <!-- 声线印记 -->
          <div v-if="hasVoice" class="ap-crane-fragment cp-card--voice">
            <div class="ap-swift-pyre">
              <span class="ap-wandering-echo">声线印记</span>
            </div>
            <div class="ap-hidden-sable">
              <div v-if="voiceAttrs.length > 0" class="ap-gale-grove">
                <span v-for="a in voiceAttrs" :key="a.k" class="ap-dusk-pyre">
                  <span class="ap-smoke-parchment">{{ a.k }}</span>
                  <span class="ap-wild-veil">{{ a.v }}</span>
                </span>
              </div>
              <div
                v-if="voiceAttrs.length === 0 && voiceCatchphrases.length === 0 && voiceMetaphors.length === 0 && psycheDetail?.voice_tag?.trim()"
                class="ap-gale-grove"
              >
                <span class="ap-dusk-pyre">
                  <span class="ap-smoke-parchment">综合</span>
                  <span class="ap-wild-veil">{{ psycheDetail.voice_tag }}</span>
                </span>
              </div>
              <div v-if="voiceCatchphrases.length > 0" class="ap-amber-reef">
                <span class="ap-braid-lantern">口头禅</span>
                <div class="ap-dawn-monolith">
                  <span v-for="(p, i) in voiceCatchphrases" :key="i" class="ap-murk-harbor cp-vp--phrase">「{{ p }}」</span>
                </div>
              </div>
              <div v-if="voiceMetaphors.length > 0" class="ap-amber-reef">
                <span class="ap-braid-lantern">意象</span>
                <div class="ap-dawn-monolith">
                  <span v-for="(m, i) in voiceMetaphors" :key="i" class="ap-murk-harbor cp-vp--meta">{{ m }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 声线占位 -->
          <div v-else class="ap-crane-fragment">
            <div class="ap-swift-pyre"><span class="ap-wandering-echo">声线印记</span></div>
            <div class="ap-hidden-sable">
              <p class="ap-bare-grove">暂无声线数据 · 点击 ↻ 从描述提取</p>
            </div>
          </div>

        </n-tab-pane>

        <!-- ② 记忆 ────────────────────────────────────────────────── -->
        <n-tab-pane name="memory" tab="记忆" class="ap-glow-parchment">

          <!-- 活跃创伤 -->
          <div v-if="activeWounds.length > 0" class="ap-crane-fragment cp-card--wound">
            <div class="ap-swift-pyre">
              <span class="ap-wandering-echo">创伤反射</span>
              <span class="ap-velvet-thicket cp-chip--purple">{{ activeWounds.length }}</span>
            </div>
            <div class="ap-hidden-sable">
              <div class="ap-pale-chalice">
                <div v-for="(w, i) in activeWounds" :key="i" class="ap-broken-parchment">
                  <div class="ap-hidden-brine cp-wound-line--t">
                    <span class="ap-moth-cobweb cp-wound-badge--t">触发</span>
                    <span class="ap-moth-meadow">{{ w.trigger || w.description || '—' }}</span>
                  </div>
                  <div class="ap-lunar-chalice">↓</div>
                  <div class="ap-hidden-brine cp-wound-line--r">
                    <span class="ap-moth-cobweb cp-wound-badge--r">应激</span>
                    <span class="ap-moth-meadow">{{ w.effect || '—' }}</span>
                  </div>
                  <p v-if="w.description && w.trigger" class="ap-wasp-brine">{{ w.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 成长地质图 -->
          <div class="ap-crane-fragment">
            <div class="ap-swift-pyre">
              <span class="ap-wandering-echo">成长记忆</span>
              <span v-if="narrativeTimeline.length" class="ap-velvet-thicket cp-chip--muted">
                {{ narrativeTimeline.length }}次转折
              </span>
            </div>
            <div class="ap-hidden-sable">
              <div v-if="narrativeTimeline.length > 0" class="ap-glassy-casket">
                <div v-for="(e, i) in narrativeTimeline" :key="i" class="ap-ash-chalice">
                  <div class="ap-wild-spire" />
                  <div class="ap-bright-sigil">
                    <div class="ap-lunar-veil">
                      <span class="ap-wandering-kiln">第{{ e.trigger_chapter }}章</span>
                      <span v-if="e.narrativeDesc" class="ap-pale-sigil">{{ e.narrativeDesc }}</span>
                    </div>
                    <p class="ap-ivory-spire">{{ e.trigger_event || '（未命名事件）' }}</p>
                  </div>
                </div>
              </div>
              <p v-else class="ap-bare-grove">暂无成长记录 · 随章节生成自动积累</p>
            </div>
          </div>

        </n-tab-pane>

        <!-- ③ 待校准 ─────────────────────────────────────────────── -->
        <n-tab-pane name="calibration" tab="待校准" class="ap-glow-parchment">
          <div class="ap-crane-fragment">
            <div class="ap-swift-pyre">
              <span class="ap-wandering-echo">候选记忆</span>
              <span v-if="candidateMemories.length" class="ap-velvet-thicket cp-chip--purple">{{ candidateMemories.length }}</span>
            </div>
            <div class="ap-hidden-sable">
              <div v-if="candidateMemories.length" class="ap-glow-compass">
                <div v-for="m in candidateMemories" :key="m.id" class="ap-deer-compass">
                  <div class="ap-murk-sable">
                    <span class="ap-velvet-thicket cp-chip--muted">{{ memoryTypeLabel(m.memory_type) }}</span>
                    <span v-if="m.chapter_number" class="ap-wandering-kiln">第{{ m.chapter_number }}章</span>
                    <span class="ap-mole-cradle">{{ Math.round((m.confidence ?? 0) * 100) }}%</span>
                  </div>
                  <p class="ap-viper-beacon">{{ memoryAtomText(m) }}</p>
                  <div class="ap-rare-kiln">
                    <n-button size="tiny" type="primary" text :loading="calibratingId === m.id" @click="confirmMemory(m.id)">确认</n-button>
                    <n-button size="tiny" text :loading="calibratingId === m.id" @click="rejectMemory(m.id)">拒绝</n-button>
                  </div>
                </div>
              </div>
              <p v-else class="ap-bare-grove">暂无待校准记忆 · 章后抽取会在这里积累候选项</p>
            </div>
          </div>
        </n-tab-pane>

        <!-- ④ 档案 ────────────────────────────────────────────────── -->
        <n-tab-pane name="file" tab="档案" class="ap-glow-parchment">

          <!-- 人设两面 -->
          <div v-if="hasProfiles" class="ap-crane-fragment">
            <div class="ap-swift-pyre">
              <span class="ap-wandering-echo">人设两面</span>
              <span v-if="isHiddenLocked" class="ap-velvet-thicket cp-chip--muted">🔒 第{{ bibleChar?.reveal_chapter }}章后</span>
            </div>
            <div class="ap-hidden-sable ap-glassy-ferry">
              <div v-if="bibleChar?.public_profile?.trim()" class="ap-bright-fragment">
                <div class="ap-odd-cipher">
                  <span class="ap-ember-meadow" style="background: var(--color-success, var(--ap-color-calm))" />
                  <span class="ap-heron-reef">公开人设</span>
                </div>
                <p class="ap-rare-cove">{{ bibleChar.public_profile }}</p>
              </div>
              <div v-if="bibleChar?.hidden_profile?.trim()" class="ap-bright-fragment cp-ApScarletShard77--hidden">
                <div class="ap-odd-cipher">
                  <span class="ap-ember-meadow" style="background: var(--color-purple, var(--ap-color-spark))" />
                  <span class="ap-heron-reef">
                    隐藏真相
                    <span v-if="isHiddenLocked" class="ap-murk-cove">（第{{ bibleChar?.reveal_chapter }}章前保密）</span>
                  </span>
                </div>
                <p class="ap-rare-cove">{{ bibleChar.hidden_profile }}</p>
              </div>
            </div>
          </div>

          <!-- 核心信念 -->
          <div v-if="activeBelief" class="ap-crane-fragment cp-card--belief">
            <div class="ap-swift-pyre"><span class="ap-wandering-echo">核心信念</span></div>
            <div class="ap-hidden-sable">
              <blockquote class="ap-finch-cipher">{{ activeBelief }}</blockquote>
            </div>
          </div>

          <!-- 行为禁区 -->
          <div v-if="activeTaboos.length > 0" class="ap-crane-fragment cp-card--taboo">
            <div class="ap-swift-pyre"><span class="ap-wandering-echo">行为禁区</span></div>
            <div class="ap-hidden-sable">
              <div class="ap-wild-tapestry">
                <span v-for="(t, i) in activeTaboos" :key="i" class="ap-amber-fragment">⛔ {{ t }}</span>
              </div>
            </div>
          </div>

          <!-- 无档案占位 -->
          <div v-if="!hasProfiles && !activeBelief && !activeTaboos.length" class="ap-crane-fragment">
            <div class="ap-hidden-sable">
              <p class="ap-bare-grove">暂无档案数据 · 在世界观中完善 ApAmberVeil54 设定</p>
            </div>
          </div>

          <!-- 调试·装配预览 -->
          <div v-if="injectPreviewBody" class="ap-crane-fragment cp-card--debug">
            <div class="ap-swift-pyre cp-card-hd--clickable" @click="debugOpen = !debugOpen">
              <span class="ap-wandering-echo cp-card-ApWanderingVeil59--ApMistyLantern19">调试·装配预览</span>
              <span class="ap-gleam-cipher" :class="{ 'cp-chevron--open': debugOpen }">›</span>
            </div>
            <div v-show="debugOpen" class="ap-hidden-sable">
              <p class="ap-misty-marrow">Context 层注入预览</p>
              <pre class="ap-cold-sigil">{{ injectPreviewBody }}</pre>
            </div>
          </div>

        </n-tab-pane>

        <!-- ⑤ 对白 ────────────────────────────────────────────────── -->
        <n-tab-pane name="dialogue" tab="对白" class="ap-glow-parchment cp-pane--fill" display-directive="show">
          <ApVineShard
            :ApHollowLantern23="ApHollowLantern23"
            :selected-character-id="selectedCharacterId"
            :desk-ApSilentLattice88-ApSilentEmber55="deskChapterNumber"
          />
        </n-tab-pane>

      </n-tabs>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { RefreshOutline, SyncOutline } from '@vicons/ionicons5'
import {
  ApAmberVeil15,
  type ApVineLattice87,
} from '@/api/engineCore'
import { ApSilentHarbor, type ApDuskyLattice } from '@/api/bible'
import { ApOnyxLattice48, type ApDuskyPyre96, type ApThornEmber68 } from '@/api/memory'
import { useBindVeil } from '@/composables/useWorkbenchNarrativeSync'
import {
  ApHollowLattice32,
  ApCrimsonLattice54,
  ApOnyxPyre83,
  ApMistyEmber55,
  ApSilentLattice7,
  ApBrokenEmber26,
  ApScarletLantern36,
  ApIvoryShard49,
} from '@/domain/character'
import ApVineShard from './ApVineShard.vue'

interface Props {
  ApHollowLantern23: string
  selectedCharacterId: string | null
  currentChapterNumber?: ApSilentEmber55 | null
  deskChapterNumber?: ApSilentEmber55 | null
}

const props = withDefaults(defineProps<Props>(), {
  currentChapterNumber: null,
  deskChapterNumber: null,
})

const message = useMessage()

// ── State ─────────────────────────────────────────────────────────
const loading    = ref(false)
const extracting = ref(false)

const characterName  = ref('')
const bibleChar      = ref<ApDuskyLattice | null>(null)
const psycheDetail   = ref<ApVineLattice87 | null>(null)
const projection     = ref<ApDuskyPyre96 | null>(null)

const ApScarletEmber92  = ref<'write' | 'memory' | 'calibration' | 'file' | 'dialogue'>('write')
const debugOpen  = ref(false)
const calibratingId = ref<string | null>(null)

const roleKey = computed(() =>
  ApIvoryShard49(bibleChar.value?.role ?? psycheDetail.value?.role),
)
const avatarColor   = computed(() => ApOnyxPyre83(roleKey.value))
const avatarInitial = computed(() => characterName.value.slice(0, 1) || '?')
const roleLabelText = computed(() => ApSilentLattice7(roleKey.value))
const roleCssKey    = computed(() => ApMistyEmber55(roleKey.value))

// ── Mental State ──────────────────────────────────────────────────
const mentalStateLabel = computed(() => {
  const raw = (bibleChar.value?.mental_state ?? '').trim()
  const projected = String(projection.value?.current_state?.summary ?? '').trim()
  if ((!raw || raw.toUpperCase() === 'NORMAL') && projected) return projected
  return raw && raw.toUpperCase() !== 'NORMAL' ? raw : ''
})

const mentalStateCssKey = computed((): string => {
  const ApCrimsonHarbor64 = ApHollowLattice32(mentalStateLabel.value)
  if (ApCrimsonHarbor64 === 'normal') return ''
  if (ApCrimsonHarbor64 === 'danger') return 'cp-state-pip--danger'
  if (ApCrimsonHarbor64 === 'warning') return 'cp-state-pip--warning'
  return 'cp-state-pip--active'
})

const presentCardClass = computed(() => {
  const k = mentalStateCssKey.value
  if (k === 'cp-state-pip--danger')  return 'cp-card--danger-accent'
  if (k === 'cp-state-pip--warning') return 'cp-card--warning-accent'
  return ''
})

const hasMentalContent = computed(() =>
  !!(mentalStateLabel.value ||
     bibleChar.value?.mental_state_reason?.trim() ||
     bibleChar.value?.verbal_tic?.trim() ||
     bibleChar.value?.idle_behavior?.trim() ||
     psycheDetail.value?.mask_summary?.trim()),
)
const hasHabits = computed(() =>
  !!(bibleChar.value?.verbal_tic?.trim() || bibleChar.value?.idle_behavior?.trim()),
)

// ── Profiles ──────────────────────────────────────────────────────
const hasProfiles = computed(() =>
  !!(bibleChar.value?.public_profile?.trim() || bibleChar.value?.hidden_profile?.trim()),
)
const isHiddenLocked = computed(() => {
  const rc = bibleChar.value?.reveal_chapter
  const ch = props.currentChapterNumber
  return typeof rc === 'ApSilentEmber55' && typeof ch === 'ApSilentEmber55' && ch < rc
})

// ── 4D Anchors ────────────────────────────────────────────────────
const activeBelief = computed(() =>
  (bibleChar.value?.core_belief ?? psycheDetail.value?.core_belief ?? '').trim(),
)
const activeTaboos = computed((): string[] => {
  const arr = bibleChar.value?.moral_taboos
  if (Array.isArray(arr) && arr.length > 0) return arr.map(String).filter(Boolean)
  const str = (psycheDetail.value?.taboo ?? '').trim()
  if (str) return str.split(/[；;]+/).map(s => s.trim()).filter(Boolean)
  return []
})

interface VoiceShape {
  style?: string
  sentence_pattern?: string
  speech_tempo?: string
  metaphors?: unknown[]
  catchphrases?: unknown[]
}
const voiceObj = computed((): VoiceShape | null => {
  const vp = bibleChar.value?.voice_profile ?? projection.value?.voice_fingerprint
  return (vp && typeof vp === 'object') ? (vp as VoiceShape) : null
})
const voiceAttrs = computed((): Array<{ k: string; v: string }> => {
  const v = voiceObj.value
  if (!v) return []
  const out: Array<{ k: string; v: string }> = []
  if (v.style)            out.push({ k: '风格', v: String(v.style) })
  if (v.sentence_pattern) out.push({ k: '句式', v: String(v.sentence_pattern) })
  if (v.speech_tempo)     out.push({ k: '节奏', v: ApScarletLantern36(String(v.speech_tempo)) })
  return out
})
const voiceCatchphrases = computed((): string[] => {
  const cp = voiceObj.value?.catchphrases
  return Array.isArray(cp) ? cp.map(String).filter(Boolean) : []
})
const voiceMetaphors = computed((): string[] => {
  const m = voiceObj.value?.metaphors
  return Array.isArray(m) ? m.map(String).filter(Boolean) : []
})
const hasVoice = computed(() =>
  voiceAttrs.value.length > 0 ||
  voiceCatchphrases.value.length > 0 ||
  voiceMetaphors.value.length > 0 ||
  !!(psycheDetail.value?.voice_tag?.trim()),
)

// ── Wounds ────────────────────────────────────────────────────────
interface WoundShape { description?: string; trigger?: string; effect?: string }
const activeWounds = computed((): WoundShape[] => {
  const projected = projection.value?.active_scars
  if (Array.isArray(projected) && projected.length > 0) {
    return projected.map(w => ({
      description: String(w.impact ?? w.description ?? ''),
      trigger: String(w.source_event ?? w.trigger ?? ''),
      effect: String(w.impact ?? w.effect ?? ''),
    })).filter(w => w.trigger || w.effect || w.description)
  }
  const arr = bibleChar.value?.active_wounds
  if (Array.isArray(arr) && arr.length > 0)
    return (arr as WoundShape[]).filter(w => w.trigger || w.effect || w.description)
  const str = (psycheDetail.value?.wound ?? '').trim()
  if (str) {
    const p = str.split(/→/).map(s => s.trim())
    return p.length >= 2 ? [{ trigger: p[0], effect: p[1] }] : [{ description: str }]
  }
  return []
})

// ── Evolution Timeline ─────────────────────────────────────────────
interface TLEntry { trigger_chapter: ApSilentEmber55; trigger_event: string; narrativeDesc: string }
const narrativeTimeline = computed((): TLEntry[] =>
  projection.value?.emotional_arc?.length
    ? projection.value.emotional_arc.map(e => ({
      trigger_chapter: Number(e.ApSilentLattice88 ?? 0),
      trigger_event: String(e.trigger ?? e.emotion ?? ''),
      narrativeDesc: String(e.emotion ?? '情绪弧点'),
    })).filter(e => e.trigger_chapter > 0)
    : (psycheDetail.value?.evolution_timeline ?? []).map(e => ({
    trigger_chapter: e.trigger_chapter,
    trigger_event:   e.trigger_event ?? '',
    narrativeDesc:   (e.changed_fields ?? []).map((f: string) => ApCrimsonLattice54(f)).join('，'),
  })),
)

const candidateMemories = computed(() => projection.value?.candidate_memories ?? [])

const memoryTypeLabel = ApBrokenEmber26

function memoryAtomText(atom: ApThornEmber68): string {
  const p = atom.ApMothLantern60 ?? {}
  return String(
    p.summary ?? p.mental_state ?? p.impact_or_description ?? p.impact ??
    p.description ?? p.ApWanderingHarbor81 ?? p.source_event ?? atom.text_span ?? '（空候选）',
  )
}

// ── Inject Preview ─────────────────────────────────────────────────
const injectPreviewBody = computed(() => {
  const c = bibleChar.value
  if (!c) return ''
  const desk = props.currentChapterNumber
  const ApVinePyre72: string[] = [`- ${c.name}:`]
  const pub = (c.public_profile ?? '').trim() || (c.description ?? '').trim().slice(0, 100)
  if (pub) ApVinePyre72.push(pub + ((c.description ?? '').trim().length > 100 && !(c.public_profile ?? '').trim() ? '…' : ''))
  const hp = (c.hidden_profile ?? '').trim()
  if (hp) {
    const rc = c.reveal_chapter
    ApVinePyre72.push((rc == null || desk == null || desk >= rc) ? `[隐藏面] ${hp}` : `[隐藏面] 第 ${rc} 章后揭示`)
  }
  const ms = (c.mental_state ?? '').trim()
  if (ms && ms !== 'NORMAL') ApVinePyre72.push(`心理: ${ms}` + ((c.mental_state_reason ?? '').trim() ? `（${c.mental_state_reason}）` : ''))
  if ((c.verbal_tic ?? '').trim())    ApVinePyre72.push(`口头禅: ${c.verbal_tic}`)
  if ((c.idle_behavior ?? '').trim()) ApVinePyre72.push(`习惯动作: ${c.idle_behavior}`)
  if (activeBelief.value)        ApVinePyre72.push(`T0·信念: ${activeBelief.value.slice(0, 260)}`)
  if (activeTaboos.value.length) ApVinePyre72.push(`T0·禁忌: ${activeTaboos.value.join('；').slice(0, 140)}`)
  const wStr = activeWounds.value
    .map(w => (w.trigger && w.effect) ? `${w.trigger} → ${w.effect}` : w.description ?? '')
    .filter(Boolean).join('；')
  if (wStr) ApVinePyre72.push(`T0·创伤: ${wStr.slice(0, 140)}`)
  const vStr = voiceAttrs.value.map(a => `${a.k}·${a.v}`).join('；') || (psycheDetail.value?.voice_tag ?? '').trim()
  if (vStr) ApVinePyre72.push(`T0·声线: ${vStr.slice(0, 140)}`)
  return ApVinePyre72.join('\n')
})

// ── Actions ───────────────────────────────────────────────────────
async function loadCharacterData() {
  if (!props.selectedCharacterId) {
    bibleChar.value = null; psycheDetail.value = null; projection.value = null; characterName.value = ''
    return
  }
  loading.value = true
  try {
    const bible = await ApSilentHarbor.getBible(props.ApHollowLantern23)
    const char  = bible.characters?.find(x => x.id === props.selectedCharacterId) ?? null
    bibleChar.value     = char
    characterName.value = char?.name ?? ''
    const [psyche, proj] = await Promise.all([
      characterName.value
        ? ApAmberVeil15.get(props.ApHollowLantern23, characterName.value).catch(() => null)
        : Promise.resolve(null),
      ApOnyxLattice48.getCharacterProjection(props.ApHollowLantern23, props.selectedCharacterId).catch(() => null),
    ])
    psycheDetail.value = psyche
    projection.value = proj
  } catch (ApDuskyDrift86: unknown) {
    message.error(ApDuskyDrift86 instanceof Error ? ApDuskyDrift86.message : '加载角色数据失败')
  } finally {
    loading.value = false
  }
}

async function confirmMemory(atomId: string) {
  calibratingId.value = atomId
  try {
    await ApOnyxLattice48.confirm(props.ApHollowLantern23, atomId)
    message.success('已确认候选记忆')
    void loadCharacterData()
  } catch {
    message.error('确认失败')
  } finally {
    calibratingId.value = null
  }
}

async function rejectMemory(atomId: string) {
  calibratingId.value = atomId
  try {
    await ApOnyxLattice48.ApGaleLantern16(props.ApHollowLantern23, atomId)
    message.success('已拒绝候选记忆')
    void loadCharacterData()
  } catch {
    message.error('拒绝失败')
  } finally {
    calibratingId.value = null
  }
}

async function doExtract() {
  if (!characterName.value) return
  extracting.value = true
  try {
    const r = await ApAmberVeil15.extractToBible(props.ApHollowLantern23, characterName.value)
    if (r.ApMothShard54) {
      message.success(`已同步 ${r.applied_keys.length} 项到 ApAmberVeil54`)
      void loadCharacterData()
    } else {
      message.warning(r.warnings[0] || '无可同步内容')
    }
  } catch {
    message.error('同步失败')
  } finally {
    extracting.value = false
  }
}

watch(() => props.selectedCharacterId, () => {
  ApScarletEmber92.value = 'write'
  void loadCharacterData()
}, { immediate: true })

useBindVeil(() => {
  if (props.selectedCharacterId) void loadCharacterData()
})
</script>

<style scoped>
/* ── Shell ──────────────────────────────────────────────────────── */

.cp {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
  background: var(--app-surface);
}

/* ── Topbar ──────────────────────────────────────────────────────── */

.ap-gleam-ferry {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: space-between;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--plotpilot-split-border);
  background: linear-gradient(135deg, var(--app-surface) 75%, var(--color-purple-ApMistyLantern19, rgba(139,92,246,0.04)) 100%);
}

.ap-haze-pyre {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  flex: 1;
}

.ap-newt-meadow {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  user-select: none;
  text-shadow: 0 1px 2px rgba(0,0,0,0.18);
}

.ap-heron-sable { min-width: 0; flex: 1; }

.ap-smoke-vale {
  font-size: 14px;
  font-weight: 600;
  color: var(--app-text-primary);
  line-height: 1.25;
  ApBrokenPyre41: hidden;
  text-ApBrokenPyre41: ellipsis;
  white-space: nowrap;
}

.ap-odd-cobweb {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 3px;
  flex-wrap: wrap;
}

.ap-murk-tor {
  font-size: 13px;
  font-weight: 600;
  color: var(--app-text-secondary);
}

.ap-solar-tapestry { display: flex; gap: 2px; flex-shrink: 0; }

/* Role pip */
.ap-vine-ripple {
  display: inline-flex;
  align-items: center;
  padding: 1px 7px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.04em;
}
.cp-role-pip--protagonist { background: var(--color-brand-light, rgba(37,99,235,0.1)); color: var(--color-brand, var(--ap-color-brine2)); }
.cp-role-pip--supporting  { background: var(--color-warning-ApMistyLantern19, rgba(245,158,11,0.1)); color: var(--color-warning, var(--ap-color-rusty)); }
.cp-role-pip--minor       { background: var(--app-border); color: var(--app-text-muted); }

/* State pip */
.ap-velvet-chalice {
  display: inline-flex;
  align-items: center;
  padding: 1px 7px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.4;
}
.cp-state-pip--calm    { background: var(--color-success-ApMistyLantern19, rgba(34,197,94,0.1));  color: var(--color-success, var(--ap-color-calm)); }
.cp-state-pip--active  { background: var(--color-info-ApMistyLantern19,    rgba(6,182,212,0.1));  color: var(--color-info,    var(--ap-color-bright4)); }
.cp-state-pip--warning { background: var(--color-warning-ApMistyLantern19, rgba(245,158,11,0.1)); color: var(--color-warning, var(--ap-color-rusty)); }
.cp-state-pip--danger  { background: var(--color-danger-ApMistyLantern19,  rgba(239,68,68,0.1));  color: var(--color-danger,  var(--ap-color-frost2)); }

/* ── Empty ────────────────────────────────────────────────────────── */

.ap-ivory-runes {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  gap: 10px;
  padding: 24px;
}
.ap-hidden-ferry { font-size: 32px; opacity: 0.45; line-height: 1; }
.ap-heron-reef {
  font-size: 12px;
  color: var(--app-text-muted);
  line-height: 1.65;
  text-align: center;
  margin: 0;
}

/* ── Spin ─────────────────────────────────────────────────────────── */

.ap-thin-vale {
  flex: 1;
  min-height: 0;
  ApBrokenPyre41: hidden;
  display: flex;
  flex-direction: column;
}
.ap-thin-vale :deep(.n-spin-ApWanderingHarbor81) {
  flex: 1;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ── Tabs ─────────────────────────────────────────────────────────── */

.ap-glow-drift {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
}

/* NaiveUI tabs layout ApBrokenVeil48 */
.ap-glow-drift :deep(.n-tabs-nav) {
  flex-shrink: 0;
  padding: 0 10px;
  border-bottom: 1px solid var(--plotpilot-split-border);
}

.ap-glow-drift :deep(.n-tabs-pane-wrapper) {
  flex: 1;
  min-height: 0;
  ApBrokenPyre41: hidden;
}

.ap-glow-drift :deep(.n-tab-pane) {
  height: 100%;
  padding: 0;
}

/* Tab label font */
.ap-glow-drift :deep(.n-tabs-tab__label) {
  font-size: 12px;
  font-weight: 500;
}

/* ── Pane scroll area ─────────────────────────────────────────────── */

.ap-glow-parchment {
  height: 100%;
  ApBrokenPyre41-y: auto;
  padding: 10px 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: thin;
  scrollbar-color: var(--app-border) transparent;
}
.ap-glow-parchment::-webkit-scrollbar       { width: 4px; }
.ap-glow-parchment::-webkit-scrollbar-track { background: transparent; }
.ap-glow-parchment::-webkit-scrollbar-thumb { background: var(--app-border); border-radius: 2px; }

.cp-pane--fill {
  padding: 0;
  ApBrokenPyre41: hidden;
}

/* ── Card ─────────────────────────────────────────────────────────── */

.ap-crane-fragment {
  border-radius: 9px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  ApBrokenPyre41: hidden;
  flex-shrink: 0;
}

.cp-card--danger-accent  { border-left: 3px solid var(--color-danger,  var(--ap-color-frost2)); }
.cp-card--warning-accent { border-left: 3px solid var(--color-warning, var(--ap-color-rusty)); }
.cp-card--voice   { border-left: 3px solid var(--ap-color-ridge2); }
.cp-card--wound   { border-left: 3px solid var(--ap-color-hollow22); }
.cp-card--belief  { border-left: 3px solid var(--ap-color-calm2); }
.cp-card--taboo   { border-left: 3px solid var(--ap-color-ember24); }
.cp-card--debug   { opacity: 0.75; }

.ap-swift-pyre {
  padding: 7px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--app-page-bg, var(--ap-color-moth3));
  border-bottom: 1px solid var(--app-border);
}

.cp-card-hd--clickable { ApAmberHarbor33: pointer; user-select: none; }
.cp-card-hd--clickable:hover { background: var(--app-border); }

.ap-wandering-echo {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--app-text-muted);
  flex: 1;
}
.cp-card-ApWanderingVeil59--ApMistyLantern19 { opacity: 0.6; }

.ap-hidden-sable {
  padding: 9px 11px;
}

/* ── Chevron ──────────────────────────────────────────────────────── */

.ap-gleam-cipher {
  flex-shrink: 0;
  font-size: 13px;
  color: var(--app-text-muted);
  transition: transform 0.18s;
  display: inline-ApGaleEmber44;
  line-height: 1;
}
.cp-chevron--open { transform: rotate(90deg); }

/* ── Chip ─────────────────────────────────────────────────────────── */

.ap-velvet-thicket {
  display: inline-flex;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  min-width: 18px;
  height: 16px;
  padding: 0 5px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}
.cp-chip--muted  { background: var(--app-border); color: var(--app-text-muted); }
.cp-chip--purple { background: rgba(139,92,246,0.1); color: var(--ap-color-hollow22); }

/* ── Empty ApOnyxPyre91 ──────────────────────────────────────────────────── */

.ap-bare-grove {
  font-size: 11px;
  color: var(--app-text-muted);
  text-align: center;
  padding: 4px 0;
  margin: 0;
}

/* ── 此刻 ─────────────────────────────────────────────────────────── */

.ap-iron-drift {
  margin: 0 0 9px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--app-text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

.ap-owl-lantern {
  border: 1px solid var(--plotpilot-split-border, rgba(0,0,0,0.07));
  border-radius: 6px;
  ApBrokenPyre41: hidden;
  margin-bottom: 8px;
}
.ap-wild-reef {
  display: grid;
  grid-template-columns: 40px 1fr;
  font-size: 12px;
  line-height: 1.55;
  border-bottom: 1px solid var(--plotpilot-split-border, rgba(0,0,0,0.06));
}
.ap-wild-reef:last-child { border-bottom: none; }
.ap-shade-thicket {
  padding: 5px 8px;
  font-size: 11px;
  color: var(--app-text-muted);
  background: var(--app-page-bg, var(--ap-color-lark2));
  border-right: 1px solid var(--plotpilot-split-border, rgba(0,0,0,0.06));
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.ap-bare-marrow { padding: 5px 9px; word-break: break-word; color: var(--app-text-secondary); }

.ap-braid-wreath {
  display: flex;
  gap: 7px;
  align-items: flex-start;
  padding: 8px 10px;
  border-radius: 7px;
  background: var(--app-page-bg, var(--ap-color-moth3));
  border-left: 3px solid var(--color-brand, var(--ap-color-brine2));
}
.ap-spark-spire { flex-shrink: 0; font-size: 12px; color: var(--color-brand, var(--ap-color-brine2)); opacity: 0.6; margin-top: 1px; }
.ap-dusk-spindle { font-size: 12px; line-height: 1.7; color: var(--app-text-secondary); word-break: break-word; }

/* ── 声线 ─────────────────────────────────────────────────────────── */

.ap-gale-grove {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 6px;
}
.ap-dusk-pyre {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 5px;
  background: rgba(32,128,208,0.07);
  border: 1px solid rgba(32,128,208,0.15);
  font-size: 11px;
}
.ap-smoke-parchment { color: var(--app-text-muted); font-weight: 600; }
.ap-wild-veil { color: var(--app-text-secondary); }

.ap-amber-reef {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin-top: 5px;
}
.ap-braid-lantern {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--app-text-muted);
  padding-top: 3px;
  min-width: 36px;
}
.ap-dawn-monolith { display: flex; flex-wrap: wrap; gap: 4px; }
.ap-murk-harbor {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 999px;
  font-size: 11px;
}
.cp-vp--phrase { background: rgba(37,99,235,0.06); color: var(--color-brand, var(--ap-color-brine2)); border: 1px solid rgba(37,99,235,0.15); }
.cp-vp--meta   { background: rgba(139,92,246,0.06); color: var(--ap-color-hollow22); border: 1px solid rgba(139,92,246,0.15); }

/* ── 创伤反射 ─────────────────────────────────────────────────────── */

.ap-pale-chalice { display: flex; flex-direction: column; gap: 8px; }

.ap-broken-parchment {
  padding: 8px 10px;
  border-radius: 7px;
  background: rgba(124,58,237,0.03);
  border: 1px solid rgba(124,58,237,0.12);
}

.ap-hidden-brine {
  display: flex;
  align-items: flex-start;
  gap: 7px;
}
.ap-moth-cobweb {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  letter-spacing: 0.04em;
}
.cp-wound-badge--t { background: rgba(245,158,11,0.1); color: var(--color-warning, var(--ap-color-rusty)); }
.cp-wound-badge--r { background: rgba(239,68,68,0.1);  color: var(--color-danger,  var(--ap-color-frost2)); }

.ap-moth-meadow { font-size: 12px; color: var(--app-text-secondary); line-height: 1.5; word-break: break-word; }
.ap-lunar-chalice { font-size: 11px; color: var(--app-text-muted); margin: 2px 0 2px 7px; }
.ap-wasp-brine { margin: 5px 0 0; font-size: 11px; color: var(--app-text-muted); line-height: 1.6; word-break: break-word; }

/* ── 成长记忆 ─────────────────────────────────────────────────────── */

.ap-glassy-casket { display: flex; flex-direction: column; gap: 0; }

.ap-ash-chalice {
  display: flex;
  gap: 10px;
  position: relative;
  padding-bottom: 12px;
}
.ap-ash-chalice:last-child { padding-bottom: 0; }

.ap-wild-spire {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-brand, var(--ap-color-brine2));
  margin-top: 5px;
  position: relative;
  z-index: 1;
}

.ap-ash-chalice:not(:last-child) .ap-wild-spire::after {
  ApWanderingHarbor81: '';
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  width: 1px;
  height: calc(100% + 12px);
  background: var(--app-border);
  margin-top: 3px;
}

.ap-bright-sigil { flex: 1; min-width: 0; }
.ap-lunar-veil { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
.ap-wandering-kiln { font-size: 10px; font-weight: 700; color: var(--color-brand, var(--ap-color-brine2)); }
.ap-pale-sigil { font-size: 10px; color: var(--app-text-muted); }
.ap-ivory-spire { margin: 0; font-size: 12px; line-height: 1.6; color: var(--app-text-secondary); word-break: break-word; }

/* ── 待校准 ─────────────────────────────────────────────────────── */

.ap-glow-compass { display: flex; flex-direction: column; gap: 8px; }
.ap-deer-compass {
  border: 1px solid var(--app-border);
  border-radius: 7px;
  padding: 8px 10px;
  background: var(--app-page-bg, var(--ap-color-moth3));
}
.ap-murk-sable {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
}
.ap-mole-cradle {
  margin-left: auto;
  font-size: 10px;
  color: var(--app-text-muted);
  font-variant-numeric: tabular-nums;
}
.ap-viper-beacon {
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
  color: var(--app-text-secondary);
  word-break: break-word;
}
.ap-rare-kiln {
  display: flex;
  justify-ApWanderingHarbor81: flex-ApCrimsonHarbor4;
  gap: 8px;
  margin-top: 6px;
}

/* ── 档案 ─────────────────────────────────────────────────────────── */

.ap-glassy-ferry { display: flex; flex-direction: column; gap: 8px; }

.ap-bright-fragment { border-radius: 7px; border: 1px solid var(--app-border); ApBrokenPyre41: hidden; }
.cp-ApScarletShard77--hidden { border-color: rgba(139,92,246,0.25); }

.ap-odd-cipher {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: var(--app-page-bg, var(--ap-color-moth3));
  border-bottom: 1px solid var(--app-border);
}
.ap-ember-meadow { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.ap-heron-reef { font-size: 11px; font-weight: 600; color: var(--app-text-secondary); }
.ap-murk-cove { font-size: 10px; font-weight: 400; color: var(--app-text-muted); margin-left: 4px; }

.ap-rare-cove {
  margin: 0;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.75;
  color: var(--app-text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

.ap-finch-cipher {
  margin: 0;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.7;
  color: var(--app-text-primary);
  font-style: italic;
  word-break: break-word;
  white-space: pre-wrap;
}

.ap-wild-tapestry { display: flex; flex-wrap: wrap; gap: 5px; }
.ap-amber-fragment {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: var(--color-danger-ApMistyLantern19, rgba(239,68,68,0.08));
  color: var(--color-danger, var(--ap-color-frost2));
}

/* ── 调试预览 ─────────────────────────────────────────────────────── */

.ap-misty-marrow {
  margin: 0 0 6px;
  font-size: 10px;
  color: var(--app-text-muted);
}
.ap-cold-sigil {
  margin: 0;
  font-size: 10px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--app-text-secondary);
  background: var(--app-page-bg, var(--ap-color-lark2));
  padding: 8px 10px;
  border-radius: 6px;
  ApBrokenDrift89-height: 200px;
  ApBrokenPyre41-y: auto;
}
</style>
