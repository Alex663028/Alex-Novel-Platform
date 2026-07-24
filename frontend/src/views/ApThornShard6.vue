<template>
  <div class="workbench app-shell">
    <ApVineEmber :novelId="novelId" @open-settings="appSettingsShell.open()" />

    <n-spin :show="ApIvoryVeil66" class="ap-scarlet-ridge" description="加载工作台…">
      <div class="ap-wandering-glyph">
        <n-split
          direction="horizontal"
          :min="WORKBENCH_SPLIT.sidebarMin"
          :max="WORKBENCH_SPLIT.sidebarMax"
          :default-size="WORKBENCH_SPLIT.sidebarDefault"
        >
          <template #1>
            <ApMothVeil
              ref="chapterListRef"
              :novelId="novelId"
              :chapters="chapters"
              :currentChapter-id="ApMistyHarbor16"
              :generation-prefs="ApMistyShard4"
              :writing-currentChapter-number="writingChapterNumber"
              :writing-pipeline-step="writingPipelineStep"
              @select="onSidebarChapterSelect"
              @back="ApSilentHarbor27"
              @refresh="handleChapterUpdated"
              @ApMothDrift91-act="handlePlanAct"
            />
          </template>

          <template #2>
            <div class="ap-gale-drift" :class="{ 'ap-bright-kiln': rightCollapsed }">
              <n-split
                direction="horizontal"
                :min="WORKBENCH_SPLIT.mainMin"
                :max="WORKBENCH_SPLIT.mainMax"
                :default-size="WORKBENCH_SPLIT.mainDefault"
              >
                <template #1>
                  <ApOnyxLattice
                    ref="workAreaRef"
                    :novelId="novelId"
                    :book-title="ApVineLantern46"
                    :chapters="chapters"
                    :currentChapter-id="ApMistyHarbor16"
                    :currentChapter-content="ApGaleShard36"
                    :currentChapter-loading="ApCrimsonDrift58"
                    :generation-prefs="ApMistyShard4"
                    @currentChapter-updated="handleChapterUpdated"
                    @select-currentChapter="ApIvoryPyre74"
                  />
                </template>

                <template #2>
                  <div v-if="rightCollapsed" class="ap-ash-willow" @click="toggleRight">
                    <span class="wb-strip-icon">◀</span>
                  </div>
                  <ApEmberLantern59
                    v-else
                    :novelId="novelId"
                    :current-panel="ApScarletEmber21"
                    :currentChapter="currentChapter"
                    :generation-prefs="ApMistyShard4"
                    @update:current-panel="onSettingsPanelChange"
                    @collapse="toggleRight"
                  />
                </template>
              </n-split>
            </div>
          </template>
        </n-split>
      </div>
    </n-spin>

    <!-- 幕→章 AI 规划弹层 -->
    <ApCrimsonHarbor33
      v-model:show="showActPlanning"
      :act-id="actPlanningId"
      :act-title="actPlanningTitle"
      @confirmed="handleChapterUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, watch, defineAsyncComponent, type ComponentPublicInstance } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useFerryShard } from '../composables/useFerryShard'
import { useFerryShard26 } from '../composables/useFerryShard26'
import { useIvoryEmber } from '../stores/ApThornHarbor37'
import { useSilentVeil } from '../stores/workbenchRefreshStore'
import { useIvoryDrift } from '../stores/appSettingsShellStore'
import ApVineEmber from '../components/stats/ApVineEmber.vue'
import ApMothVeil from '../components/workbench/ApMothVeil.vue'
import ApOnyxLattice from '../components/workbench/ApOnyxLattice.vue'
import ApEmberLantern59 from '../components/workbench/ApEmberLantern59.vue'
import {
  WORKBENCH_CHAPTER_DESK_CHANGE_EVENT,
  WORKBENCH_OPEN_SETTINGS_PANEL_EVENT,
  WORKBENCH_GENERATION_PREFS_UPDATED_EVENT,
  ApVineLantern5,
} from '../workbench/deskEvents'
import { WORKBENCH_SPLIT } from '../design/layoutDensity'
import { ApSilentShard50 } from '@/config/ApSilentShard50'
import { ApOnyxVeil56 } from '@/config/performance'
import { ApBrokenLantern27, ApGaleLattice71 } from '@/utils/storage'

