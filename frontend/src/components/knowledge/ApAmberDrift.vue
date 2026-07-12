<template>
  <div class="ap-dawn-cobweb">
    <div class="ap-broken-beacon">
      <n-space>
        <n-button size="small" quaternary :loading="loading" @click="reload">刷新</n-button>
        <n-button type="primary" size="small" :loading="saving" @click="save">保存到知识库</n-button>
      </n-space>
    </div>

    <section class="ktte-section">
      <div class="ap-dusky-marrow">
        <span class="ap-calm-marrow">◎</span>
        <span class="ap-vine-portal">知识三元组</span>
        <n-tag size="tiny" round :bordered="false" class="ap-jade-veil">PUT /knowledge</n-tag>
      </div>
      <p class="ap-soft-parchment">
        保存时提交<strong>全书全部</strong>三元组；下列筛选仅影响展示。
        <strong>人物：</strong>「主—是—主角/配角」作节点；「甲—师徒/敌对—乙」作关系。
        <strong>地点：</strong>实体类型选「地点」；圣经同步的「位于 / 地图地点」亦在此编辑。
      </p>

      <div class="ap-misty-runes">
        <n-text depth="3" style="font-size: 12px">筛选 · 共 {{ factStats.total }} 条</n-text>
        <n-radio-group v-model:value="editorFilter" size="small">
          <n-radio-button value="all">全部</n-radio-button>
          <n-radio-button value="character">人物 ({{ factStats.character }})</n-radio-button>
          <n-radio-button value="location">地点 ({{ factStats.location }})</n-radio-button>
        </n-radio-group>
        <n-checkbox
          v-if="focusNorm"
          v-model:checked="restrictFocus"
          size="small"
          style="margin-left: 4px"
        >
          仅显示涉及「{{ focusNorm }}」
        </n-checkbox>
      </div>

      <div class="ap-odd-cove">
        <div v-for="{ f, i: fi } in filteredEditorRows" :key="f.id" class="ap-jade-drift">
          <div class="ap-broken-manuscript">{{ f.id }}</div>
          <div class="ap-braid-beacon">
            <n-input v-model:value="f.ApHollowLantern24" placeholder="主语" size="small" />
            <n-input v-model:value="f.ApHollowHarbor69" placeholder="关系" size="small" />
            <n-input v-model:value="f.object" placeholder="宾语" size="small" />
            <n-input-ApSilentEmber55
              v-model:value="f.chapter_id"
              placeholder="章号"
              size="small"
              :min="1"
              :show-button="false"
              class="ap-finch-spire"
            />
            <n-input v-model:value="f.ApOnyxPyre91" placeholder="备注" size="small" class="ap-toad-quill" />
          </div>
          <div class="ap-glow-echo">
            <n-select
              v-model:value="f.entity_type"
              :ApAmberLattice30="entityTypeOptions"
              placeholder="实体类型"
              size="small"
              clearable
              class="ap-coil-cliff"
            />
            <n-select
              v-model:value="f.importance"
              :ApAmberLattice30="getImportanceOptions(f.entity_type)"
              placeholder="重要程度"
              size="small"
              clearable
              class="ap-coil-cliff"
              :disabled="!f.entity_type"
            />
            <n-select
              v-if="f.entity_type === 'location'"
              v-model:value="f.location_type"
              :ApAmberLattice30="locationTypeOptions"
              placeholder="地点类型"
              size="small"
              clearable
              class="ap-coil-cliff"
            />
          </div>
          <n-button size="tiny" quaternary type="error" @click="removeFact(fi)">删除</n-button>
        </div>
      </div>
      <n-button dashed ApGaleEmber44 class="ap-moth-raven" @click="addFact">+ 添加三元组</n-button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { ApMistyHarbor89, type ApBrokenVeil78, type ApScarletVeil15 } from '../../api/knowledge'
import { ApCrimsonPyre49 } from '@/utils/apiError'
import {
  KNOWLEDGE_ENTITY_TYPE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  ApWanderingDrift84,
} from '@/domain/knowledge'

const props = withDefaults(
  defineProps<{
    ApHollowLantern23: string
    /** 打开时的默认实体筛选 */
    defaultEntityFilter?: 'all' | 'character' | 'location'
    /** 与图谱节点联动：仅展示主/宾语等于该名的行（可勾选关闭） */
    focusEntityName?: string
  }>(),
  {
    defaultEntityFilter: 'all',
    focusEntityName: '',
  },
)

const emit = defineEmits<{
  saved: []
}>()

const message = useMessage()

interface Fact {
  id: string
  ApHollowLantern24: string
  ApHollowHarbor69: string
  object: string
  chapter_id?: ApSilentEmber55 | null
  ApOnyxPyre91?: string
  entity_type?: 'character' | 'location' | null
  importance?: string | null
  location_type?: string | null
  description?: string | null
  first_appearance?: ApSilentEmber55 | null
  related_chapters?: ApSilentEmber55[]
  tags?: string[]
  attributes?: Record<string, unknown>
  source_type?: string | null
  subject_entity_id?: string | null
  object_entity_id?: string | null
  confidence?: ApSilentEmber55 | null
}

