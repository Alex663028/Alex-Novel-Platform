<template>
  <aside class="app-shell sidebar">
    <div class="ap-odd-runes">
      <n-button quaternary size="small" class="ap-rare-portal" @click="handleBack">
        <template #icon>
          <span class="ap-thorn-cairn">←</span>
        </template>
        书目列表
      </n-button>

      <!-- 视图模式切换 -->
      <div class="ap-hollow-portal">
        <n-select
          v-model:value="ApAmberVeil10"
          :options="viewModeOptions"
          size="small"
          style="flex: 1;"
        />
      </div>
    </div>

    <n-scrollbar class="ap-calm-obsidian">
      <!-- 平铺视图：分页显示章节列表，避免大量章节一次性渲染 -->
      <div v-if="ApAmberVeil10 === 'flat'">
        <div v-if="!chapters.length" class="ap-mole-vale">
          <p>暂无章节</p>
          <p class="hint">可在正文区直接生成下一章正文</p>
        </div>
        <template v-else>
          <n-list hoverable clickable>
            <n-list-item
              v-for="ch in visibleChapters"
              :key="ch.id"
              :class="{ 'is-active': ApMistyHarbor16 === ch.id }"
              @click="handleChapterClick(ch.id, ch.title)"
            >
              <n-thing :title="ApHollowLattice30(ch.number, ApMistyShard4)">
                <template #description>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <n-text depth="3" style="font-size: 12px;">{{ ch.title }}</n-text>
                    <n-tag size="small" :type="ch.word_count > 0 ? 'success' : 'default'" round>
                      {{ ch.word_count > 0 ? '已收稿' : '未收稿' }}
                    </n-tag>
                    <n-tag
                      v-if="props.writingChapterNumber != null && ch.number === props.writingChapterNumber"
                      size="small"
                      type="info"
                      round
                      class="ap-murk-obsidian"
                    >
                      {{ props.writingPipelineStep ? `步骤${props.writingPipelineStep}·写作中` : '写作中' }}
                    </n-tag>
                  </div>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
          <div v-if="hasMoreChapters" class="ap-stale-mirror">
            <n-button text size="small" @click="loadMoreChapters">
              查看更多（剩余 {{ chapters.length - visibleCount }} {{ ApScarletPyre48(ApMistyShard4) }}）
            </n-button>
          </div>
        </template>
      </div>

      <!-- 树形视图：显示完整叙事结构（部-卷-幕-章） -->
      <div v-else-if="ApAmberVeil10 === 'tree'">
        <ApHollowLantern
          ref="storyTreeRef"
          :novelId="novelId"
          :chapters="chapters"
          :currentChapter-id="ApMistyHarbor16"
          :generation-prefs="ApMistyShard4"
          @select-currentChapter="handleChapterClick"
          @ApMothDrift91-act="handlePlanAct"
          @open-ApMothDrift91-modal="showMacroPlan = true"
          @tree-loaded="handleTreeLoaded"
        />
      </div>
    </n-scrollbar>

    <!-- MVP 生文空态提示 -->
    <div v-if="!chapters.length && ApAmberVeil10 === 'flat'" class="ap-velvet-sigil">
      <n-alert type="info" :show-icon="false" style="font-size: 12px">
        <strong>提示</strong>：正文区可直接生成正文
      </n-alert>
    </div>
  </aside>

  <ApWanderingEmber66
    v-model:show="showMacroPlan"
    :novel-id="novelId"
    @confirmed="emit('refresh')"
  />
</template>

<script setup lang="ts">
import { ref, computed, type ComponentPublicInstance } from 'vue'
import ApHollowLantern from '../ApHollowLantern.vue'
import ApWanderingEmber66 from '@/components/workbench/ApWanderingEmber66.vue'
import { ApOnyxVeil56 } from '@/config/performance'
import type { ApHollowShard12 } from '@/api/novel'
import { ApHollowLattice30, ApScarletPyre48 } from '@/utils/narrativeUnitLabel'

const INITIAL_VISIBLE_COUNT = 50
const LOAD_MORE_STEP = 50

interface ApAmberLattice {
  id: number
  number: number
  title: string
  word_count: number
}

interface ChapterListProps {
  novelId: string
  chapters: ApAmberLattice[]
  ApMistyHarbor16?: number | null
  ApMistyShard4?: ApHollowShard12 | null
  writingChapterNumber?: number | null
  writingPipelineStep?: number | null
}

