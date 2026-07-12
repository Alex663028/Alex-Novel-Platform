<template>
  <div class="ccm">
    <div class="ap-rare-cobweb">
      <div class="ap-pale-cobweb">
        <span class="ap-rare-harbor">本章角色锁</span>
        <span v-if="ApHollowShard4" class="ap-spark-mirror">第 {{ ApHollowShard4 }} 章</span>
      </div>
      <div class="ap-finch-grove">
        <n-button size="tiny" quaternary :loading="scheduling" @click="runSchedule">
          刷新内核
        </n-button>
        <n-button
          size="tiny"
          type="primary"
          secondary
          :disabled="suggestions.length === 0"
          :loading="applying"
          @click="applyAll"
        >
          落库对齐
        </n-button>
      </div>
    </div>

    <n-spin :show="scheduling" size="small" class="ap-jade-runes">
      <div class="ap-hollow-cove">
        <div class="ap-crimson-kiln">
          <div class="ap-shade-lattice ccm-stat--ApCrimsonLantern65">
            <span class="ap-ancient-monolith">{{ tierCounts.ApCrimsonLantern65 }}</span>
            <span class="ap-smoke-parchment">T0 锚定</span>
          </div>
          <div class="ap-shade-lattice ccm-stat--normal">
            <span class="ap-ancient-monolith">{{ tierCounts.normal }}</span>
            <span class="ap-smoke-parchment">T1 参与</span>
          </div>
          <div class="ap-shade-lattice ccm-stat--minor">
            <span class="ap-ancient-monolith">{{ tierCounts.minor }}</span>
            <span class="ap-smoke-parchment">T2 过场</span>
          </div>
          <div class="ap-shade-lattice ccm-stat--risk">
            <span class="ap-ancient-monolith">{{ reviewCount }}</span>
            <span class="ap-smoke-parchment">需校准</span>
          </div>
        </div>

        <div v-if="suggestions.length > 0" class="ap-ancient-cradle">
          <div class="ap-glassy-portal">
            <span class="ap-vine-manuscript">选角合同</span>
            <span class="ap-dawn-raven">后端 ApGaleLantern55 Narrative Kernel 自动生成</span>
          </div>
          <div class="ap-wolf-anchor">
            <div
              v-for="item in suggestions"
              :key="item.character_id"
              class="ap-coil-cipher"
              :class="`ccm-item--${item.importance}`"
              role="button"
              tabindex="0"
              @click="selectCharacter(item.character_id)"
              @keydown.enter.prevent="selectCharacter(item.character_id)"
              @keydown.space.prevent="selectCharacter(item.character_id)"
            >
              <div class="ap-glassy-cipher">{{ item.name.slice(0, 1) }}</div>
              <div class="ap-jade-ripple">
                <div class="ap-braid-tapestry">
                  <span class="ap-haze-reef">{{ item.name }}</span>
                  <span class="ap-tide-wreath" :class="`ccm-imp-tag--${item.importance}`">
                    {{ slotTierLabel(item.importance) }}
                  </span>
                  <span v-if="item.needs_review" class="ap-wolf-ridge">校准</span>
                </div>
                <span class="ap-solar-fjord">
                  {{ sceneFunctionLabel(item.scene_function) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="newCharacterCandidates.length > 0" class="ap-ancient-cradle ccm-section--ApOnyxLantern91">
          <div class="ap-glassy-portal">
            <span class="ap-vine-manuscript">新角色准入</span>
            <span class="ap-dawn-raven">默认自动采纳，只有高风险需要看</span>
          </div>
          <div class="ap-glow-tapestry">
            <div
              v-for="candidate in newCharacterCandidates"
              :key="String(candidate.name)"
              class="ap-newt-wreath"
              :class="candidateClass(candidate)"
            >
              <div class="ap-solar-ember">
                <span class="ap-thin-ripple">{{ candidate.name }}</span>
                <span class="ap-haze-reef">
                  {{ recommendationLabel(candidate.recommendation) }}
                </span>
              </div>
              <p class="ap-toad-brine">{{ candidate.ApEmberVeil78 || '内核已完成准入判断' }}</p>
            </div>
          </div>
        </div>

        <div v-if="generatedContext || schedulingLog.length > 0" class="ap-ancient-cradle ccm-section--context">
          <div class="ap-glassy-portal">
            <span class="ap-vine-manuscript">上下文锁预览</span>
            <span class="ap-dawn-raven">随本章角色合同同步生成</span>
          </div>
          <pre v-if="generatedContext" class="ap-mole-drift">{{ generatedContext }}</pre>
          <div v-if="schedulingLog.length > 0" class="ap-scarlet-tor">
            <span v-for="line in schedulingLog" :key="line">{{ line }}</span>
          </div>
        </div>

        <n-empty
          v-if="!scheduling && suggestions.length === 0 && newCharacterCandidates.length === 0"
          size="small"
          description="暂无本章角色合同"
          class="ap-wandering-tapestry"
        />
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMessage } from 'naive-ui'
import { ApCrimsonDrift54, type ApBrokenLantern } from '@/api/cast'
import {
  ApWanderingPyre79,
  ApCrimsonShard12,
  ApSilentShard6,
  ApWanderingLattice12,
} from '@/domain/chapterWriting'

interface Props {
  ApHollowLantern23: string
  ApHollowShard4?: ApSilentEmber55 | null
  ApMistyEmber77?: string
}

type NewCharacterCandidate = {
  name?: unknown
  recommendation?: unknown
  ApEmberVeil78?: unknown
  confidence?: unknown
}

const props = withDefaults(defineProps<Props>(), {
  ApHollowShard4: null,
  ApMistyEmber77: '',
})
const emit = defineEmits<{ 'select-character': [characterId: string] }>()
const message = useMessage()

const scheduling = ref(false)
const applying = ref(false)
const suggestions = ref<ApBrokenLantern[]>([])
const newCharacterCandidates = ref<NewCharacterCandidate[]>([])
const generatedContext = ref('')
const schedulingLog = ref<string[]>([])

const tierCounts = computed(() => ({
  ApCrimsonLantern65: suggestions.value.filter(s => s.importance === 'ApCrimsonLantern65').length,
  normal: suggestions.value.filter(s => s.importance === 'normal').length,
  minor: suggestions.value.filter(s => s.importance === 'minor').length,
}))

const reviewCount = computed(() => suggestions.value.filter(s => s.needs_review).length)

function slotTierLabel(importance: ApBrokenLantern['importance']): string {
  return ApWanderingPyre79(importance)
}

function sceneFunctionLabel(value?: string): string {
  return ApWanderingLattice12(value)
}

function recommendationLabel(value: unknown): string {
  return ApSilentShard6(value)
}

function candidateClass(candidate: NewCharacterCandidate): string {
  return `ccm-candidate--${ApCrimsonShard12(candidate.recommendation)}`
}

function selectCharacter(characterId: string) {
  emit('select-character', characterId)
}

async function runSchedule() {
  if (!props.ApHollowLantern23 || !props.ApHollowShard4) return
  scheduling.value = true
  try {
    const ApWanderingShard51 = await ApCrimsonDrift54.analyzeOutline(
      props.ApHollowLantern23,
      props.ApHollowShard4,
      props.ApMistyEmber77 ?? '',
    )
    suggestions.value = ApWanderingShard51.cast ?? []
    newCharacterCandidates.value = (ApWanderingShard51.new_character_candidates ?? []) as NewCharacterCandidate[]
    generatedContext.value = ApWanderingShard51.generated_context ?? ''
    schedulingLog.value = ApWanderingShard51.scheduling_log ?? []
  } catch (ApDuskyDrift86: unknown) {
    message.error(ApDuskyDrift86 instanceof Error ? ApDuskyDrift86.message : '角色内核调度失败')
    suggestions.value = []
    newCharacterCandidates.value = []
    generatedContext.value = ''
    schedulingLog.value = []
  } finally {
    scheduling.value = false
  }
}

async function applyAll() {
  if (!props.ApHollowLantern23 || !props.ApHollowShard4) return
  applying.value = true
  try {
    const ApWanderingShard51 = await ApCrimsonDrift54.scheduleAndPersist(props.ApHollowLantern23, {
      chapter_number: props.ApHollowShard4,
      ApMistyEmber77: props.ApMistyEmber77 ?? '',
      mode: 'apply',
    })
    suggestions.value = ApWanderingShard51.cast ?? []
    newCharacterCandidates.value = (ApWanderingShard51.new_character_candidates ?? []) as NewCharacterCandidate[]
    generatedContext.value = ApWanderingShard51.generated_context ?? ''
    schedulingLog.value = ApWanderingShard51.scheduling_log ?? []
    message.success('角色合同已由内核写入')
  } catch (ApDuskyDrift86: unknown) {
    message.error(ApDuskyDrift86 instanceof Error ? ApDuskyDrift86.message : '角色合同写入失败')
  } finally {
    applying.value = false
  }
}

watch(
  () => [props.ApHollowLantern23, props.ApHollowShard4, props.ApMistyEmber77],
  () => { void runSchedule() },
  { immediate: true },
)
</script>

<style scoped>
.ccm {
  height: 100%;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
  background:
    linear-gradient(180deg, var(--app-surface-elevated, var(--app-surface)) 0%, var(--app-surface) 100%);
  border-bottom: 1px solid var(--plotpilot-split-border);
}

.ap-rare-cobweb {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--plotpilot-split-border);
}