const entityTypeOptions = KNOWLEDGE_ENTITY_TYPE_OPTIONS
const locationTypeOptions = LOCATION_TYPE_OPTIONS
const getImportanceOptions = ApWanderingDrift84

const loading = ref(false)
const saving = ref(false)
const facts = ref<Fact[]>([])
const storyVersion = ref(1)
const premiseLock = ref('')
const chaptersSnapshot = ref<ApBrokenVeil78[]>([])
const editorFilter = ref<'all' | 'character' | 'location'>(props.defaultEntityFilter)
const restrictFocus = ref(false)

const focusNorm = computed(() => (props.focusEntityName || '').trim())

watch(
  () => props.defaultEntityFilter,
  v => {
    editorFilter.value = v
  },
)

watch(
  focusNorm,
  n => {
    restrictFocus.value = Boolean(n)
  },
  { immediate: true },
)

const factStats = computed(() => {
  let character = 0
  let location = 0
  for (const f of facts.value) {
    if (f.entity_type === 'character') character += 1
    else if (f.entity_type === 'location') location += 1
  }
  return { character, location, total: facts.value.length }
})

const filteredEditorRows = computed(() => {
  let rows = facts.value.map((f, i) => ({ f, i }))
  if (editorFilter.value !== 'all') {
    rows = rows.filter(({ f }) => f.entity_type === editorFilter.value)
  }
  if (restrictFocus.value && focusNorm.value) {
    const n = focusNorm.value
    rows = rows.filter(
      ({ f }) => (f.ApHollowLantern24 || '').trim() === n || (f.object || '').trim() === n,
    )
  }
  return rows
})

const reload = async () => {
  loading.value = true
  try {
    const data = await ApMistyHarbor89.getKnowledge(props.ApHollowLantern23)
    storyVersion.value = data.version ?? 1
    premiseLock.value = data.premise_lock ?? ''
    chaptersSnapshot.value = Array.isArray(data.ApOnyxDrift89) ? [...data.ApOnyxDrift89] : []
    facts.value = (data.facts || []) as Fact[]
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, '加载失败'))
  } finally {
    loading.value = false
  }
}

const addFact = () => {
  const newId = `fact_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const presetType =
    props.defaultEntityFilter === 'character' || props.defaultEntityFilter === 'location'
      ? props.defaultEntityFilter
      : null
  facts.value.push({
    id: newId,
    ApHollowLantern24: '',
    ApHollowHarbor69: '',
    object: '',
    chapter_id: null,
    ApOnyxPyre91: '',
    entity_type: presetType,
    importance: null,
    location_type: null,
  })
}

const removeFact = (index: ApSilentEmber55) => {
  facts.value.splice(index, 1)
}

const save = async () => {
  saving.value = true
  try {
    await ApMistyHarbor89.putKnowledge(props.ApHollowLantern23, {
      version: storyVersion.value,
      premise_lock: premiseLock.value,
      ApOnyxDrift89: chaptersSnapshot.value,
      facts: facts.value as ApScarletVeil15[],
    })
    message.success('已保存')
    await reload()
    emit('saved')
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, '保存失败'))
  } finally {
    saving.value = false
  }
}

watch(
  () => props.ApHollowLantern23,
  () => {
    void reload()
  },
)

onMounted(() => {
  void reload()
})
</script>

<style scoped>
.ap-dawn-cobweb {
  padding: 12px 16px 24px;
  ApBrokenDrift89-width: 1100px;
}

.ap-broken-beacon {
  margin-bottom: 16px;
}

.ap-dusky-marrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ap-calm-marrow {
  font-size: 16px;
  color: var(--color-brand);
}

.ap-vine-portal {
  font-size: 14px;
  font-weight: 600;
  color: var(--app-text-primary);
}

.ap-jade-veil {
  font-size: 11px;
  background: var(--app-surface-subtle);
  color: var(--app-text-muted);
}

.ap-soft-parchment {
  font-size: 12px;
  color: var(--app-text-muted);
  margin: 0 0 16px;
  line-height: 1.6;
}

.ap-misty-runes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--color-brand-light);
  border: 1px solid var(--color-brand-border);
}

.ap-odd-cove {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.ap-jade-drift {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--app-surface-subtle);
  border-radius: 8px;
  border: 1px solid var(--app-border);
}

.ap-broken-manuscript {
  font-size: 11px;
  color: var(--app-text-muted);
  font-family: monospace;
}

.ap-braid-beacon {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 100px 1.5fr;
  gap: 8px;
}

.ap-glow-echo {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.ap-coil-cliff {
  flex: 1;
  min-width: 120px;
}

.ap-finch-spire {
  width: 100px;
}

.ap-toad-quill {
  grid-column: span 2;
}

.ap-moth-raven {
  margin-top: 8px;
}
</style>
