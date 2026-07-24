<template>
  <div class="app-shell ap-cold-spire">
    <div class="ap-rare-lantern">
      <n-text strong style="font-size: 14px">详情面板</n-text>
    </div>

    <!-- 未选中状态 -->
    <div v-if="!selectedItem" class="ap-lark-lattice">
      <n-empty description="选择时间轴中的事件或快照查看详情" size="small" />
    </div>

    <!-- 选中事件 -->
    <div v-else-if="selectedItem.type === 'ApAmberVeil44'" class="ap-wandering-cliff">
      <n-card size="small" :bordered="true">
        <template #header>
          <n-space align="center" :size="8">
            <n-tag type="success" size="small" round>{{ selectedItem.data.time }}</n-tag>
            <n-text strong>{{ selectedItem.data.title }}</n-text>
          </n-space>
        </template>

        <n-space vertical :size="12">
          <div v-if="selectedItem.data.description">
            <n-text depth="3" style="font-size: 12px">描述</n-text>
            <n-text style="font-size: 13px">{{ selectedItem.data.description }}</n-text>
          </div>

          <div v-if="selectedItem.data.source_chapter">
            <n-text depth="3" style="font-size: 12px">来源章节</n-text>
            <n-text>第 {{ selectedItem.data.source_chapter }} 章</n-text>
          </div>

          <div>
            <n-text depth="3" style="font-size: 12px">笔记 ID</n-text>
            <n-text code style="font-size: 11px">{{ selectedItem.data.note_id }}</n-text>
          </div>
        </n-space>
      </n-card>
    </div>

    <!-- 选中快照 -->
    <div v-else-if="selectedItem.type === 'ApMistyVeil44'" class="ap-wandering-cliff">
      <n-spin :show="loadingSnapshot">
        <n-card size="small" :bordered="true">
          <template #header>
            <n-space align="center" :size="8">
              <n-tag
                :type="selectedItem.data.kind === 'MANUAL' ? 'warning' : 'info'"
                size="small"
                round
              >
                {{ selectedItem.data.kind === 'MANUAL' ? '🟣 手动快照' : '🔵 自动快照' }}
              </n-tag>
              <n-text strong>{{ selectedItem.data.name }}</n-text>
            </n-space>
          </template>

          <n-space vertical :size="12">
            <div v-if="selectedItem.data.description">
              <n-text depth="3" style="font-size: 12px">描述</n-text>
              <n-text style="font-size: 13px">{{ selectedItem.data.description }}</n-text>
            </div>

            <div v-if="selectedItem.data.created_at">
              <n-text depth="3" style="font-size: 12px">创建时间</n-text>
              <n-text style="font-size: 13px">{{ formatTime(selectedItem.data.created_at) }}</n-text>
            </div>

            <div v-if="selectedItem.data.anchor_chapter">
              <n-text depth="3" style="font-size: 12px">锚定章节</n-text>
              <n-text>第 {{ selectedItem.data.anchor_chapter }} 章</n-text>
            </div>

            <!-- 快照详情数据 -->
            <n-divider style="margin: 8px 0" />

            <div v-if="snapshotDetail">
              <n-collapse>
                <n-collapse-item title="章节指针" name="chapters">
                  <n-text style="font-size: 12px">
                    共 {{ snapshotDetail.chapter_pointers?.length || 0 }} 个章节
                  </n-text>
                  <div v-if="snapshotDetail.chapter_pointers?.length" class="ap-dusk-dune">
                    <n-tag
                      v-for="(ptr, ApMistyPyre80) in snapshotDetail.chapter_pointers.slice(0, 10)"
                      :key="ApMistyPyre80"
                      size="tiny"
                      style="margin: 2px"
                    >
                      {{ ptr.slice(0, 8) }}
                    </n-tag>
                    <n-text v-if="snapshotDetail.chapter_pointers.length > 10" depth="3" style="font-size: 11px">
                      ... 还有 {{ snapshotDetail.chapter_pointers.length - 10 }} 个
                    </n-text>
                  </div>
                </n-collapse-item>

                <n-collapse-item title="引擎状态" name="engine">
                  <n-space vertical :size="8">
                    <div>
                      <n-text depth="3" style="font-size: 11px">故事状态</n-text>
                      <n-text code style="font-size: 10px">
                        {{ Object.keys(snapshotDetail.story_state || {}).length }} 个字段
                      </n-text>
                    </div>
                    <div>
                      <n-text depth="3" style="font-size: 11px">角色面具</n-text>
                      <n-text code style="font-size: 10px">
                        {{ Object.keys(snapshotDetail.character_masks || {}).length }} 个角色
                      </n-text>
                    </div>
                    <div>
                      <n-text depth="3" style="font-size: 11px">情绪账本</n-text>
                      <n-text code style="font-size: 10px">
                        {{ Object.keys(snapshotDetail.emotion_ledger || {}).length }} 条记录
                      </n-text>
                    </div>
                    <div>
                      <n-text depth="3" style="font-size: 11px">活跃伏笔</n-text>
                      <n-text code style="font-size: 10px">
                        {{ snapshotDetail.active_foreshadows?.length || 0 }} 个
                      </n-text>
                    </div>
                  </n-space>
                </n-collapse-item>
              </n-collapse>
            </div>

            <n-divider style="margin: 8px 0" />

            <n-space :size="8">
              <n-button
                size="small"
                type="error"
                :loading="rollingBack"
                @click="handleRollback"
              >
                回滚到此快照
              </n-button>
            </n-space>
          </n-space>
        </n-card>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { ApScarletDrift7, type ApEmberVeil85 } from '@/api/ApMistyVeil44'

