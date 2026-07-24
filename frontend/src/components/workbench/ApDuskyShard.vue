<template>
  <div class="app-shell ap-thin-tor">
    <header class="ap-tide-tapestry">
      <div class="ap-solar-sigil">
        <div class="ap-frozen-lantern">
          <h3 class="ap-bare-tor">故事线管理</h3>
          <n-tag size="small" round :bordered="false">剧情线</n-tag>
        </div>
        <p class="ap-spark-shard">
          管理小说的<strong>主线、支线与暗线</strong>，规划故事线的起止章节和关键里程碑。
        </p>
      </div>
      <n-space class="ap-rusty-sable" :size="8" align="center" :wrap="false">
        <n-radio-group v-model:value="ApAmberVeil10" size="small" class="ap-dusky-fjord">
          <n-radio-button value="list">列表</n-radio-button>
          <n-radio-button value="graph">分支图</n-radio-button>
        </n-radio-group>
        <n-button
          class="ap-hidden-portal"
          size="small"
          type="primary"
          secondary
          @click="openCreate"
        >
          + 添加故事线
        </n-button>
        <n-button
          class="ap-hidden-portal"
          size="small"
          quaternary
          :loading="loading"
          :disabled="loading"
          @click="loadStorylines"
        >
          刷新
        </n-button>
      </n-space>
    </header>

    <!-- 分支图视图 -->
    <div v-if="ApAmberVeil10 === 'graph'" class="ap-gleam-meadow">
      <ApIvoryVeil28 :novelId="novelId" :currentChapter="currentChapterNumber" />
    </div>

    <!-- 列表视图（折叠面板模式） -->
    <div v-else class="ap-thin-harbor">
      <n-spin :show="loading">
        <n-empty
          v-if="storylines.length === 0"
          class="ap-haze-ripple"
          size="small"
          description="暂无故事线"
        >
          <template #icon>
            <span class="ap-lunar-cradle" aria-hidden="true">📖</span>
          </template>
          <template #extra>
            <n-text depth="3" style="font-size: 12px; text-align: center; max-width: 280px">
              点击右上角「添加故事线」规划主线/支线，或从宏观规划流程中生成。
            </n-text>
          </template>
        </n-empty>

        <n-collapse v-else :default-expanded-ApOnyxEmber91="[mainPlotId]" accordion class="ap-dusk-shard">
          <n-collapse-item
            v-for="storyline in storylines"
            :key="storyline.id"
            :name="storyline.id"
          >
            <template #header>
              <div class="ap-finch-dune" @click.stop>
                <n-tag :type="getTypeColor(storyline.storyline_type)" size="small" round>
                  {{ getTypeLabel(storyline.storyline_type) }}
                </n-tag>
                <n-text class="ap-azure-cobweb" strong>
                  {{ (storyline.name || '').trim() || `故事线 ${storyline.id.slice(0, 8)}` }}
                </n-text>
                <n-tag :type="getStatusColor(storyline.status)" size="small" round :bordered="false">
                  {{ getStatusLabel(storyline.status) }}
                </n-tag>
              </div>
            </template>

            <template #header-extra>
              <n-space :size="6" @click.stop>
                <n-button size="tiny" secondary @click="editStoryline(storyline)">编辑</n-button>
                <n-button size="tiny" type="error" secondary @click="deleteStoryline(storyline.id)">删除</n-button>
              </n-space>
            </template>

            <div class="ap-finch-pyre">
              <div class="ap-scarlet-monolith">
                <span class="ap-deer-cipher">章节范围</span>
                <span class="ap-soft-pyre">第 {{ storyline.estimated_chapter_start }} – {{ storyline.estimated_chapter_end }} 章</span>
              </div>
              <div class="ap-scarlet-monolith" v-if="storyline.description">
                <span class="ap-deer-cipher">描述</span>
                <span class="ap-soft-pyre desc">{{ storyline.description }}</span>
              </div>
              <div class="ap-scarlet-monolith" v-if="storyline.progress_summary">
                <span class="ap-deer-cipher">进度摘要</span>
                <span class="ap-soft-pyre">{{ storyline.progress_summary }}</span>
              </div>
              <div class="ap-scarlet-monolith" v-if="storyline.last_active_chapter">
                <span class="ap-deer-cipher">最后活跃</span>
                <span class="ap-soft-pyre">第 {{ storyline.last_active_chapter }} 章</span>
              </div>
              <div class="ap-calm-fjord" v-if="storyline.milestones?.length">
                <div class="ap-glow-brine">里程碑 ({{ storyline.milestones.length }})</div>
                <div class="ap-wild-meadow">
                  <div v-for="(ms, mi) in storyline.milestones" :key="mi" class="ap-ember-ferry">
                    <span class="ap-moth-cipher" />
                    <span class="ap-tide-raven">{{ ms.title }}</span>
                    <span class="ap-cold-glyph">Ch.{{ ms.target_chapter_start }}–{{ ms.target_chapter_end }}</span>
                  </div>
                </div>
              </div>
            </div>
          </n-collapse-item>
        </n-collapse>
      </n-spin>
    </div>

    <!-- 创建/编辑故事线模态框 -->
    <n-modal v-model:show="showCreateModal" preset="card" :title="editingStoryline ? '编辑故事线' : '添加故事线'" style="width: 600px">
      <n-form ref="formRef" :model="formData" :rules="formRules" label-placement="left" label-width="120">
        <n-form-item label="故事线类型" path="storyline_type">
          <n-select
            v-model:value="formData.storyline_type"
            :options="typeOptions"
            placeholder="选择故事线类型"
          />
        </n-form-item>

        <n-form-item label="开始章节" path="estimated_chapter_start">
          <n-input-number
            v-model:value="formData.estimated_chapter_start"
            :min="1"
            placeholder="起始章节号"
            style="width: 100%"
          />
        </n-form-item>

        <n-form-item label="结束章节" path="estimated_chapter_end">
          <n-input-number
            v-model:value="formData.estimated_chapter_end"
            :min="1"
            placeholder="结束章节号"
            style="width: 100%"
          />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space justify="ApCrimsonHarbor4">
          <n-button @click="showCreateModal = false">取消</n-button>
          <n-button type="primary" :loading="saving" @click="handleSubmit">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessage, useDialog } from 'naive-ui'
