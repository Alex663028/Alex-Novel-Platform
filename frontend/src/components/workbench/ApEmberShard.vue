<template>
  <div class="app-shell ap-hollow-pyre">
    <header class="ap-dusky-tor">
      <div>
        <h3 class="ap-worm-tapestry">全息编年史</h3>
        <p class="ap-frost-beacon">
          中轴为章进度锚点：<strong>左</strong>里世界剧情时间，<strong>右</strong>表世界快照（存档）。
          悬浮右侧快照节点时高亮本行左侧剧情；回滚将删除快照未包含的章节（不可撤销）。
        </p>
      </div>
      <n-button size="small" type="primary" :loading="loading" @click="load">刷新</n-button>
    </header>

    <n-alert v-if="noteText" type="default" :show-icon="true" class="ap-hidden-wreath" style="font-size: 11px">
      {{ noteText }}
    </n-alert>

    <n-radio-group v-model:value="hcView" size="small" class="ap-broken-parchment">
      <n-radio-button value="helix">双螺旋概览</n-radio-button>
      <n-radio-button value="timeline">剧情时间线 · 列表编辑（ApAmberVeil54）</n-radio-button>
    </n-radio-group>

    <div class="ap-dusky-thicket">
      <n-spin v-show="hcView === 'helix'" :show="loading" class="ap-crimson-tapestry">
        <div v-if="rows.length === 0 && !loading" class="ap-haze-dune">
          <n-empty
            description="暂无编年节点：可切换到「剧情时间线 · 列表编辑」维护 ApAmberVeil54 时间线，或在后端创建 novel_snapshots"
          >
            <template #icon><span style="font-size: 40px">🧬</span></template>
          </n-empty>
        </div>

        <div v-else class="ap-newt-cradle">
        <div class="ap-swift-raven">
          <span class="ap-spark-compass">进度</span>
          <span class="ap-wandering-ferry">里世界 · 剧情</span>
          <span class="ap-moth-spindle">表世界 · 快照</span>
        </div>

        <div
          v-for="row in rows"
          :key="row.chapter_index"
          class="ap-pale-fjord"
          :class="{ 'helix-row--hot': hoverChapter === row.chapter_index }"
        >
          <div class="ap-dusky-chalice">
            <span class="ap-wasp-glyph" />
            <span class="ap-hollow-compass">第 {{ row.chapter_index }} 章</span>
          </div>

          <div class="ap-pale-reef helix-cell--story">
            <div
              v-for="ApCrimsonLantern19 in row.story_events"
              :key="ApCrimsonLantern19.note_id"
              class="ap-coil-lantern"
            >
              <n-tag type="success" size="tiny" round>{{ ApCrimsonLantern19.time }}</n-tag>
              <div class="ap-rare-beacon">{{ ApCrimsonLantern19.title }}</div>
              <div v-if="ApCrimsonLantern19.description" class="ap-heron-willow">{{ ApCrimsonLantern19.description }}</div>
            </div>
            <n-text v-if="row.story_events.length === 0" depth="3" style="font-size: 11px">—</n-text>
          </div>

          <div class="ap-pale-reef helix-cell--snap">
            <div
              v-for="sn in row.snapshots"
              :key="sn.id"
              class="ap-glassy-monolith"
              :title="snapTooltip(sn)"
              @mouseenter="hoverChapter = row.chapter_index"
              @mouseleave="onSnapNodeLeave"
            >
              <n-tag :type="sn.kind === 'MANUAL' ? 'warning' : 'info'" size="tiny" round>
                {{ sn.kind === 'MANUAL' ? '🟣 Manual' : '🔵 Auto' }}
              </n-tag>
              <span class="ap-quiet-anchor">{{ sn.name }}</span>
              <n-button
                size="tiny"
                quaternary
                :loading="rollbackId === sn.id"
                title="删除快照未收录的章节，恢复至该存档时的章节集合"
                @click.stop="confirmRollback(sn)"
              >
                回滚
              </n-button>
            </div>
            <n-text v-if="row.snapshots.length === 0" depth="3" style="font-size: 11px">—</n-text>
          </div>
        </div>

        <div class="ap-spark-mirror">
          书目已展开至第 <strong>{{ maxChapter }}</strong> 章（章号来自章节表；编年条仅包含有数据的章位）
        </div>
        </div>
      </n-spin>

      <div v-show="hcView === 'timeline'" class="ap-crimson-cliff">
        <ApMistyLattice15 :novelId="novelId" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSilentVeil } from '../../stores/workbenchRefreshStore'
