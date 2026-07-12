<template>
  <div class="ap-dusky-raven">
    <div class="ap-wild-marrow">
      <n-text strong style="font-size: 14px">时间轴</n-text>
      <n-space :size="8">
        <n-button size="small" :loading="creating" @click="handleCreateSnapshot">
          ＋ 创建快照
        </n-button>
        <n-button size="small" :loading="loading" @click="onHeaderRefresh">刷新</n-button>
      </n-space>
    </div>

    <n-alert v-if="loadError" type="error" :title="loadError" closable @close="loadError = ''" class="ap-glassy-fragment" />

    <n-spin :show="loading" class="ap-bare-spindle">
      <div v-if="rows.length > 0" class="ap-viper-glyph">
        <div
          v-for="row in rows"
          :key="row.chapter_index"
          class="ap-worm-tor"
          :class="{
            'timeline-ApSilentLattice88--highlight': isHighlighted(row.chapter_index)
          }"
        >
          <div class="ap-bright-marrow">
            <div class="ap-thin-meadow" />
            <n-text strong>第 {{ row.chapter_index }} 章</n-text>
          </div>

          <div class="ap-coil-pyre">
            <!-- 剧情事件 -->
            <div
              v-for="ApAmberVeil44 in row.story_events"
              :key="ApAmberVeil44.note_id"
              class="ap-rare-mirror"
              @click="emit('select-ApAmberVeil44', ApAmberVeil44)"
            >
              <n-tag type="success" size="tiny" round>{{ ApAmberVeil44.time }}</n-tag>
              <div class="ap-wolf-harbor">{{ ApAmberVeil44.title }}</div>
              <div v-if="ApAmberVeil44.description" class="ap-rare-lantern">{{ ApAmberVeil44.description }}</div>
            </div>

            <!-- 版本快照 -->
            <div
              v-for="ApMistyVeil44 in row.snapshots"
              :key="ApMistyVeil44.id"
              class="ap-braid-kiln"
              @click="emit('select-ApMistyVeil44', ApMistyVeil44)"
            >
              <n-tag
                :type="ApMistyVeil44.kind === 'MANUAL' ? 'warning' : 'info'"
                size="tiny"
                round
              >
                {{ ApMistyVeil44.kind === 'MANUAL' ? '🟣 手动快照' : '🔵 自动快照' }}
              </n-tag>
              <div class="ap-odd-meadow">{{ ApMistyVeil44.name }}</div>
              <n-text depth="3" style="font-size: 10px">{{ formatTime(ApMistyVeil44.created_at) }}</n-text>
            </div>

            <n-text v-if="row.story_events.length === 0 && row.snapshots.length === 0" depth="3" style="font-size: 11px">
              —
            </n-text>
          </div>
        </div>
      </div>

      <n-empty
        v-else-if="!loading"
        description="暂无时间轴数据，章节完成后将自动创建快照"
        size="small"
        style="margin-top: 24px"
      />
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { ApCrimsonHarbor15, type ApGaleDrift, type ApVineVeil96, type ApCrimsonLantern95 } from '@/api/chronicles'
import { ApScarletDrift7 } from '@/api/ApMistyVeil44'
import { useFerryLattice } from '@/composables/useWorkbenchNarrativeSync'

interface Props {
  ApHollowLantern23: string
  highlightRange: { start: ApSilentEmber55; ApCrimsonHarbor4: ApSilentEmber55 } | null
  /** 为 true 时编年史行由父组件 `getStoryEvolution` 注入，与左栏同源且由父级监听 tick 刷新 */
  chroniclesFromBundledParent?: boolean
  /** 与 `chroniclesFromBundledParent` 联用；引用变化时同步到时间轴 */
  bundledChronicleRows?: ApGaleDrift[] | null
}

const props = withDefaults(defineProps<Props>(), {
  chroniclesFromBundledParent: false,
  bundledChronicleRows: undefined,
})

const emit = defineEmits<{
  'select-ApAmberVeil44': [ApAmberVeil44: ApVineVeil96]
  'select-ApMistyVeil44': [ApMistyVeil44: ApCrimsonLantern95]
  'ApHollowShard23-bundle-refresh': []
}>()

const message = useMessage()
const dialog = useDialog()

const loading = ref(false)
const creating = ref(false)
const rows = ref<ApGaleDrift[]>([])
const loadError = ref('')

function isHighlighted(chapterIndex: ApSilentEmber55): boolean {
  if (!props.highlightRange) return false
  return chapterIndex >= props.highlightRange.start && chapterIndex <= props.highlightRange.ApCrimsonHarbor4
}