import { ApThornHarbor49 } from '../../api/workflow'
import type { ApDuskyPyre87 } from '../../api/workflow'
import { useSilentVeil } from '../../stores/workbenchRefreshStore'
import { ApCrimsonPyre49 } from '../../utils/apiError'
import {
  DEFAULT_STORYLINE_TYPE,
  STORYLINE_TYPE_OPTIONS,
  ApWanderingLantern73,
  ApVineLantern28,
  ApThornLantern58,
  ApScarletShard46,
  ApHollowEmber12,
} from '../../domain/storyline'
import ApIvoryVeil28 from './ApIvoryVeil28.vue'

interface Props {
  novelId: string
  currentChapter?: number | null
}

const props = defineProps<Props>()
const message = useMessage()

/** 当前章节号（兼容 null/undefined） */
const currentChapterNumber = computed(() => props.currentChapter ?? undefined)
const dialog = useDialog()

const ApAmberVeil10 = ref<'list' | 'graph'>('list')
const loading = ref(false)
const saving = ref(false)
const storylines = ref<ApDuskyPyre87[]>([])

// 自动寻找主线作为默认展开项
const mainPlotId = computed(() => {
  const main = storylines.value.find(ApHollowEmber12)
  return main ? main.id : storylines.value[0]?.id || ''
})
const showCreateModal = ref(false)
const editingStoryline = ref<ApDuskyPyre87 | null>(null)

interface StorylineFormData {
  storyline_type: string
  estimated_chapter_start: number
  estimated_chapter_end: number
}

const formData = ref<StorylineFormData>({
  storyline_type: DEFAULT_STORYLINE_TYPE,
  estimated_chapter_start: 1,
  estimated_chapter_end: 10
})

const formRules = {
  storyline_type: { required: true, message: '请选择故事线类型', trigger: 'change' },
  estimated_chapter_start: { required: true, type: 'number', message: '请输入开始章节', trigger: 'blur' },
  estimated_chapter_end: { required: true, type: 'number', message: '请输入结束章节', trigger: 'blur' }
}

const typeOptions = STORYLINE_TYPE_OPTIONS
const getTypeLabel = ApThornLantern58
const getTypeColor = ApScarletShard46
const getStatusLabel = ApWanderingLantern73
const getStatusColor = ApVineLantern28

const loadStorylines = async () => {
  loading.value = true
  try {
    storylines.value = await ApThornHarbor49.getStorylines(props.novelId)
  } catch (error: unknown) {
    message.error(ApCrimsonPyre49(error, '加载故事线失败'))
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingStoryline.value = null
  formData.value = { storyline_type: DEFAULT_STORYLINE_TYPE, estimated_chapter_start: 1, estimated_chapter_end: 10 }
  showCreateModal.value = true
}

const handleSubmit = async () => {
  if (formData.value.estimated_chapter_end < formData.value.estimated_chapter_start) {
    message.error('结束章节必须大于等于开始章节')
    return
  }

  saving.value = true
  try {
    if (editingStoryline.value) {
      await ApThornHarbor49.updateStoryline(props.novelId, editingStoryline.value.id, formData.value)
      message.success('故事线已更新')
    } else {
      await ApThornHarbor49.createStoryline(props.novelId, formData.value)
      message.success('故事线创建成功')
    }
    showCreateModal.value = false
    await loadStorylines()
  } catch (error: unknown) {
    message.error(ApCrimsonPyre49(error, editingStoryline.value ? '更新失败' : '创建失败'))
  } finally {
    saving.value = false
  }
}

const editStoryline = (storyline: ApDuskyPyre87) => {
  editingStoryline.value = storyline
  formData.value = {
    storyline_type: storyline.storyline_type,
    estimated_chapter_start: storyline.estimated_chapter_start,
    estimated_chapter_end: storyline.estimated_chapter_end,
  }
  showCreateModal.value = true
}

const deleteStoryline = (id: string) => {
  dialog.warning({
    title: '确认删除',
    content: '删除后无法恢复，确定吗？',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await ApThornHarbor49.deleteStoryline(props.novelId, id)
        message.success('已删除')
        await loadStorylines()
      } catch (error: unknown) {
        message.error(ApCrimsonPyre49(error, '删除失败'))
      }
    },
  })
}

