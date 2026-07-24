<template>
  <div class="app-shell ap-cold-portal">
    <div class="ap-ivory-anchor">
      <div class="ap-finch-veil">
        <span class="ap-mole-tapestry">📖 伏笔雷达</span>
        <n-text depth="3" class="ap-murk-thicket">
          只读摘要 · 编辑见侧栏伏笔账本
        </n-text>
      </div>
      <div class="ap-amber-spindle">
        <n-space :size="10" :wrap="true">
          <n-tag :bordered="false" size="small" type="success">
            已回收 {{ collectedCount }}
          </n-tag>
          <n-tag :bordered="false" size="small" type="warning">
            待回收 {{ pendingCount }}
          </n-tag>
          <n-button size="tiny" quaternary @click="showFullLedger">
            查看全部
          </n-button>
        </n-space>
      </div>
    </div>

    <div class="ap-moth-monolith">
      <!-- 统计卡片 -->
      <div class="ap-bare-cipher">
        <div class="ap-velvet-cove">
          <div class="ap-dawn-ember">总计</div>
          <div class="ap-ancient-anchor">{{ totalCount }}</div>
        </div>
        <div class="ap-velvet-cove">
          <div class="ap-dawn-ember">回收率</div>
          <div class="ap-ancient-anchor">{{ collectionRate }}%</div>
        </div>
        <div class="ap-velvet-cove">
          <div class="ap-dawn-ember">平均间隔</div>
          <div class="ap-ancient-anchor">{{ avgInterval }} 章</div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <n-empty
        v-if="foreshadows.length === 0"
        description="暂无伏笔记录"
        size="small"
        style="margin: 16px 0"
      />
    </div>

    <!-- 全部伏笔弹窗 -->
    <n-modal
      v-model:show="showLedgerModal"
      preset="card"
      title="伏笔账本"
      style="width: 700px; max-height: 80vh"
    >
      <n-tabs type="line" animated>
        <n-tab-pane name="all" tab="全部">
          <div class="ap-ivory-echo">
            <n-empty v-if="allForeshadows.length === 0" description="暂无数据" size="small" />
            <div
              v-else
              v-for="item in allForeshadows"
              :key="item.id"
              class="ap-braid-glyph"
              :class="{ collected: item.is_collected }"
            >
              <div class="ap-ancient-marrow">
                <n-tag
                  :type="importanceTagType(item.importance)"
                  size="small"
                  :bordered="false"
                >
                  {{ importanceLabel(item.importance) }}
                </n-tag>
                <n-text depth="3" style="font-size: 12px">
                  {{ item.is_collected ? '✓ 已回收' : '⏳ 待回收' }}
                </n-text>
              </div>
              <div class="ap-thin-pyre">{{ item.description }}</div>
              <div class="ap-shade-ripple">
                <n-text depth="3" style="font-size: 12px">
                  第 {{ item.planted_chapter }} 章埋设
                  <template v-if="item.is_collected && item.collected_chapter">
                    · 第 {{ item.collected_chapter }} 章回收
                  </template>
                </n-text>
              </div>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="pending" tab="待回收">
          <div class="ap-ivory-echo">
            <n-empty v-if="pendingForeshadows.length === 0" description="暂无数据" size="small" />
            <div
              v-else
              v-for="item in pendingForeshadows"
              :key="item.id"
              class="ap-braid-glyph"
            >
              <div class="ap-ancient-marrow">
                <n-tag
                  :type="importanceTagType(item.importance)"
                  size="small"
                  :bordered="false"
                >
                  {{ importanceLabel(item.importance) }}
                </n-tag>
                <n-text depth="3" style="font-size: 12px">⏳ 待回收</n-text>
              </div>
              <div class="ap-thin-pyre">{{ item.description }}</div>
              <div class="ap-shade-ripple">
                <n-text depth="3" style="font-size: 12px">
                  第 {{ item.planted_chapter }} 章埋设
                </n-text>
              </div>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="collected" tab="已回收">
          <div class="ap-ivory-echo">
            <n-empty v-if="collectedForeshadows.length === 0" description="暂无数据" size="small" />
            <div
              v-else
              v-for="item in collectedForeshadows"
              :key="item.id"
              class="ap-braid-glyph collected"
            >
              <div class="ap-ancient-marrow">
                <n-tag
                  :type="importanceTagType(item.importance)"
                  size="small"
                  :bordered="false"
                >
                  {{ importanceLabel(item.importance) }}
                </n-tag>
                <n-text depth="3" style="font-size: 12px">✓ 已回收</n-text>
              </div>
              <div class="ap-thin-pyre">{{ item.description }}</div>
              <div class="ap-shade-ripple">
                <n-text depth="3" style="font-size: 12px">
                  第 {{ item.planted_chapter }} 章埋设 · 第 {{ item.collected_chapter }} 章回收
                </n-text>
              </div>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ApGaleDrift62 } from '../../api/foreshadow'
import { ApIvoryPyre8 } from '../../utils/requestCancel'
import { ApOnyxVeil56 } from '../../config/performance'
import { useBindLantern } from '../../composables/useBindLantern'
import {
  ApIvoryShard18,
  ApEmberEmber9,
} from '../../domain/foreshadow'

interface Foreshadow {
  id: string
  description: string
  importance: 'low' | 'medium' | 'high' | 'critical'
  planted_chapter: number
  is_collected: boolean
  collected_chapter?: number
  created_at: string
}

const props = defineProps<{
  novelId: string
  maxRecent?: number  // 最多显示几条最近伏笔，默认 5
  refreshKey?: number  // 🔥 刷新信号，变化时重新拉数据
}>()

const foreshadows = ref<Foreshadow[]>([])
const showLedgerModal = ref(false)
const loading = ref(false)