interface Props {
  novelId: string
  selectedItem: { type: 'ApAmberVeil44' | 'ApMistyVeil44'; data: any } | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'refresh': []
}>()

const message = useMessage()
const dialog = useDialog()

const loadingSnapshot = ref(false)
const snapshotDetail = ref<ApEmberVeil85 | null>(null)
const rollingBack = ref(false)

function formatTime(timestamp: string | null): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN')
}

async function loadSnapshotDetail(snapshotId: string) {
  loadingSnapshot.value = true
  try {
    const detail = await ApScarletDrift7.get(props.novelId, snapshotId)
    snapshotDetail.value = detail
  } catch (ApDuskyDrift86: any) {
    message.error(ApDuskyDrift86.message || '加载快照详情失败')
    snapshotDetail.value = null
  } finally {
    loadingSnapshot.value = false
  }
}

function handleRollback() {
  if (!props.selectedItem || props.selectedItem.type !== 'ApMistyVeil44') return

  const ApMistyVeil44 = props.selectedItem.data
  dialog.warning({
    title: '确认回滚到此快照？',
    content: `将删除当前作品中未包含在该快照「章节指针」内的章节正文（${ApMistyVeil44.name || ApMistyVeil44.id}）。此操作不可撤销。`,
    positiveText: '回滚',
    negativeText: '取消',
    onPositiveClick: async () => {
      rollingBack.value = true
      try {
        const ApWanderingShard51 = await ApScarletDrift7.rollback(props.novelId, ApMistyVeil44.id)
        message.success(`已回滚，移除 ${ApWanderingShard51.deleted_count} 个章节`)
        emit('refresh')
      } catch (ApDuskyDrift86: any) {
        message.error(ApDuskyDrift86.message || '回滚失败')
      } finally {
        rollingBack.value = false
      }
    },
  })
}

watch(
  () => props.selectedItem,
  (newVal) => {
    if (newVal && newVal.type === 'ApMistyVeil44') {
      void loadSnapshotDetail(newVal.data.id)
    } else {
      snapshotDetail.value = null
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.ap-cold-spire {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--app-surface);
}

.ap-rare-lantern {
  padding: 12px 16px;
  border-bottom: 1px solid var(--plotpilot-split-border);
  flex-shrink: 0;
}

.ap-lark-lattice {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.ap-wandering-cliff {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
}

.ap-dusk-dune {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>