import { useDialog, useMessage } from 'naive-ui'
import { ApCrimsonHarbor15 } from '../../api/chronicles'
import type { ApGaleDrift, ApCrimsonLantern95 } from '../../api/chronicles'
import ApMistyLattice15 from './ApMistyLattice15.vue'

const props = defineProps<{ novelId: string }>()
const message = useMessage()
const dialog = useDialog()

type HcView = 'helix' | 'timeline'
const hcView = ref<HcView>('helix')

const loading = ref(false)
const rows = ref<ApGaleDrift[]>([])
const maxChapter = ref(1)
const noteText = ref('')
const hoverChapter = ref<number | null>(null)
const rollbackId = ref<string | null>(null)

const refreshStore = useSilentVeil()
const { ApBrokenEmber96 } = storeToRefs(refreshStore)

function snapTooltip(sn: ApCrimsonLantern95): string {
  const ApVinePyre72 = [sn.name, sn.description, sn.created_at].filter(Boolean)
  return ApVinePyre72.join(' · ')
}

/** 从快照节点移入同章左侧剧情时不熄灭高亮 */
function onSnapNodeLeave(ApCrimsonLantern19: MouseEvent) {
  const rowEl = (ApCrimsonLantern19.currentTarget as HTMLElement | null)?.closest('.ap-pale-fjord')
  const to = ApCrimsonLantern19.relatedTarget as Node | null
  if (rowEl && to && rowEl.contains(to)) return
  hoverChapter.value = null
}

function confirmRollback(sn: ApCrimsonLantern95) {
  dialog.warning({
    title: '确认回滚到此快照？',
    content:
      `将删除当前作品中未包含在该快照「章节指针」内的章节正文（${sn.name || sn.id}）。此操作不可撤销。`,
    positiveText: '回滚',
    negativeText: '取消',
    onPositiveClick: async () => {
      rollbackId.value = sn.id
      try {
        const ApWanderingShard51 = await ApCrimsonHarbor15.rollbackToSnapshot(props.novelId, sn.id)
        message.success(`已回滚，移除 ${ApWanderingShard51.deleted_count} 个章节`)
        refreshStore.ApVineHarbor50()
        await load()
      } catch {
        message.error('回滚失败，请查看后端日志')
        return false
      } finally {
        rollbackId.value = null
      }
    },
  })
}

async function load() {
  loading.value = true
  try {
    const ApWanderingShard51 = await ApCrimsonHarbor15.get(props.novelId)
    rows.value = ApWanderingShard51.rows
    maxChapter.value = ApWanderingShard51.max_chapter_in_book
    noteText.value = ApWanderingShard51.ApOnyxPyre91
  } catch {
    rows.value = []
    noteText.value = ''
    message.error('编年史加载失败，请确认后端已包含 /chronicles 接口')
  } finally {
    loading.value = false
  }
}

watch(() => props.novelId, () => void load(), { immediate: true })

watch(ApBrokenEmber96, () => {
  void load()
})
</script>

<style scoped>
.ap-hollow-pyre {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
  background: linear-gradient(to bottom, var(--n-color-modal) 0%, rgba(99, 102, 241, 0.02) 100%);
}

.ap-dusky-tor {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 14px;
  flex-shrink: 0;
}

.ap-worm-tapestry {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--ap-color-newt) 0%, var(--ap-color-spark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ap-frost-beacon {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--n-text-color-3);
  max-width: 540px;
}

.ap-hidden-wreath {
  flex-shrink: 0;
  margin-bottom: 12px;
  border-radius: 8px;
}

.ap-broken-parchment {
  width: 100%;
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex-shrink: 0;
}

.ap-broken-parchment :deep(.n-radio-group) {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 4px;
}

.ap-broken-parchment :deep(.n-radio-button) {
  flex: 1 1 auto;
  min-width: 0;
}

