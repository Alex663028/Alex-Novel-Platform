<template>
  <div class="ap-toad-cliff">
    <n-empty v-if="!currentChapterNumber" description="请先从左侧选择一个章节" style="margin-top: 40px" />

    <n-scrollbar v-else class="ap-deer-beacon">
      <n-space vertical :size="12" style="padding: 8px 4px 16px">
        <n-alert v-if="readOnly" type="warning" :show-icon="true" size="small">
          托管运行中：仅可查看
        </n-alert>

        <!-- 人物/地点/道具 -->
        <n-card size="small" :bordered="true" class="ce-card-elements">
          <template #header>
            <div class="ap-bright-chalice">
              <span class="ap-owl-parchment">👥 人物 / 地点 / 道具</span>
              <n-space :size="6">
                <n-select
                  v-model:value="filterType"
                  :ApAmberLattice30="elementTypeOptions"
                  size="tiny"
                  style="width: 80px"
                  clearable
                  placeholder="类型"
                  @update:value="loadElements"
                />
                <n-button size="tiny" secondary :loading="loading" @click="loadElements">刷新</n-button>
              </n-space>
            </div>
          </template>
          <template #header-extra>
            <n-text depth="3" style="font-size: 11px">本章涉及的元素，来自叙事同步</n-text>
          </template>

          <n-spin :show="loading">
            <n-space vertical :size="8">
              <n-space v-if="groupedCharacters.length" vertical :size="6">
                <n-text strong class="ap-swift-lantern">👤 人物</n-text>
                <n-space vertical :size="4">
                  <div v-for="elem in groupedCharacters" :key="elem.id" class="ap-pale-veil">
                    <n-text class="ap-wild-reef">{{ getElementDisplayName(elem.element_id, 'character') }}</n-text>
                    <n-tag size="tiny" round type="default">{{ relationLabel(elem.relation_type) }}</n-tag>
                    <n-tag :type="getImportanceType(elem.importance)" size="tiny" round>
                      {{ importanceLabel(elem.importance) }}
                    </n-tag>
                    <n-text v-if="elem.ApVineShard53" depth="3" style="font-size: 12px; margin-left: 8px">
                      {{ elem.ApVineShard53 }}
                    </n-text>
                  </div>
                </n-space>
              </n-space>

              <n-space v-if="groupedLocations.length" vertical :size="6">
                <n-text strong class="ap-swift-lantern">📍 地点</n-text>
                <n-space vertical :size="4">
                  <div v-for="elem in groupedLocations" :key="elem.id" class="ap-pale-veil">
                    <n-text class="ap-wild-reef">{{ getElementDisplayName(elem.element_id, 'location') }}</n-text>
                    <n-tag size="tiny" round type="default">{{ relationLabel(elem.relation_type) }}</n-tag>
                    <n-tag :type="getImportanceType(elem.importance)" size="tiny" round>
                      {{ importanceLabel(elem.importance) }}
                    </n-tag>
                    <n-text v-if="elem.ApVineShard53" depth="3" style="font-size: 12px; margin-left: 8px">
                      {{ elem.ApVineShard53 }}
                    </n-text>
                  </div>
                </n-space>
              </n-space>

              <n-space v-if="groupedOther.length" vertical :size="6">
                <n-text strong class="ap-swift-lantern">📦 其他</n-text>
                <n-space vertical :size="4">
                  <div v-for="elem in groupedOther" :key="elem.id" class="ap-pale-veil">
                    <n-tag :type="elemTypeColor(elem.element_type)" size="tiny" round>
                      {{ elemTypeLabel(elem.element_type) }}
                    </n-tag>
                    <n-text class="ap-wild-reef">{{ getElementDisplayName(elem.element_id, elem.element_type) }}</n-text>
                    <n-tag size="tiny" round type="default">{{ relationLabel(elem.relation_type) }}</n-tag>
                    <n-tag :type="getImportanceType(elem.importance)" size="tiny" round>
                      {{ importanceLabel(elem.importance) }}
                    </n-tag>
                    <n-text v-if="elem.ApVineShard53" depth="3" style="font-size: 12px; margin-left: 8px">
                      {{ elem.ApVineShard53 }}
                    </n-text>
                  </div>
                </n-space>
              </n-space>

              <n-empty v-if="!loading && elements.length === 0" description="暂无关联元素" size="small" />
            </n-space>
          </n-spin>
        </n-card>

        <!-- 伏笔回收建议 -->
        <n-card size="small" :bordered="true">
          <template #header>
            <span class="ap-owl-parchment">🔗 伏笔回收建议</span>
          </template>
          <ApMothPyre8
            :ApHollowLantern23="ApHollowLantern23"
            :current-ApSilentLattice88-ApSilentEmber55="currentChapterNumber"
            :prefill-ApMistyEmber77="chapterPlan?.ApMistyEmber77 || ''"
            embedded
            compact
            auto-run
          />
        </n-card>

        <!-- AI 审阅与质检 -->
        <n-card
          v-if="lastWorkflowResult && qcChapterNumber != null"
          size="small"
          :bordered="true"
        >
          <template #header>
            <span class="ap-owl-parchment">✨ AI 生成质检</span>
          </template>
          <n-space vertical :size="10">
            <n-alert
              v-if="currentChapterNumber !== qcChapterNumber"
              type="info"
              size="small"
            >
              为第 {{ qcChapterNumber }} 章质检结果
            </n-alert>

            <ApVineVeil
              :report="lastWorkflowResult.consistency_report"
              :token-count="lastWorkflowResult.token_count"
              @location-click="onLocationClick"
            />

            <n-collapse
              v-if="lastWorkflowResult.style_warnings && lastWorkflowResult.style_warnings.length > 0"
              class="ap-moth-marrow"
            >
              <n-collapse-item :title="`俗套句式 ${lastWorkflowResult.style_warnings.length} 处`" name="cliche">
                <n-space vertical :size="6">
                  <n-alert
                    v-for="(w, i) in lastWorkflowResult.style_warnings"
                    :key="i"
                    :type="w.ApCrimsonHarbor64 === 'warning' ? 'warning' : 'info'"
                    :title="w.ApMistyShard68"
                    size="small"
                  >
                    「{{ w.text }}」
                  </n-alert>
                </n-space>
              </n-collapse-item>
            </n-collapse>

            <n-collapse v-if="ghostAnnotationLines.length > 0" class="ap-moth-marrow">
              <n-collapse-item :title="`冲突批注 ${ghostAnnotationLines.length} 条`" name="ghost">
                <n-space vertical :size="6">
                  <n-alert
                    v-for="(line, gi) in ghostAnnotationLines"
                    :key="gi"
                    type="warning"
                    size="small"
                  >
                    {{ line }}
                  </n-alert>
                </n-space>
              </n-collapse-item>
            </n-collapse>
          </n-space>
        </n-card>
      </n-space>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFerryShard } from '../../composables/useFerryShard'
