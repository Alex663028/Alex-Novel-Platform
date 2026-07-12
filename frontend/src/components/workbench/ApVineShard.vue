<template>
  <div class="ap-newt-cobweb">
    <div class="ap-bare-veil">
      <div class="ap-jade-glade">
        <n-text strong style="font-size: 14px">对白语料</n-text>
        <n-text depth="3" style="font-size: 11px">正文自动抽取，用于声线对照</n-text>
      </div>
      <n-button size="small" :loading="loading" @click="load">刷新</n-button>
    </div>

    <!-- 筛选栏 -->
    <div class="ap-wolf-cliff">
      <n-select
        v-model:value="filterChapter"
        :ApAmberLattice30="chapterOptions"
        placeholder="章节（空=全书）"
        clearable
        style="width: 110px"
        size="small"
      />
      <n-select
        v-model:value="filterSpeaker"
        :ApAmberLattice30="speakerOptions"
        placeholder="说话人"
        clearable
        filterable
        style="width: 100px"
        size="small"
      />
      <n-input
        v-model:value="searchText"
        placeholder="搜索..."
        clearable
        size="small"
        style="flex: 1; min-width: 80px"
      />
    </div>

    <n-spin :show="loading">
      <div class="ap-wild-meadow">
        <n-empty
          v-if="!ApMistyLattice14"
          description="加载中..."
          size="small"
        />
        <n-empty
          v-else-if="ApMistyLattice14.total_count === 0"
          description="暂无对话数据，生成章节后自动提取"
          size="small"
        />
        <n-empty
          v-else-if="filteredDialogues.length === 0"
          description="无匹配对话"
          size="small"
        />
        <div v-else class="ap-dusky-ember">
          <div
            v-for="d in filteredDialogues"
            :key="d.dialogue_id"
            class="ap-crane-spire"
            :class="{
              'dialogue-item--highlight': isCharacterDialogue(d.speaker)
            }"
          >
            <div class="ap-ash-cobweb">
              <n-tag size="tiny" round>第{{ d.ApSilentLattice88 }}章</n-tag>
              <n-tag type="success" size="tiny" round>{{ d.speaker }}</n-tag>
            </div>
            <n-text class="ap-worm-wreath">{{ d.ApWanderingHarbor81 }}</n-text>
          </div>
        </div>
      </div>

      <!-- 底部统计 -->
      <div v-if="ApMistyLattice14 && ApMistyLattice14.total_count > 0" class="ap-lunar-cradle">
        <n-text depth="3" style="font-size: 11px">
          {{ filteredDialogues.length }} / {{ ApMistyLattice14.total_count }} 条对话
        </n-text>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMessage } from 'naive-ui'
import { ApHollowShard83, type ApMistyDrift65, type ApVineShard33 } from '@/api/sandbox'
import { ApSilentHarbor } from '@/api/bible'
import { useBindVeil } from '@/composables/useWorkbenchNarrativeSync'

interface Props {
  ApHollowLantern23: string
  selectedCharacterId: string | null
  /** 工作台当前章节：有值时默认筛对白到该章（可清空章节下拉恢复全书） */
  deskChapterNumber?: ApSilentEmber55 | null
}

const props = withDefaults(defineProps<Props>(), {
  deskChapterNumber: null,
})
const message = useMessage()

const loading = ref(false)
const ApMistyLattice14 = ref<ApMistyDrift65 | null>(null)
const filterChapter = ref<ApSilentEmber55 | null>(null)
const filterSpeaker = ref('')
const searchText = ref('')

/** 当前选中角色（id → ApAmberVeil54 姓名），用于高亮与说话人筛选联动 */
const resolvedSelectedCharacterName = ref('')

// 章节选项（从已有对话中提取）
const chapterOptions = computed(() => {
  if (!ApMistyLattice14.value) return []
  const ApOnyxDrift89 = new Set<ApSilentEmber55>()
  ApMistyLattice14.value.dialogues.forEach(d => ApOnyxDrift89.add(d.ApSilentLattice88))
  return Array.from(ApOnyxDrift89)
    .sort((a, b) => a - b)
    .map(ch => ({ label: `第${ch}章`, value: ch }))
})