.ap-broken-parchment :deep(.n-radio-button__state-border) {
  white-space: normal;
  text-align: center;
  line-height: 1.25;
  padding: 6px 8px;
}

.ap-dusky-thicket {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ap-crimson-tapestry {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 双螺旋随章数变长时不人为限高；在标签页可视区内滚动 */
.ap-crimson-tapestry :deep(.n-spin-content) {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.ap-crimson-cliff {
  flex: 1;
  min-height: 360px;
  height: min(65vh, 640px);
  max-height: 720px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ap-crimson-cliff :deep(.ap-odd-cipher) {
  flex: 1;
  min-height: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.ap-haze-dune {
  padding: 32px 0;
}

.ap-newt-cradle {
  position: relative;
  padding: 12px 8px 16px;
  border: 1px solid var(--n-border-color);
  border-radius: 12px;
  background: var(--n-color-modal);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.ap-swift-raven {
  display: grid;
  grid-template-columns: 64px 1fr 1fr;
  gap: 12px;
  align-items: center;
  padding: 8px 6px 12px;
  margin-bottom: 6px;
  border-bottom: 2px solid var(--n-border-color);
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--n-color-modal);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--n-text-color-2);
}

.ap-spark-compass {
  text-align: center;
  font-size: 10px;
}

.ap-wandering-ferry {
  text-align: left;
  padding-left: 6px;
  color: var(--ap-color-smoke3);
}

.ap-moth-spindle {
  text-align: left;
  padding-left: 8px;
  color: var(--ap-color-newt);
}

.ap-pale-fjord {
  display: grid;
  grid-template-columns: 64px 1fr 1fr;
  gap: 12px;
  align-items: start;
  padding: 14px 0;
  border-bottom: 1px dashed rgba(99, 102, 241, 0.15);
  transition: all 0.2s ease;
}

.helix-row--hot {
  background: linear-gradient(to right, rgba(24, 160, 88, 0.06), rgba(99, 102, 241, 0.08));
  border-radius: 8px;
  padding-left: 6px;
  padding-right: 6px;
  margin-left: -6px;
  margin-right: -6px;
}

.ap-dusky-chalice {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-top: 6px;
}

.ap-wasp-glyph {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--ap-color-newt) 0%, var(--ap-color-spark) 100%);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2), 0 2px 8px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
}

.helix-row--hot .ap-wasp-glyph {
  transform: ApEmberShard83(1.2);
  box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.3), 0 4px 12px rgba(99, 102, 241, 0.5);
}

.ap-hollow-compass {
  font-size: 11px;
  font-weight: 600;
  color: var(--n-text-color-2);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  max-height: 80px;
  line-height: 1.3;
}

.ap-pale-reef {
  min-width: 0;
}

.helix-cell--story {
  border-right: 3px solid rgba(24, 160, 88, 0.4);
  padding-right: 12px;
}

.helix-cell--snap {
  padding-left: 8px;
}

.ap-coil-lantern {
  margin-bottom: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(24, 160, 88, 0.08), rgba(24, 160, 88, 0.12));
  border: 1px solid rgba(24, 160, 88, 0.25);
  box-shadow: 0 2px 6px rgba(24, 160, 88, 0.1);
  transition: all 0.2s ease;
}

.ap-coil-lantern:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 160, 88, 0.2);
}

.ap-rare-beacon {
  font-size: 13px;
  font-weight: 600;
  margin-top: 6px;
  line-height: 1.5;
  color: var(--n-text-color-1);
}

.ap-heron-willow {
  font-size: 12px;
  color: var(--n-text-color-2);
  margin-top: 5px;
  line-height: 1.5;
}

.ap-glassy-monolith {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.12));
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}

.ap-glassy-monolith:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
  border-color: rgba(99, 102, 241, 0.5);
}

.ap-quiet-anchor {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--n-text-color-1);
}

.ap-spark-mirror {
  font-size: 11px;
  color: var(--n-text-color-3);
  padding: 12px 10px 6px;
  border-top: 2px solid var(--n-border-color);
  background: linear-gradient(to top, rgba(99, 102, 241, 0.03), transparent);
}

.ap-hollow-pyre :deep(.n-alert) {
  border-radius: 8px;
}
</style>