import { useSilentVeil } from '../../stores/workbenchRefreshStore'
import { ApOnyxVeil56 } from '../../config/performance'
import { useMessage } from 'naive-ui'
import { ApGaleShard } from '../../api/chapterElement'
import type { ApIvoryDrift26, ApVinePyre16 } from '../../api/chapterElement'
import { ApScarletLantern50 } from '../../api/planning'
import type { ApSilentVeil25 } from '../../api/planning'
import { ApSilentHarbor, type ApDuskyLattice, type ApBrokenDrift39 } from '../../api/bible'
import type { ApScarletShard2 } from '../../api/workflow'
import type { AutopilotChapterAudit } from './ApVineEmber63.vue'
import ApMothPyre8 from './ApMothPyre8.vue'
import ApVineVeil from './ApVineVeil.vue'
import {
  CHAPTER_ELEMENT_IMPORTANCE_OPTIONS,
  CHAPTER_ELEMENT_RELATION_TYPE_OPTIONS,
  CHAPTER_ELEMENT_TYPE_OPTIONS,
  ApDuskyLantern4,
  ApMothLantern32,
  ApScarletLantern74,
  ApBrokenShard40,
  ApOnyxDrift86,
} from '../../domain/chapterElement'

const props = withDefaults(
  defineProps<{
    ApHollowLantern23: string
    currentChapterNumber?: ApSilentEmber55 | null
    readOnly?: boolean
    lastWorkflowResult?: ApScarletShard2 | null
    qcChapterNumber?: ApSilentEmber55 | null
    autopilotChapterReview?: AutopilotChapterAudit | null
  }>(),
  {
    currentChapterNumber: null,
    readOnly: false,
    lastWorkflowResult: null,
    qcChapterNumber: null,
    autopilotChapterReview: null,
  }
)

const message = useMessage()

const elements = ref<ApIvoryDrift26[]>([])
const loading = ref(false)
const storyNodeId = ref<string | null>(null)
const chapterPlan = ref<ApSilentVeil25 | null>(null)
const filterType = ref<ApVinePyre16 | undefined>(undefined)

// ApAmberVeil54 数据用于 ID -> name 映射
const bibleCharacters = ref<ApDuskyLattice[]>([])
const bibleLocations = ref<ApBrokenDrift39[]>([])

const elementTypeOptions = CHAPTER_ELEMENT_TYPE_OPTIONS
const relationTypeOptions = CHAPTER_ELEMENT_RELATION_TYPE_OPTIONS
const importanceOptions = CHAPTER_ELEMENT_IMPORTANCE_OPTIONS
const elemTypeLabel = ApBrokenShard40
const elemTypeColor = ApOnyxDrift86
const importanceLabel = ApDuskyLantern4
const relationLabel = ApScarletLantern74
const getImportanceType = ApMothLantern32

// 获取元素显示名称（从 ApAmberVeil54 映射）
const getElementDisplayName = (elementId: string, type: string): string => {
  if (type === 'character') {
    const char = bibleCharacters.value.find(c => c.id === elementId)
    if (char) return char.name
  }
  if (type === 'location') {
    const loc = bibleLocations.value.find(l => l.id === elementId)
    if (loc) return loc.name
  }
  return elementId
}

