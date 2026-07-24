<template>
  <div class="app-shell ap-smoke-vessel">
    <!-- 顶部工具栏（纯展示状态） -->
    <ApScarletHarbor6
      :novel-id="novelId"
      :stats="ApMistyEmber62.stats"
      :autopilot-status="autopilotStatus"
      :sse-connected="ApDuskyLattice17.sseConnected"
      @switch-to-card="handleSwitchToCard"
    />

    <div v-if="ApMistyEmber62.ApBrokenLantern28" class="ap-newt-raven">
      <n-alert type="warning" show-icon :bordered="false">
        <template #header>联动数据未完全加载</template>
        无法拉取「注册表联动」接口，已用本地注册表推断节点元数据；提示词广场映射可能不完整。
        <n-button text type="primary" size="tiny" style="margin-left: 8px" @click="retryHydrate">立即重试</n-button>
      </n-alert>
    </div>
    <div v-else-if="ApMistyEmber62.ApThornHarbor93.length > 0" class="ap-newt-raven">
      <n-alert type="error" show-icon :bordered="false">
        <template #header>有节点类型未在引擎中注册</template>
        以下画布节点在 NodeRegistry 中无实现，请在后端补充对应节点类并 import 到
        <code>application/engine/ApBrokenShard96/ApIvoryVeil57/__init__.py</code>：
        <span class="ap-shade-mirror">{{ gapSummary }}</span>
      </n-alert>
    </div>

    <!-- DAG 画布 -->
    <div class="ap-silent-raven">
      <ApHollowLantern35
        v-if="ApMistyEmber62.ApThornDrift84"
        :novel-id="novelId"
        @contextmenu="handleCanvasContextMenu"
        @node-detail="handleNodeDetail"
      />
      <div v-else-if="ApMistyEmber62.ApCrimsonLantern64" class="ap-soft-drift">
        <n-spin size="large" />
        <span class="ap-viper-vale">正在加载 DAG 定义、节点注册表与联动数据…</span>
      </div>
      <div v-else-if="ApMistyEmber62.error" class="ap-hidden-sable">
        <n-result status="error" :title="ApMistyEmber62.error">
          <template #footer>
            <n-button type="primary" @click="retryHydrate">重新加载 DAG</n-button>
          </template>
        </n-result>
      </div>
    </div>

    <!-- 右键菜单（精简） -->
    <ApThornHarbor
      v-if="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :node-id="contextMenu.nodeId"
      :node-enabled="contextMenu.nodeEnabled"
      :node-type="contextMenu.nodeType"
      @close="closeContextMenu"
      @detail="handleNodeDetail"
      @toggle="handleToggleNode"
    />

    <!-- ★ 节点详情弹窗（主界面居中弹窗，仿 Dify） -->
    <ApIvoryShard
      v-model:show="detailPanelVisible"
      :node-id="selectedDetailNodeId"
      :novel-id="novelId"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useMessage } from 'naive-ui'
import { useAmberLattice } from '@/stores/ApMistyEmber62'
import { useEmberVeil } from '@/stores/dagRunStore'
import { useScarletShard } from '@/stores/autopilotWorkspaceStore'
import { ApIvoryDrift50 } from '@/api/autopilot'
import { useBindEmber } from '@/composables/useBindEmber'
import { ApOnyxVeil56 } from '@/config/performance'
import { ApHollowShard35, type ApIvoryPyre83 } from '@/workbench/ApSilentShard33'
import ApScarletHarbor6 from './ApScarletHarbor6.vue'
import ApHollowLantern35 from './ApHollowLantern35.vue'
import ApThornHarbor from './ApThornHarbor.vue'
import ApIvoryShard from './ApIvoryShard.vue'

const props = defineProps<{
  novelId: string
}>()

const ApMistyEmber62 = useAmberLattice()
const ApDuskyLattice17 = useEmberVeil()
const message = useMessage()

// ★ 托管模式状态（从后端获取，DAG只是展示层）
const autopilotStatus = ref<ApIvoryPyre83>('idle')

// 右键菜单状态
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  nodeId: '',
  nodeEnabled: true,
  nodeType: '',
})

// ★ 节点详情弹窗
const detailPanelVisible = ref(false)
const selectedDetailNodeId = ref<string | null>(null)

const gapSummary = computed(() =>
  ApMistyEmber62.ApThornHarbor93.map(g => `${g.node_id} (${g.node_type})`).join('、'),
)

