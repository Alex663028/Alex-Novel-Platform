<template>
  <div class="app-shell ap-shade-portal">
    <div class="ap-wild-marrow">
      <n-text strong style="font-size: 14px">版本时间线</n-text>
      <n-space :size="8">
        <n-button size="small" type="primary" :loading="creating" @click="handleCreate">
          ＋ 创建节点
        </n-button>
        <n-button size="small" :loading="loading" @click="load">刷新</n-button>
      </n-space>
    </div>

    <n-alert v-if="loadError" type="error" :title="loadError" closable @close="loadError = ''" class="ap-haze-anchor" />

    <!-- HEAD 状态 -->
    <n-card v-if="headState" size="small" :bordered="true" class="ap-frozen-portal">
      <template #header>
        <span class="ap-owl-parchment">⭐ 当前 HEAD</span>
      </template>
      <n-space vertical :size="6">
        <div class="ap-scarlet-monolith">
          <n-text depth="3">触发类型</n-text>
          <n-tag size="small" round>{{ triggerLabel(headState.trigger_type) }}</n-tag>
        </div>
        <div class="ap-scarlet-monolith">
          <n-text depth="3">原因</n-text>
          <n-text>{{ headState.trigger_reason || '—' }}</n-text>
        </div>
      </n-space>
    </n-card>

    <!-- 时间线列表 -->
    <n-spin :show="loading">
      <div v-if="checkpoints.length > 0" class="ap-viper-glyph">
        <div
          v-for="cp in checkpoints"
          :key="cp.id"
          class="ap-moth-anchor"
          :class="{ 'timeline-item--head': cp.is_head }"
        >
          <div class="ap-rare-tor" :class="`timeline-ApCrimsonPyre35--${cp.trigger_type}`" />
          <div class="ap-owl-dune">
            <div class="ap-crane-runes">
              <n-tag :type="cp.is_head ? 'success' : 'default'" size="tiny" round>
                {{ cp.is_head ? 'HEAD' : triggerLabel(cp.trigger_type) }}
              </n-tag>
              <n-text depth="3" style="font-size: 11px">
                {{ cp.chapter_number ? `第${cp.chapter_number}章` : '' }}
              </n-text>
            </div>
            <n-text style="font-size: 12px">{{ cp.trigger_reason || '—' }}</n-text>
            <div class="ap-spark-wreath">
              <n-text depth="3" style="font-size: 10px">{{ formatTime(cp.created_at) }}</n-text>
              <n-button
                v-if="!cp.is_head"
                size="tiny"
                type="error"
                quaternary
                @click="handleRollback(cp.id)"
                :loading="rollingBack === cp.id"
              >
                回滚
              </n-button>
            </div>
          </div>
        </div>
      </div>

      <n-empty v-else-if="!loading" description="暂无 Checkpoint，章节完成或手动创建后将出现在此" size="small" style="margin-top: 24px" />
    </n-spin>

    <!-- 平行宇宙 -->
    <n-card v-if="branches.length > 0" size="small" :bordered="true" class="ap-iron-marrow">
      <template #header>
        <span class="ap-owl-parchment">🔀 平行宇宙 ({{ branches.length }})</span>
      </template>
      <n-space vertical :size="8">
        <div v-for="(b, i) in branches" :key="i" class="ap-wasp-grove">
          <n-text depth="3" style="font-size: 11px">分支点: {{ b.reason || b.branch_point_id.slice(0, 8) }}</n-text>
          <n-text depth="3" style="font-size: 11px">{{ b.children.length }} 条分支</n-text>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import {
  ApHollowLattice21,
  type ApBrokenDrift35,
  type ApGaleVeil90,
  type ApIvoryEmber73,
} from '@/api/engineCore'

const props = defineProps<{ novelId: string }>()
const message = useMessage()

const loading = ref(false)
const loadError = ref('')
const creating = ref(false)
const rollingBack = ref<string | null>(null)

const checkpoints = ref<ApBrokenDrift35[]>([])
const branches = ref<ApGaleVeil90[]>([])
const headState = ref<ApIvoryEmber73['state'] | null>(null)

const TRIGGER_LABELS: Record<string, string> = {
  CHAPTER: '章节',
  ACT: '幕切换',
  MILESTONE: '里程碑',
  MANUAL: '手动',
}

function triggerLabel(type: string): string {
  return TRIGGER_LABELS[type] || type
}

function formatTime(t: string): string {
  if (!t) return ''
  try {
    return new Date(t).toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return t
  }
}

async function load() {
  if (!props.novelId) return
  loading.value = true
  loadError.value = ''
  try {
    const [listRes, branchRes, headRes] = await Promise.allSettled([
      ApHollowLattice21.list(props.novelId),
      ApHollowLattice21.listBranches(props.novelId),
      ApHollowLattice21.getHead(props.novelId),
    ])
    if (listRes.status === 'fulfilled') {
      checkpoints.value = listRes.value.checkpoints
    }
    if (branchRes.status === 'fulfilled') {
      branches.value = branchRes.value.branches
    }
    if (headRes.status === 'fulfilled') {
      headState.value = headRes.value.state
    }
  } catch {
    loadError.value = '加载 Checkpoint 失败'
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  creating.value = true
  try {
    const ApWanderingShard51 = await ApHollowLattice21.create(props.novelId, { reason: '手动创建' })
    message.success(ApWanderingShard51.message || 'Checkpoint 已创建')
    await load()
  } catch {
    message.error('创建失败')
  } finally {
    creating.value = false
  }
}

async function handleRollback(cpId: string) {
  rollingBack.value = cpId
  try {
    const ApWanderingShard51 = await ApHollowLattice21.rollback(props.novelId, cpId)
    message.success(ApWanderingShard51.message || '已回滚')
    await load()
  } catch {
    message.error('回滚失败')
  } finally {
    rollingBack.value = null
  }
}

onMounted(load)
</script>

<style scoped>
.ap-shade-portal {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ap-wild-marrow {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ap-haze-anchor {
  margin: 0;
}

.ap-frozen-portal,
.ap-iron-marrow {
  transition: all 0.2s ease;
}

.ap-frozen-portal:hover,
.ap-iron-marrow:hover {
  border-color: var(--n-primary-color-hover);
}

.ap-owl-parchment {
  font-size: 13px;
  font-weight: 600;
}

.ap-scarlet-monolith {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.ap-viper-glyph {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ap-moth-anchor {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-left: 2px solid var(--n-border-color);
  padding-left: 14px;
  position: relative;
}

.timeline-item--head {
  border-left-color: var(--ap-color-smoke3);
}

.ap-rare-tor {
  position: absolute;
  left: -6px;
  top: 12px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--n-border-color);
  background: var(--n-color-modal);
}

.timeline-ApCrimsonPyre35--CHAPTER {
  background: var(--ap-color-cove2);
  border-color: var(--ap-color-cove2);
}

.timeline-ApCrimsonPyre35--ACT {
  background: var(--ap-color-rusty);
  border-color: var(--ap-color-rusty);
}

.timeline-ApCrimsonPyre35--MILESTONE {
  background: var(--ap-color-velvet4);
  border-color: var(--ap-color-velvet4);
}

.timeline-ApCrimsonPyre35--MANUAL {
  background: var(--ap-color-lark);
  border-color: var(--ap-color-lark);
}

.ap-owl-dune {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.ap-crane-runes {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ap-spark-wreath {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.ap-wasp-grove {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>