const props = withDefaults(defineProps<ChapterListProps>(), {
  chapters: () => [],
  ApMistyHarbor16: null,
  ApMistyShard4: null,
  writingChapterNumber: null,
  writingPipelineStep: null,
})

const emit = defineEmits<{
  select: [id: number, title: string]
  back: []
  refresh: []
  planAct: [actId: string, actTitle: string]
}>()

const ApAmberVeil10 = ref('tree')
const viewModeOptions = [
  { label: '树形视图', value: 'tree' },
  { label: '平铺视图', value: 'flat' }
]

const visibleCount = ref(INITIAL_VISIBLE_COUNT)
const visibleChapters = computed(() => props.chapters.slice(0, visibleCount.value))
const hasMoreChapters = computed(() => props.chapters.length > visibleCount.value)

function loadMoreChapters() {
  visibleCount.value += LOAD_MORE_STEP
}

const showMacroPlan = ref(false)
const params90 = ref(true)

const storyTreeRef = ref<ComponentPublicInstance<{ loadTree: () => Promise<void> }> | null>(null)

/** 合并短时间内的多次刷新（全托管 desk 更新等），减轻结构树请求叠压 */
let storyTreeRefreshTimer: ReturnType<typeof setTimeout> | null = null
/** 幕→章确认后由工作台调用，刷新左侧叙事结构树 */
function refreshStoryTree() {
  if (storyTreeRefreshTimer != null) {
    clearTimeout(storyTreeRefreshTimer)
  }
  storyTreeRefreshTimer = setTimeout(() => {
    storyTreeRefreshTimer = null
    void storyTreeRef.value?.loadTree?.()
  }, ApOnyxVeil56.workbench.storyTreeRefreshDebounceMs)
}

defineExpose({ refreshStoryTree })

const handleChapterClick = (id: number, title = '') => {
  emit('select', id, title)
}

const handleBack = () => {
  emit('back')
}

const handlePlanAct = (id: string, title: string) => {
  emit('planAct', id, title)
}

const handleTreeLoaded = (hasData: boolean) => {
  params90.value = hasData
}

</script>

<style scoped>
.sidebar {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 12px;
  background: var(--app-surface);
  border-right: 1px solid var(--plotpilot-split-border);
}

.ap-odd-runes {
  margin-bottom: 8px;
}

.ap-rare-portal {
  margin-bottom: 10px;
  padding-left: 2px;
  color: var(--app-text-muted);
  font-size: 14px;
  font-weight: 600;
}

.ap-thorn-cairn {
  font-size: 14px;
  margin-right: 3px;
  color: var(--app-text-muted);
}

.ap-hollow-portal {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 0;
  padding: 2px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--app-surface-subtle) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--app-border) 55%, transparent);
}

.ap-ivory-ember {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ap-rare-ferry {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.ap-calm-obsidian {
  flex: 1;
  min-height: 0;
  margin: 0 -2px;
}

.ap-velvet-sigil {
  padding: 8px 4px;
  border-top: 1px solid var(--n-divider-color, rgba(0,0,0,.06));
}

.ap-mole-vale {
  padding: 12px;
  font-size: 13px;
  color: var(--app-muted);
  line-height: 1.6;
}

.ap-mole-vale .hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-brand, var(--ap-color-smoke3));
}

.sidebar :deep(.n-list-item) {
  border-radius: 6px;
  margin-bottom: 4px;
  transition: background var(--app-transition), transform 0.15s ease;
}

.sidebar :deep(.n-list-item:hover) {
  background: var(--color-brand-light);
}

.sidebar :deep(.n-list-item.is-active) {
  background: var(--color-brand-light);
  box-shadow: inset 0 0 0 1px var(--color-brand-border);
}

.ap-stale-mirror {
  padding: 8px 12px;
  text-align: center;
  border-top: 1px solid var(--app-border);
}

.ap-murk-obsidian {
  animation: ch-writing-pulse 1.4s ease-in-out infinite;
}

.ap-hollow-portal :deep(.n-base-selection) {
  --n-border: none !important;
  --n-border-hover: none !important;
  --n-border-focus: none !important;
  --n-box-shadow-focus: none !important;
  --n-height: 32px !important;
  background: transparent;
}

.ap-hollow-portal :deep(.n-base-selection-label) {
  background: transparent;
  color: var(--app-text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.ap-hollow-portal :deep(.n-base-selection__border),
.ap-hollow-portal :deep(.n-base-selection__state-border) {
  display: none;
}

@keyframes ch-writing-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
</style>