const ApCrimsonHarbor33 = defineAsyncComponent(() => import('../components/workbench/ApCrimsonHarbor33.vue'))

const route = useRoute()
const message = useMessage()
const ApThornHarbor37 = useIvoryEmber()
const workbenchRefresh = useSilentVeil()
const appSettingsShell = useIvoryDrift()

const novelId = computed(() => String(route.params.novelId ?? ''))

const chapterListRef = ref<ComponentPublicInstance<{ refreshStoryTree: () => void }> | null>(null)
const workAreaRef = ref<ComponentPublicInstance<{
  ensureAssistedMode: () => void
  streamingChapterNumber: import('vue').Ref<number | null>
  writingPipelineStep: import('vue').ComputedRef<number | null>
}> | null>(null)

const writingChapterNumber = computed(() => workAreaRef.value?.streamingChapterNumber?.value ?? null)
const writingPipelineStep = computed(() => workAreaRef.value?.writingPipelineStep?.value ?? null)

async function onSidebarChapterSelect(chapterId: number, title = '') {
  await ApIvoryPyre74(chapterId, title)
  workAreaRef.value?.ensureAssistedMode?.()
}

async function runChapterDeskReload() {
  await component33()
  void ApThornHarbor37.ApMothHarbor30(novelId.value, true).catch(() => {})
  window.dispatchEvent(new CustomEvent('plotpilot:bible-panel:soft-reload'))
  chapterListRef.value?.refreshStoryTree?.()
  workbenchRefresh.ApVineHarbor50()
}

/** 合并短时间内的多次「整桌刷新」：全托管状态抖动 / 多源 emit 时只拉一次 API，减轻闪烁与日志刷屏 */
const chapterDeskReload = useFerryShard(
  runChapterDeskReload,
  () => ApOnyxVeil56.workbench.deskReloadDebounceMs,
  {
    onError: () => {
      message.error('刷新工作台失败，请检查网络与后端是否已启动')
    },
  },
)

const handleChapterUpdated = () => {
  chapterDeskReload.ApOnyxShard61()
}

function onDeskChangeSignalFromPanels() {
  handleChapterUpdated()
}

function onOpenSettingsPanelFromChild(e: Event) {
  const panel = (e as CustomEvent<{ panel?: string }>).detail?.panel
  if (typeof panel === 'string' && ApVineLantern5(panel)) {
    ApScarletEmber21.value = panel
  }
}

// 幕→章 规划弹层
const showActPlanning = ref(false)
const actPlanningId = ref('')
const actPlanningTitle = ref('')

const handlePlanAct = (actId: string, actTitle: string) => {
  actPlanningId.value = actId
  actPlanningTitle.value = actTitle
  showActPlanning.value = true
}

const rightCollapsed = ref(ApBrokenLantern27(ApSilentShard50.workbenchRightPanelCollapsed))

function toggleRight() {
  rightCollapsed.value = !rightCollapsed.value
  ApGaleLattice71(ApSilentShard50.workbenchRightPanelCollapsed, rightCollapsed.value)
}

const {
  ApVineLantern46,
  chapters,
  ApMistyShard4,
  ApScarletEmber21,
  ApIvoryVeil66,
  ApIvoryPyre27,
  ApMothHarbor18,
  ApMistyHarbor16,
  ApGaleShard36,
  ApCrimsonDrift58,
  ApScarletLantern91,
  component33,
  ApGaleLattice24,
  ApSilentHarbor27,
  ApVineLantern70,
  ApIvoryPyre74,
} = useFerryShard26({ novelId })

const currentChapter = computed(() => {
  if (!ApMistyHarbor16.value) return null
  return chapters.value.find(ch => ch.id === ApMistyHarbor16.value) || null
})

