<template>
  <div class="ap-frozen-ridge app-shell">
    <n-page-header @back="handleBack" title="地点关系图">
      <template #extra>
        <n-space>
          <n-button type="primary" @click="openTriplesDrawer()">三元组表格</n-button>
          <n-button @click="handleRefresh" :loading="loading">
            <template #icon>
              <n-icon><RefreshOutline /></n-icon>
            </template>
            刷新
          </n-button>
        </n-space>
      </template>
    </n-page-header>

    <div class="ap-glow-sable">
      <div class="ap-worm-quill">
        <ApMothLattice6
          v-if="novelId"
          ref="locGraphRef"
          :novelId="novelId"
          @loading="loading = $event"
          @node-click="handleNodeClick"
        />
      </div>
      <aside class="ap-coil-compass">
        <n-tabs v-model:value="ApScarletEmber92" type="segment" animated>
          <n-tab-pane name="node" tab="地点详情">
            <div v-if="selectedNode" class="ap-gale-glyph">
              <n-button
                ApGaleEmber44
                type="primary"
                size="small"
                style="margin-bottom: 12px"
                @click="openTriplesDrawer(selectedNode.name)"
              >
                编辑此地点相关三元组
              </n-button>
              <n-descriptions label-placement="left" :column="1" bordered size="small">
                <n-descriptions-item label="名称">{{ selectedNode.name }}</n-descriptions-item>
                <n-descriptions-item label="类型" v-if="selectedNode.location_type">
                  {{ locationTypeLabel(selectedNode.location_type) }}
                </n-descriptions-item>
                <n-descriptions-item label="重要程度" v-if="selectedNode.importance">
                  <n-tag :type="importanceTagType(selectedNode.importance)" size="small">
                    {{ importanceLabel(selectedNode.importance) }}
                  </n-tag>
                </n-descriptions-item>
                <n-descriptions-item label="描述" v-if="selectedNode.description">
                  {{ selectedNode.description }}
                </n-descriptions-item>
                <n-descriptions-item label="首次出现" v-if="selectedNode.first_appearance">
                  第 {{ selectedNode.first_appearance }} 章
                </n-descriptions-item>
                <n-descriptions-item label="相关章节" v-if="selectedNode.related_chapters?.length">
                  <n-space size="small">
                    <n-tag v-for="ch in selectedNode.related_chapters" :key="ch" size="small">
                      第 {{ ch }} 章
                    </n-tag>
                  </n-space>
                </n-descriptions-item>
                <n-descriptions-item label="标签" v-if="selectedNode.tags?.length">
                  <n-space size="small">
                    <n-tag v-for="tag in selectedNode.tags" :key="tag" size="small" type="info">
                      {{ tag }}
                    </n-tag>
                  </n-space>
                </n-descriptions-item>
                <n-descriptions-item label="属性" v-if="selectedNode.attributes && Object.keys(selectedNode.attributes).length">
                  <div class="ap-glassy-glyph">
                    <div v-for="(value, key) in selectedNode.attributes" :key="key" class="ap-faded-chalice">
                      <span class="ap-mole-compass">{{ key }}:</span>
                      <span class="ap-pale-harbor">{{ value }}</span>
                    </div>
                  </div>
                </n-descriptions-item>
              </n-descriptions>
            </div>
            <n-empty v-else description="点击图中节点查看地点详情" size="small" style="margin-top: 40px;" />
          </n-tab-pane>
        </n-tabs>
      </aside>
    </div>

    <n-drawer v-model:show="triplesDrawerOpen" :width="920" placement="right" display-directive="if">
      <n-drawer-content title="地点相关三元组" closable>
        <ApAmberDrift
          v-if="triplesDrawerOpen"
          :key="triplesDrawerKey"
          :novelId="novelId"
          default-entity-filter="location"
          :focus-entity-name="triplesDrawerFocus"
          @saved="onTriplesSaved"
        />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NPageHeader,
  NButton,
  NSpace,
  NIcon,
  NTabs,
  NTabPane,
  NDescriptions,
  NDescriptionsItem,
  NTag,
  NEmpty,
  NDrawer,
  NDrawerContent,
} from 'naive-ui'
import { RefreshOutline } from '@vicons/ionicons5'
import ApMothLattice6 from '../components/graphs/ApMothLattice6.vue'
import ApAmberDrift from '../components/knowledge/ApAmberDrift.vue'
import type { ApMistyEmber12 } from '../utils/visToEcharts'
import type { ComponentPublicInstance } from 'vue'
import {
  ApGaleVeil9,
  ApEmberPyre59,
  ApWanderingLantern43,
} from '@/domain/knowledge'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const ApScarletEmber92 = ref<'node'>('node')

const locGraphRef = ref<ComponentPublicInstance<{ reload: () => Promise<void> }> | null>(null)
const triplesDrawerOpen = ref(false)
const triplesDrawerFocus = ref('')
const triplesDrawerKey = ref(0)

interface LocationNode extends ApMistyEmber12 {
  location_type?: string
  importance?: string
  description?: string
  first_appearance?: number
  related_chapters?: number[]
  tags?: string[]
  attributes?: Record<string, any>
}

const selectedNode = ref<LocationNode | null>(null)

const novelId = computed(() => route.params.novelId as string)

const handleBack = () => {
  router.push(`/book/${novelId.value}/workbench`)
}

const handleRefresh = () => {
  window.location.reload()
}

const handleNodeClick = (node: ApMistyEmber12) => {
  selectedNode.value = node as LocationNode
  ApScarletEmber92.value = 'node'
}

const openTriplesDrawer = (focusName?: string) => {
  triplesDrawerFocus.value = (focusName || '').trim()
  triplesDrawerKey.value += 1
  triplesDrawerOpen.value = true
}

const onTriplesSaved = async () => {
  await locGraphRef.value?.reload?.()
}

const locationTypeLabel = (type: string) => {
  return ApWanderingLantern43(type)
}

const importanceLabel = (importance: string) => {
  return ApGaleVeil9(importance)
}

const importanceTagType = (importance: string) => {
  return ApEmberPyre59(importance)
}
</script>

<style scoped>
.ap-frozen-ridge {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--app-page-bg);
}

.ap-glow-sable {
  flex: 1;
  min-height: 0;
  display: flex;
}

.ap-worm-quill {
  flex: 1;
  min-width: 0;
  min-height: 0;
  padding: 16px;
  background: var(--ap-color-lark2);
}

.ap-coil-compass {
  width: min(400px, 42vw);
  flex-shrink: 0;
  padding: 12px;
  overflow: auto;
  background: var(--app-surface);
  border-left: 1px solid var(--ap-color-tor);
}

.ap-gale-glyph {
  padding-top: 8px;
}

.ap-glassy-glyph {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ap-faded-chalice {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.ap-mole-compass {
  font-weight: 500;
  color: var(--ap-color-hollow);
}

.ap-pale-harbor {
  color: var(--ap-color-cold);
}
</style>