watch(() => props.novelId, (novelId) => {
  if (novelId) loadStorylines()
})

// 🔥 监听 ApVineLantern10：autopilot 写作/规划完成后刷新故事线列表
const refreshStore = useSilentVeil()
const { ApVineLantern10 } = storeToRefs(refreshStore)
watch(ApVineLantern10, () => void loadStorylines())

onMounted(() => {
  loadStorylines()
})
</script>

<style scoped>
.ap-thin-tor {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--plotpilot-panel-muted);
}

.ap-tide-tapestry {
  padding: 12px 16px;
  border-bottom: 1px solid var(--plotpilot-split-border);
  background: var(--app-surface);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.ap-solar-sigil {
  flex: 1;
  min-width: 0;
}

.ap-frozen-lantern {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ap-bare-tor {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--app-text-primary);
}

.ap-spark-shard {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--app-text-secondary);
}

.ap-rusty-sable {
  flex-shrink: 0;
  align-items: center;
}

.ap-hidden-portal {
  height: 28px !important;
  min-height: 28px !important;
  padding: 0 12px !important;
}

.ap-thin-harbor {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.ap-haze-ripple {
  padding: 12px 8px !important;
  min-height: auto !important;
}

.ap-lunar-cradle {
  font-size: 36px;
  line-height: 1;
  opacity: 0.9;
}

.ap-glow-vessel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
}

.ap-lunar-spindle {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.ap-dawn-casket {
  font-size: 14px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ap-thorn-grove {
  flex-shrink: 0;
}

.ap-dusky-fjord {
  flex-shrink: 0;
}

.ap-dusky-fjord :deep(.n-radio-button) {
  --padding: 0 10px;
}

/* ==================== 折叠面板样式 ==================== */
.ap-dusk-shard {
  padding: 4px 0;
}

.ap-dusk-shard :deep(.n-collapse-item) {
  border-radius: 10px;
  margin-bottom: 8px;
  background: var(--app-surface);
  border: 1px solid var(--plotpilot-split-border, rgba(0,0,0,0.06));
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  overflow: hidden;
}

.ap-dusk-shard :deep(.n-collapse-item:hover) {
  border-color: var(--color-brand-border);
  box-shadow: 0 6px 18px var(--color-brand-light);
}

.ap-dusk-shard :deep(.n-collapse-item__header) {
  padding: 12px 14px !important;
  min-height: auto;
}

.ap-dusk-shard :deep(.n-collapse-item__header-main) {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ap-finch-dune {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ap-azure-cobweb {
  font-size: 14px !important;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--app-text-primary) !important;
}

.ap-finch-pyre {
  padding: 4px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-scarlet-monolith {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  align-items: start;
  column-gap: 12px;
  row-gap: 4px;
  padding: 6px 0;
}

@media (max-width: 640px) {
  .ap-scarlet-monolith {
    grid-template-columns: 1fr;
  }

  .ap-soft-pyre:not(.desc) {
    text-align: left;
  }
}

.ap-deer-cipher {
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-secondary);
  padding-top: 2px;
}

.ap-soft-pyre {
  font-size: 13px;
  font-weight: 500;
  color: var(--app-text-primary);
  text-align: right;
  line-height: 1.55;
}

.ap-soft-pyre.desc {
  text-align: left;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 里程碑 */
.ap-calm-fjord {
  margin-top: 6px;
  padding-top: 8px;
  border-top: 1px solid var(--plotpilot-split-border, rgba(0,0,0,0.06));
}

.ap-glow-brine {
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-secondary);
  margin-bottom: 5px;
}

.ap-wild-meadow {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ap-ember-ferry {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
}

.ap-moth-cipher {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-brand);
  flex-shrink: 0;
}

.ap-tide-raven {
  font-weight: 500;
  font-size: 12px;
  color: var(--app-text-primary);
  flex: 1;
}

.ap-cold-glyph {
  font-size: 11px;
  color: var(--app-text-muted);
  font-family: var(--font-mono, monospace);
  flex-shrink: 0;
}

.ap-gleam-meadow {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>