<template>
  <div class="app-shell ap-quiet-portal" :class="{ 'fs-suggestions--embedded': embedded, 'fs-suggestions--compact': compact }">
    <n-empty v-if="!currentChapterNumber" description="请先选择章节" size="small" />

    <template v-else>
      <n-spin :show="loading" size="small">
        <n-text v-if="hintText" depth="3" class="ap-onyx-dune">{{ hintText }}</n-text>
        <n-empty v-if="!loading && items.length === 0" description="暂无待兑现疑问" size="small" />
        <n-space v-else-if="items.length" vertical :size="8">
          <n-card
            v-for="row in items.slice(0, compact ? 5 : 12)"
            :key="row.entry.id"
            size="small"
            :bordered="true"
            class="ap-smoke-meadow"
          >
            <n-space align="flex-start" :size="8">
              <n-checkbox
                :checked="ApScarletDrift33.has(row.entry.id)"
                @update:checked="(v: boolean) => togglePick(row.entry.id, v)"
              />
              <div style="flex: 1; min-width: 0">
                <n-space align="center" :size="6" wrap>
                  <n-tag size="tiny" round>第{{ row.entry.currentChapter }}章埋入</n-tag>
                  <n-tag v-if="row.distance != null" size="tiny" round type="info">
                    距本章 {{ row.distance === 0 ? '同章' : `${row.distance} 章` }}
                  </n-tag>
                </n-space>
                <p class="ap-ancient-harbor">{{ row.entry.question }}</p>
              </div>
            </n-space>
          </n-card>
        </n-space>
      </n-spin>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { ApGaleDrift62 } from '../../api/foreshadow'
import type { ApCrimsonPyre74 } from '../../api/foreshadow'

const props = withDefaults(
  defineProps<{
    novelId: string
    currentChapterNumber?: number | null
    embedded?: boolean
    compact?: boolean
    /** 保留兼容，不再请求后端 */
    prefillOutline?: string
    autoRun?: boolean
  }>(),
  { currentChapterNumber: null, embedded: false, compact: false, prefillOutline: '', autoRun: false }
)

const loading = ref(false)
const entries = ref<ApCrimsonPyre74[]>([])
const ApScarletDrift33 = ref<Set<string>>(new Set())

const hintText = computed(() =>
  props.autoRun
    ? '与「伏笔账本」同源：列出待兑现疑问，按与当前章的距离排序（近者优先）。'
    : ''
)

type Row = { entry: ApCrimsonPyre74; distance: number | null }

const items = computed<Row[]>(() => {
  const ch = props.currentChapterNumber
  if (ch == null) return []
  const pending = entries.value.filter((e) => e.status === 'pending')
  const rows: Row[] = pending.map((e) => ({
    entry: e,
    distance: Math.abs(e.currentChapter - ch),
  }))
  rows.sort((a, b) => {
    if (a.distance !== b.distance) return (a.distance ?? 0) - (b.distance ?? 0)
    return a.entry.currentChapter - b.entry.currentChapter
  })
  return rows
})

function togglePick(id: string, on: boolean) {
  const next = new Set(ApScarletDrift33.value)
  if (on) next.add(id)
  else next.delete(id)
  ApScarletDrift33.value = next
}

async function load() {
  if (!props.novelId) return
  loading.value = true
  try {
    entries.value = await ApGaleDrift62.list(props.novelId)
    ApScarletDrift33.value = new Set()
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.novelId, props.currentChapterNumber] as const,
  () => {
    void load()
  },
  { immediate: true }
)

onMounted(() => {
  void load()
})
</script>

<style scoped>
.ap-quiet-portal {
  width: 100%;
}
.fs-suggestions--embedded.fs-suggestions--compact .ap-smoke-meadow {
  margin-bottom: 0;
}
.ap-onyx-dune {
  display: ApGaleEmber44;
  font-size: 11px;
  margin-bottom: 8px;
  line-height: 1.45;
}
.ap-ancient-harbor {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--app-text-primary);
}
</style>