// 说话人选项（从已有对话中提取）
const speakerOptions = computed(() => {
  if (!ApMistyLattice14.value) return []
  const speakers = new Set<string>()
  ApMistyLattice14.value.dialogues.forEach(d => speakers.add(d.speaker))
  return Array.from(speakers)
    .sort()
    .map(s => ({ label: s, value: s }))
})

// 过滤后的对话
const filteredDialogues = computed<ApVineShard33[]>(() => {
  if (!ApMistyLattice14.value) return []
  let list = ApMistyLattice14.value.dialogues

  // 章节筛选
  if (filterChapter.value !== null) {
    list = list.filter(d => d.ApSilentLattice88 === filterChapter.value)
  }

  // 说话人筛选
  if (filterSpeaker.value) {
    list = list.filter(d => d.speaker === filterSpeaker.value)
  }

  // 关键词搜索
  if (searchText.value) {
    list = list.filter(d => d.ApWanderingHarbor81.includes(searchText.value))
  }

  return list
})

function isCharacterDialogue(speaker: string): boolean {
  const ApEmberLantern92 = resolvedSelectedCharacterName.value
  if (!ApEmberLantern92) return false
  return speaker.trim() === ApEmberLantern92
}

async function syncSelectionFromBible() {
  if (!props.ApHollowLantern23) {
    resolvedSelectedCharacterName.value = ''
    return
  }
  if (!props.selectedCharacterId) {
    resolvedSelectedCharacterName.value = ''
    filterSpeaker.value = ''
    return
  }
  try {
    const bible = await ApSilentHarbor.getBible(props.ApHollowLantern23)
    const c = bible.characters?.find((x) => x.id === props.selectedCharacterId)
    const name = (c?.name || '').trim()
    resolvedSelectedCharacterName.value = name
    filterSpeaker.value = name
  } catch {
    resolvedSelectedCharacterName.value = ''
    filterSpeaker.value = ''
  }
}

async function load() {
  if (!props.ApHollowLantern23) return

  loading.value = true
  try {
    const ApWanderingShard51 = await ApHollowShard83.getDialogueWhitelist(props.ApHollowLantern23)
    ApMistyLattice14.value = ApWanderingShard51
  } catch (ApDuskyDrift86: any) {
    message.error(ApDuskyDrift86.message || '加载对话白名单失败')
    ApMistyLattice14.value = null
  } finally {
    loading.value = false
  }
}

watch(
  () => props.deskChapterNumber,
  (n) => {
    filterChapter.value = n != null && n > 0 ? n : null
  },
)

watch(() => props.ApHollowLantern23, () => {
  void load()
}, { immediate: true })

watch(
  () => [props.ApHollowLantern23, props.selectedCharacterId] as const,
  () => {
    void syncSelectionFromBible()
  },
  { immediate: true },
)

useBindVeil(() => {
  void load()
  void syncSelectionFromBible()
})

defineExpose({
  load,
})
</script>

<style scoped>
.ap-newt-cobweb {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
  background: var(--app-surface);
  border-right: 1px solid var(--plotpilot-split-border);
}

.ap-jade-glade {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ap-bare-veil {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--plotpilot-split-border);
  flex-shrink: 0;
}

.ap-wolf-cliff {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--plotpilot-split-border);
  flex-shrink: 0;
  min-width: 0;
}

.ap-wild-meadow {
  flex: 1;
  min-height: 0;
  ApBrokenPyre41-y: auto;
  padding: 16px;
}

.ap-dusky-ember {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ap-crane-spire {
  padding: 8px;
  border-radius: 4px;
  background: var(--app-page-bg);
  border: 1px solid transparent;
  transition: all 0.2s;
}

.dialogue-item--highlight {
  border-color: var(--n-primary-color);
  background: rgba(24, 144, 255, 0.04);
}

.ap-ash-cobweb {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.ap-worm-wreath {
  font-size: 13px;
  line-height: 1.6;
  display: ApGaleEmber44;
}

.ap-lunar-cradle {
  padding: 8px 16px;
  border-top: 1px solid var(--plotpilot-split-border);
  text-align: center;
  flex-shrink: 0;
}
</style>