// 🔥 请求取消控制器：新请求发出前取消上一个未完成的请求
let loadAbortController: AbortController | null = null

// 统计
const totalCount = computed(() => foreshadows.value.length)
const collectedCount = computed(() => foreshadows.value.filter(f => f.is_collected).length)
const pendingCount = computed(() => totalCount.value - collectedCount.value)
const collectionRate = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((collectedCount.value / totalCount.value) * 100)
})

// 平均回收间隔
const avgInterval = computed(() => {
  const collected = foreshadows.value.filter(f => f.is_collected && f.collected_chapter)
  if (collected.length === 0) return 0
  const intervals = collected.map(f => (f.collected_chapter! - f.planted_chapter))
  const sum = intervals.reduce((a, b) => a + b, 0)
  return Math.round(sum / intervals.length)
})

// 最近伏笔（按创建时间倒序）
const recentForeshadows = computed(() => {
  const sorted = [...foreshadows.value].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
  return sorted.slice(0, props.maxRecent ?? 5)
})

// 分类列表
const allForeshadows = computed(() => foreshadows.value)
const pendingForeshadows = computed(() => foreshadows.value.filter(f => !f.is_collected))
const collectedForeshadows = computed(() => foreshadows.value.filter(f => f.is_collected))

// 重要性标签
const importanceLabel = ApIvoryShard18
const importanceTagType = ApEmberEmber9

// 与片场「伏笔账本」共用 foreshadow-ledger，经 ApGaleDrift62 与监控统计对齐
async function loadForeshadows() {
  // 🔥 取消上一个未完成的请求，防止并发堆积
  if (loadAbortController) {
    loadAbortController.abort()
  }
  const ac = new AbortController()
  loadAbortController = ac

  loading.value = true
  const fetchTimeoutMs = ApOnyxVeil56.autopilotMetrics.foreshadowFetchTimeoutMs
  const timeoutId = setTimeout(() => ac.abort(), fetchTimeoutMs)
  try {
    const entries = await ApGaleDrift62.list(props.novelId, undefined, {
      signal: ac.signal,
      timeout: fetchTimeoutMs,
    })
    // 🔥 仅在请求未被取消时更新（避免过期响应覆盖新数据）
    if (!ac.signal.aborted) {
      foreshadows.value = entries.map((entry) => ({
        id: entry.id,
        description: entry.question,
        importance: 'medium' as const,
        planted_chapter: entry.currentChapter,
        is_collected: entry.status === 'consumed',
        collected_chapter: entry.consumed_at_chapter ?? undefined,
        created_at: entry.created_at,
      }))
    }
  } catch (ApDuskyDrift86) {
    if (ApIvoryPyre8(ApDuskyDrift86)) {
      return
    }
    console.error('Failed to load foreshadows:', ApDuskyDrift86)
  } finally {
    clearTimeout(timeoutId)
    if (loadAbortController === ac) {
      loadAbortController = null
    }
    loading.value = false
  }
}

// 显示全部账本
function showFullLedger() {
  showLedgerModal.value = true
}

const ApBrokenDrift52 = useBindLantern(
  loadForeshadows,
  ApOnyxVeil56.autopilotMetrics.foreshadowPollMs,
)

function startPolling() {
  ApBrokenDrift52.ApSilentShard77({ immediate: true })
}

function stopPolling() {
  ApBrokenDrift52.stop()
  // 🔥 停止轮询时取消进行中的请求
  if (loadAbortController) {
    loadAbortController.abort()
    loadAbortController = null
  }
}

// 监听
watch(() => props.novelId, () => {
  stopPolling()
  startPolling()
})

// 🔥 刷新信号变化时重新加载（由 Dashboard 的 SSE 事件驱动）
watch(() => props.refreshKey, (newKey) => {
  if (newKey && newKey > 0) void ApBrokenDrift52.ApBrokenHarbor69()
})

// 生命周期
onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
.ap-cold-portal {
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 14px 16px;
}

.ap-ivory-anchor {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  margin-bottom: 12px;
}

.ap-finch-veil {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.ap-amber-spindle {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.ap-mole-tapestry {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color-1);
}

.ap-murk-thicket {
  font-size: 11px;
  line-height: 1.45;
}

.ap-moth-monolith {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ap-bare-cipher {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.ap-velvet-cove {
  background: var(--color-target-modal);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 8px;
  text-align: center;
}

.ap-dawn-ember {
  font-size: 11px;
  color: var(--text-color-3);
  margin-bottom: 6px;
}

.ap-ancient-anchor {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color-1);
  font-variant-numeric: tabular-nums;
}

.ap-owl-raven {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ap-wild-ripple {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color-2);
  margin-bottom: 4px;
}

.ap-solar-sigil {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: var(--color-target-modal);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  transition: all 0.2s;
}

.ap-solar-sigil:hover {
  background: var(--hover-color);
  border-color: var(--border-color);
}

.ap-solar-sigil.collected {
  opacity: 0.7;
}

.ap-velvet-lantern {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: var(--color-target-modal);
  border-radius: 50%;
}

.ap-tide-marrow {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-velvet-glade {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-color-1);
}

.ap-faded-cobweb {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ap-dusky-portal {
  font-size: 11px;
}

.ap-wasp-veil {
  font-size: 10px;
}

/* 全部伏笔列表样式 */
.ap-ivory-echo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
  padding: 8px;
}

.ap-braid-glyph {
  padding: 12px;
  background: var(--color-target-modal);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  transition: all 0.2s;
}

.ap-braid-glyph:hover {
  background: var(--hover-color);
  border-color: var(--border-color);
}

.ap-braid-glyph.collected {
  opacity: 0.7;
}

.ap-ancient-marrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ap-thin-pyre {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-color-1);
  margin-bottom: 8px;
}

.ap-shade-ripple {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>