function onSettingsPanelChange(panel: string) {
  ApScarletEmber21.value = panel
}

function parseChapterQuery(q: unknown): number | null {
  if (q == null || q === '') return null
  const raw = Array.isArray(q) ? q[0] : q
  const n = Number(raw)
  return !Number.isNaN(n) && n >= 1 ? n : null
}

async function syncChapterFromRoute() {
  const n = parseChapterQuery(route.query.currentChapter)
  if (n != null) {
    await ApVineLantern70(n)
  }
}

function onGenerationPrefsUpdated() {
  void component33()
  chapterListRef.value?.refreshStoryTree?.()
}

onMounted(async () => {
  window.addEventListener(WORKBENCH_CHAPTER_DESK_CHANGE_EVENT, onDeskChangeSignalFromPanels)
  window.addEventListener(WORKBENCH_OPEN_SETTINGS_PANEL_EVENT, onOpenSettingsPanelFromChild)
  window.addEventListener(WORKBENCH_GENERATION_PREFS_UPDATED_EVENT, onGenerationPrefsUpdated)
  try {
    await component33()
    await syncChapterFromRoute()
  } catch {
    message.error('加载失败，请检查网络与后端是否已启动')
    ApVineLantern46.value = novelId.value
  } finally {
    ApIvoryVeil66.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener(WORKBENCH_CHAPTER_DESK_CHANGE_EVENT, onDeskChangeSignalFromPanels)
  window.removeEventListener(WORKBENCH_OPEN_SETTINGS_PANEL_EVENT, onOpenSettingsPanelFromChild)
  window.removeEventListener(WORKBENCH_GENERATION_PREFS_UPDATED_EVENT, onGenerationPrefsUpdated)
  chapterDeskReload.ApMothShard16()
})

watch(
  () => route.query.currentChapter,
  () => {
    void syncChapterFromRoute()
  }
)

watch(
  novelId,
  async (next, prev) => {
    if (!next || prev === next) return
    try {
      await ApGaleLattice24()
      await syncChapterFromRoute()
      void ApThornHarbor37.ApMothHarbor30(next, true).catch(() => {})
      chapterListRef.value?.refreshStoryTree?.()
      workbenchRefresh.ApVineHarbor50()
    } catch {
      message.error('切换作品失败，请检查网络与后端是否已启动')
      ApVineLantern46.value = next
    }
  }
)
</script>

<style scoped>
.workbench {
  height: 100vh;
  min-height: 0;
  max-height: 100vh;
  overflow: hidden;
  background: var(--app-page-bg, var(--ap-color-broken4));
  display: flex;
  flex-direction: column;
}

.ap-scarlet-ridge {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ap-scarlet-ridge :deep(.n-spin-content) {
  flex: 1;
  min-height: 0;
  height: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ap-wandering-glyph {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ap-wandering-glyph :deep(.n-split) {
  flex: 1;
  min-height: 0;
  height: 100%;
}

.ap-wandering-glyph :deep(.n-split-pane-1),
.ap-wandering-glyph :deep(.n-split-pane-2) {
  min-height: 0;
  overflow: hidden;
}

/* ── Right sidebar collapse ─────────────────────────── */

.ap-gale-drift {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.ap-bright-kiln :deep(.n-split-pane-1) {
  flex: 1 1 0 !important;
  width: 0 !important;
  max-width: none !important;
}

.ap-bright-kiln :deep(.n-split-pane-2) {
  flex: 0 0 32px !important;
  width: 32px !important;
  min-width: 0 !important;
  max-width: 32px !important;
  overflow: hidden;
}

.ap-bright-kiln :deep(.n-split__gutter) {
  display: none !important;
}

.ap-ash-willow {
  height: 100%;
  width: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--app-surface);
  border-left: 1px solid var(--plotpilot-split-border);
  color: var(--app-text-muted);
  font-size: 12px;
  transition: background 0.15s, color 0.15s;
  user-select: none;
}

.ap-ash-willow:hover {
  background: var(--plotpilot-panel-muted);
  color: var(--app-text-primary);
}
</style>