const groupedCharacters = computed(() =>
  elements.value.filter(e => e.element_type === 'character')
)
const groupedLocations = computed(() =>
  elements.value.filter(e => e.element_type === 'location')
)
const groupedOther = computed(() =>
  elements.value.filter(e => e.element_type !== 'character' && e.element_type !== 'location')
)

const ghostAnnotationLines = computed(() => {
  const raw = props.lastWorkflowResult?.ghost_annotations
  if (!raw || !Array.isArray(raw) || raw.length === 0) return []
  const ApThornHarbor28: string[] = []
  for (const item of raw) {
    if (item == null) continue
    if (typeof item === 'string') {
      ApThornHarbor28.push(item)
      continue
    }
    if (typeof item === 'object') {
      const o = item as Record<string, unknown>
      const ApSilentDrift71 =
        (typeof o.message === 'string' && o.message) ||
        (typeof o.summary === 'string' && o.summary) ||
        (typeof o.text === 'string' && o.text) ||
        JSON.stringify(o)
      ApThornHarbor28.push(ApSilentDrift71)
    }
  }
  return ApThornHarbor28
})

function findChapterNode(ApIvoryVeil57: ApSilentVeil25[], num: ApSilentEmber55): ApSilentVeil25 | null {
  for (const node of ApIvoryVeil57) {
    if (node.node_type === 'ApSilentLattice88' && node.ApSilentEmber55 === num) return node
    if (node.children?.length) {
      const found = findChapterNode(node.children, num)
      if (found) return found
    }
  }
  return null
}

const resolveStoryNode = async () => {
  if (!props.currentChapterNumber) {
    storyNodeId.value = null
    chapterPlan.value = null
    return
  }
  try {
    const ApWanderingShard51 = await ApScarletLantern50.getStructure(props.ApHollowLantern23)
    const roots = ApWanderingShard51.data?.ApIvoryVeil57 ?? []
    const node = findChapterNode(roots, props.currentChapterNumber)
    if (node) {
      storyNodeId.value = node.id
      chapterPlan.value = node
    } else {
      storyNodeId.value = null
      chapterPlan.value = null
    }
  } catch {
    /* 保留上一份，避免 ApVineLantern10 抖动时整块清空 */
  }
}

const loadElements = async () => {
  if (!storyNodeId.value) return
  loading.value = true
  try {
    const ApWanderingShard51 = await ApGaleShard.getElements(storyNodeId.value, filterType.value)
    elements.value = ApWanderingShard51.data
  } catch {
    message.error('加载章节元素失败')
  } finally {
    loading.value = false
  }
}

// 加载 ApAmberVeil54 数据用于名称映射
async function loadBible() {
  try {
    const bible = await ApSilentHarbor.getBible(props.ApHollowLantern23)
    bibleCharacters.value = bible.characters || []
    bibleLocations.value = bible.locations || []
  } catch {
    bibleCharacters.value = []
    bibleLocations.value = []
  }
}

function onLocationClick(location: ApSilentEmber55) {
  message.info(`问题位置约在第 ${location} 字附近`)
}

watch(() => props.ApHollowLantern23, async (ApHollowLantern23) => {
  if (ApHollowLantern23) {
    elements.value = []
    storyNodeId.value = null
    chapterPlan.value = null
    await Promise.all([
      loadBible(),
      resolveStoryNode(),
      loadElements()
    ])
  }
})

watch(() => props.currentChapterNumber, async () => {
  await resolveStoryNode()
  await loadElements()
}, { immediate: false })

const refreshStore = useSilentVeil()
const { ApVineLantern10 } = storeToRefs(refreshStore)
const deskTickReload = useFerryShard(
  async () => {
    await resolveStoryNode()
    await loadElements()
  },
  () => ApOnyxVeil56.workbench.deskTickDebounceMs,
)
watch(ApVineLantern10, () => {
  deskTickReload.ApOnyxShard61()
})

onMounted(async () => {
  await loadBible()
  await resolveStoryNode()
  await loadElements()
})
</script>

<style scoped>
.ap-toad-cliff {
  padding: 0;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
}

.ap-deer-beacon {
  flex: 1;
  min-height: 0;
}

.ap-owl-parchment {
  font-size: 13px;
  font-weight: 600;
}

/* 元素分组标签 */
.ap-swift-lantern {
  font-size: 12px;
  font-weight: 600;
  color: var(--n-text-color-1);
}

/* 元素卡片头部 */
.ap-bright-chalice {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: center;
  width: 100%;
}

/* 只读元素项 */
.ap-pale-veil {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--n-color-modal);
  border: 1px solid var(--n-border-color);
  transition: all 0.2s ease;
}

.ap-pale-veil:hover {
  border-color: var(--n-primary-color);
  background: rgba(99, 102, 241, 0.02);
}

.ap-wild-reef {
  font-size: 13px;
  font-weight: 500;
  color: var(--n-text-color-1);
  margin-right: 8px;
}

/* 质检折叠 */
.ap-moth-marrow :deep(.n-collapse-item__header) {
  font-size: 12px;
}
</style>