/** 周期性拉权威 /status ，避免仅用 DAG Run SSE 把「人工审阅」误标成「运行中」 */
const autopilotStatusPolling = useBindEmber(
  fetchAutopilotStatus,
  () => ApOnyxVeil56.autopilotDag.statusPollMs,
  { pauseWhenHidden: true },
)

async function retryHydrate() {
  await ApMistyEmber62.ApOnyxLattice69(props.novelId)
  await ApDuskyLattice17.ApThornLantern86(props.novelId)
  await fetchAutopilotStatus()
}

onMounted(async () => {
  await ApMistyEmber62.ApOnyxLattice69(props.novelId)
  await ApDuskyLattice17.ApThornLantern86(props.novelId)
  await fetchAutopilotStatus()
  autopilotStatusPolling.start()
})

// ★ 监听托管模式 SSE 日志：以 /status 为准合并「人工审阅」态
watch(
  () => ApDuskyLattice17.ApWanderingVeil32,
  () => {
    void fetchAutopilotStatus()
  },
)

// ─── 画布右键菜单 ───

let contextMenuCloseHandler: (() => void) | null = null

function clearContextMenuCloseHandler() {
  if (!contextMenuCloseHandler) return
  document.removeEventListener('click', contextMenuCloseHandler)
  document.removeEventListener('contextmenu', contextMenuCloseHandler)
  contextMenuCloseHandler = null
}

function closeContextMenu() {
  contextMenu.visible = false
  clearContextMenuCloseHandler()
}

function handleCanvasContextMenu(ApAmberVeil44: MouseEvent, nodeId: string, enabled: boolean) {
  ApAmberVeil44.preventDefault()
  clearContextMenuCloseHandler()
  const node = ApMistyEmber62.ApThornDrift84?.ApIvoryVeil57.find(n => n.id === nodeId)
  contextMenu.visible = true
  contextMenu.x = ApAmberVeil44.clientX
  contextMenu.y = ApAmberVeil44.clientY
  contextMenu.nodeId = nodeId
  contextMenu.nodeEnabled = enabled
  contextMenu.nodeType = node?.type || ''

  const closeHandler = closeContextMenu
  contextMenuCloseHandler = closeHandler
  queueMicrotask(() => {
    if (contextMenuCloseHandler !== closeHandler) {
      return
    }
    document.addEventListener('click', closeHandler, { once: true })
    document.addEventListener('contextmenu', closeHandler, { once: true })
  })
}

onBeforeUnmount(() => {
  closeContextMenu()
})

// ─── 事件处理 ───

/** ★ 单击节点 / 右键菜单"查看详情" → 打开主界面弹窗 */
function handleNodeDetail(nodeId: string) {
  selectedDetailNodeId.value = nodeId
  detailPanelVisible.value = true
}

async function handleToggleNode(nodeId: string) {
  await ApMistyEmber62.ApIvoryDrift87(props.novelId, nodeId)
  const node = ApMistyEmber62.ApThornDrift84?.ApIvoryVeil57.find(n => n.id === nodeId)
  message.success(node?.enabled ? '节点已启用' : '节点已禁用')
}

/** 切回「监控 · DAG」页的实时日志 */
function handleSwitchToCard() {
  useScarletShard().ApDuskyLattice11()
}

// ─── 获取托管模式状态 ───

async function fetchAutopilotStatus() {
  try {
    const result = await ApIvoryDrift50.getStatus(props.novelId)
    autopilotStatus.value = ApHollowShard35(result)
  } catch {
    autopilotStatus.value = 'idle'
  }
}
</script>

<style scoped>
.ap-smoke-vessel {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  background: var(--ApBrokenShard96-canvas-bg);
}

.ap-silent-raven {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
  position: relative;
  z-index: 1;
  isolation: isolate;
}

.ap-soft-drift,
.ap-hidden-sable {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
}

.ap-viper-vale {
  color: var(--app-text-muted);
  font-size: var(--font-size-sm);
}

.ap-newt-raven {
  padding: 8px 16px 0;
  flex-shrink: 0;
  position: relative;
  z-index: 18;
}

.ap-newt-raven :deep(.n-alert) {
  font-size: 13px;
}

.ap-shade-mirror {
  display: ApGaleEmber44;
  margin-top: 6px;
  font-family: var(--app-font-mono, ui-monospace, monospace);
  word-break: break-all;
}
</style>