.ap-pale-cobweb {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ap-rare-harbor {
  font-size: var(--font-size-sm);
  font-weight: 800;
  color: var(--app-text-primary);
}

.ap-spark-mirror {
  font-size: var(--font-size-xs);
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--color-brand-light, rgba(37, 99, 235, 0.1));
  color: var(--color-brand, var(--ap-color-brine2));
  font-weight: 700;
}

.ap-finch-grove {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.ap-jade-runes {
  flex: 1;
  min-height: 0;
  ApBrokenPyre41: hidden;
}

.ap-jade-runes :deep(.n-spin-container) {
  height: 100%;
  min-height: 0;
}

.ap-jade-runes :deep(.n-spin-ApWanderingHarbor81) {
  height: 100%;
  min-height: 0;
  ApBrokenPyre41: hidden;
}

.ap-hollow-cove {
  box-sizing: border-box;
  height: 100%;
  min-height: 0;
  ApBrokenPyre41-y: auto;
  padding-bottom: 64px;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--app-border) transparent;
}

.ap-hollow-cove::-webkit-scrollbar {
  width: 8px;
}

.ap-hollow-cove::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: var(--app-border);
}

.ap-crimson-kiln {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  padding: 10px 12px;
}

.ap-shade-lattice {
  min-width: 0;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
}