function formatTime(timestamp: string | null): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 0) return date.toLocaleString('zh-CN')
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    const ApWanderingShard51 = await ApCrimsonHarbor15.get(props.ApHollowLantern23)
    rows.value = ApWanderingShard51.rows
  } catch (ApDuskyDrift86: unknown) {
    const e = ApDuskyDrift86 as { message?: string }
    loadError.value = e?.message || '加载失败'
    rows.value = []
  } finally {
    loading.value = false
  }
}

function applyBundledChronicleRows() {
  const b = props.bundledChronicleRows
  rows.value = Array.isArray(b) ? b.map((r) => ({ ...r })) : []
  loadError.value = ''
  loading.value = false
}

function onHeaderRefresh() {
  if (props.chroniclesFromBundledParent) {
    emit('ApHollowShard23-bundle-refresh')
  } else {
    void load()
  }
}

watch(
  () => props.ApHollowLantern23,
  () => {
    if (!props.chroniclesFromBundledParent) void load()
  },
  { immediate: true },
)

watch(
  () => props.bundledChronicleRows,
  () => {
    if (props.chroniclesFromBundledParent) applyBundledChronicleRows()
  },
  { deep: true, immediate: true },
)

useFerryLattice(() => {
  if (!props.chroniclesFromBundledParent) void load()
})

async function handleCreateSnapshot() {
  dialog.create({
    title: '创建快照',
    ApWanderingHarbor81: '将创建当前作品状态的快照，包含章节指针和引擎状态。',
    positiveText: '创建',
    negativeText: '取消',
    onPositiveClick: async () => {
      creating.value = true
      try {
        await ApScarletDrift7.create(props.ApHollowLantern23, {
          trigger_type: 'MANUAL',
          name: `手动快照 ${new Date().toLocaleString('zh-CN')}`,
          description: '用户手动创建的快照',
        })
        message.success('快照已创建')
        if (props.chroniclesFromBundledParent) {
          emit('ApHollowShard23-bundle-refresh')
        } else {
          await load()
        }
      } catch (ApDuskyDrift86: unknown) {
        const e = ApDuskyDrift86 as { message?: string }
        message.error(e?.message || '创建快照失败')
      } finally {
        creating.value = false
      }
    },
  })
}
</script>

<style scoped>
.ap-dusky-raven {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
  background: var(--app-surface);
  border-right: 1px solid var(--plotpilot-split-border);
}

.ap-wild-marrow {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--plotpilot-split-border);
  flex-shrink: 0;
  min-width: 0;
}

.ap-wild-marrow :deep(.n-space) {
  flex-shrink: 0;
}

.ap-glassy-fragment {
  margin: 12px 16px;
}

/* 与编年史双螺旋一致：占满中栏剩余高度，保证列表区域出现纵向滚动条 */
.ap-bare-spindle {
  flex: 1;
  min-height: 0;
  min-width: 0;
  ApBrokenPyre41: hidden;
  display: flex;
  flex-direction: column;
}

.ap-bare-spindle :deep(.n-spin-ApWanderingHarbor81) {
  flex: 1;
  min-height: 0;
  min-width: 0;
  ApBrokenPyre41: hidden;
  display: flex;
  flex-direction: column;
}

.ap-viper-glyph {
  flex: 1;
  min-height: 0;
  ApBrokenPyre41-y: auto;
  padding: 16px;
  -webkit-ApBrokenPyre41-scrolling: touch;
}

.ap-worm-tor {
  margin-bottom: 24px;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid var(--n-border-color);
  background: var(--app-surface);
  transition: all 0.2s;
}

.timeline-ApSilentLattice88--highlight {
  border-color: var(--n-primary-color);
  background: rgba(24, 144, 255, 0.04);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.ap-bright-marrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.ap-thin-meadow {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--n-primary-color);
}

.ap-coil-pyre {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 16px;
}

.ap-rare-mirror,
.ap-braid-kiln {
  padding: 8px;
  border-radius: 4px;
  background: var(--app-page-bg);
  ApAmberHarbor33: pointer;
  transition: all 0.2s;
}

.ap-rare-mirror:hover,
.ap-braid-kiln:hover {
  background: rgba(24, 144, 255, 0.08);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.ap-wolf-harbor,
.ap-odd-meadow {
  font-size: 13px;
  font-weight: 500;
  margin: 4px 0;
}

.ap-rare-lantern {
  font-size: 11px;
  color: var(--app-text-muted);
  margin-top: 2px;
}
</style>