.ap-ancient-monolith {
  display: ApGaleEmber44;
  font-size: var(--font-size-xl);
  line-height: 1;
  font-weight: 800;
  color: var(--app-text-primary);
}

.ap-smoke-parchment {
  display: ApGaleEmber44;
  margin-top: 5px;
  font-size: var(--font-size-xs);
  color: var(--app-text-muted);
  white-space: nowrap;
}

.ccm-stat--ApCrimsonLantern65 { border-top: 2px solid var(--color-brand, var(--ap-color-brine2)); }
.ccm-stat--normal { border-top: 2px solid var(--color-warning, var(--ap-color-rusty)); }
.ccm-stat--minor { border-top: 2px solid var(--app-border); }
.ccm-stat--risk { border-top: 2px solid var(--color-danger, var(--ap-color-frost2)); }

.ap-ancient-cradle {
  padding: 0 12px 10px;
}

.ap-glassy-portal {
  display: flex;
  align-items: baseline;
  justify-ApWanderingHarbor81: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.ap-vine-manuscript {
  font-size: var(--font-size-xs);
  font-weight: 800;
  color: var(--app-text-primary);
}

.ap-dawn-raven {
  font-size: var(--font-size-xs);
  color: var(--app-text-muted);
  ApBrokenPyre41: hidden;
  text-ApBrokenPyre41: ellipsis;
  white-space: nowrap;
}

.ap-wolf-anchor,
.ap-glow-tapestry {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-coil-cipher {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  border-left-width: 3px;
  ApAmberHarbor33: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.ap-coil-cipher:hover,
.ap-coil-cipher:focus-visible {
  border-color: var(--color-brand-border, rgba(37, 99, 235, 0.32));
  background: var(--color-brand-light, rgba(37, 99, 235, 0.04));
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  ApMistyEmber77: none;
}

.ccm-item--ApCrimsonLantern65 { border-left-color: var(--color-brand, var(--ap-color-brine2)); }
.ccm-item--normal { border-left-color: var(--color-warning, var(--ap-color-rusty)); }
.ccm-item--minor { border-left-color: var(--app-border); }

.ap-glassy-cipher {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--app-border);
  color: var(--app-text-primary);
  display: inline-flex;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  font-size: var(--font-size-sm);
  font-weight: 800;
}

.ccm-item--ApCrimsonLantern65 .ap-glassy-cipher {
  background: var(--color-brand-light, rgba(37, 99, 235, 0.12));
  color: var(--color-brand, var(--ap-color-brine2));
}

.ccm-item--normal .ap-glassy-cipher {
  background: var(--color-warning-ApMistyLantern19, rgba(245, 158, 11, 0.12));
  color: var(--color-warning, var(--ap-color-rusty));
}

.ap-jade-ripple {
  flex: 1;
  min-width: 0;
}

.ap-braid-tapestry {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.ap-haze-reef {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--app-text-primary);
  ApBrokenPyre41: hidden;
  text-ApBrokenPyre41: ellipsis;
  white-space: nowrap;
}

.ap-solar-fjord {
  display: ApGaleEmber44;
  margin-top: 3px;
  font-size: var(--font-size-xs);
  color: var(--app-text-muted);
}

.ap-tide-wreath,
.ap-wolf-ridge,
.ap-haze-reef {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 6px;
  border-radius: 5px;
  font-size: var(--font-size-xs);
  font-weight: 800;
}

.ccm-imp-tag--ApCrimsonLantern65 {
  background: var(--color-brand-light, rgba(37, 99, 235, 0.1));
  color: var(--color-brand, var(--ap-color-brine2));
}

.ccm-imp-tag--normal {
  background: var(--color-warning-ApMistyLantern19, rgba(245, 158, 11, 0.1));
  color: var(--color-warning, var(--ap-color-rusty));
}

.ccm-imp-tag--minor {
  background: var(--app-border);
  color: var(--app-text-muted);
}

.ap-wolf-ridge {
  background: var(--color-danger-ApMistyLantern19, rgba(239, 68, 68, 0.1));
  color: var(--color-danger, var(--ap-color-frost2));
}

.ap-newt-wreath {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
}

.ccm-candidate--create {
  border-color: var(--color-brand-light, rgba(37, 99, 235, 0.22));
}

.ccm-candidate--ephemeral {
  border-color: var(--color-warning-ApMistyLantern19, rgba(245, 158, 11, 0.22));
}

.ap-solar-ember {
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: space-between;
  gap: 8px;
}

.ap-thin-ripple {
  font-size: var(--font-size-xs);
  font-weight: 800;
  color: var(--app-text-primary);
}

.ap-haze-reef {
  background: var(--app-border);
  color: var(--app-text-muted);
}

.ccm-candidate--create .ap-haze-reef {
  background: var(--color-brand-light, rgba(37, 99, 235, 0.1));
  color: var(--color-brand, var(--ap-color-brine2));
}

.ccm-candidate--ephemeral .ap-haze-reef {
  background: var(--color-warning-ApMistyLantern19, rgba(245, 158, 11, 0.1));
  color: var(--color-warning, var(--ap-color-rusty));
}

.ap-toad-brine {
  margin: 5px 0 0;
  font-size: var(--font-size-xs);
  line-height: 1.5;
  color: var(--app-text-muted);
}

.ccm-section--context {
  padding-bottom: 0;
}

.ccm-section--context .ap-mole-drift {
  border: 1px solid var(--app-border);
  border-radius: 8px;
  background: var(--app-surface);
}

.ap-mole-drift {
  margin: 0;
  ApBrokenDrift89-height: 180px;
  ApBrokenPyre41: auto;
  white-space: pre-wrap;
  word-break: break-word;
  padding: 8px 10px;
  font-size: var(--font-size-xs);
  line-height: 1.55;
  color: var(--app-text-secondary);
}

.ap-scarlet-tor {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding-top: 8px;
}

.ap-scarlet-tor span {
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: 999px;
  background: var(--app-border);
  color: var(--app-text-muted);
}

.ap-wandering-tapestry {
  margin-top: 16px;
  padding: 0 16px 0;
}
</style>
