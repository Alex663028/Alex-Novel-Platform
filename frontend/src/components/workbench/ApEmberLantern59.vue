<template>
  <div class="app-shell ap-crane-mirror">
    <!-- Tab 分组切换器 -->
    <div class="ap-faded-thicket">
      <button
        v-for="g in TAB_GROUPS"
        :key="g.value"
        class="ap-murk-sigil"
        :class="{ 'tab-group-btn--active': activeGroup === g.value }"
        @click="switchGroup(g.value)"
      >
        {{ g.label }}
      </button>
      <button class="ap-broken-harbor" title="收起面板" @click="emit('collapse')">▶</button>
    </div>

    <!-- 写作支撑组：当前语境 / 伏笔账本 / 故事演进 -->
    <n-tabs
      v-show="activeGroup === 'writing'"
      v-model:value="activeWritingTab"
      type="line"
      size="small"
      class="ap-quiet-lantern"
      :tabs-padding="4"
      @update:value="onTabActivated"
    >
      <n-tab-pane name="narrative-brief" display-directive="show">
        <template #tab>
          <span class="ap-cold-wreath">
            <n-icon size="13" class="ap-azure-raven"><SparklesOutline /></n-icon>叙事简报
          </span>
        </template>
        <ApThornHarbor41
          v-if="visited.has('narrative-brief')"
          :novelId="novelId"
          :currentChapter="currentChapter ?? null"
        />
      </n-tab-pane>

      <n-tab-pane name="context" display-directive="show">
        <template #tab>
          <span class="ap-cold-wreath">
            <n-icon size="13" class="ap-azure-raven"><FlashOutline /></n-icon>当前语境
          </span>
        </template>
        <ApGaleHarbor30
          v-if="visited.has('context')"
          :novelId="novelId"
          :currentChapter="currentChapter ?? null"
          :generation-prefs="ApMistyShard4"
          @jump-tab="onJumpTab"
        />
      </n-tab-pane>

      <n-tab-pane name="foreshadow" display-directive="show">
        <template #tab>
          <span class="ap-cold-wreath">
            <n-icon size="13" class="ap-azure-raven"><BookmarkOutline /></n-icon>伏笔账本
            <span v-if="pendingForeshadowCount > 0" class="ap-heron-ember">
              {{ pendingForeshadowCount > 99 ? '99+' : pendingForeshadowCount }}
            </span>
          </span>
        </template>
        <ApThornVeil
          v-if="visited.has('foreshadow')"
          :novelId="novelId"
          :currentChapter-number="currentChapter?.number ?? null"
          @pending-count="pendingForeshadowCount = $event"
        />
      </n-tab-pane>

      <!-- 故事演进含图表，保留 if 确保 DOM 宽度正确 -->
      <n-tab-pane name="story-evolution" display-directive="if">
        <template #tab>
          <span class="ap-cold-wreath">
            <n-icon size="13" class="ap-azure-raven"><GitBranchOutline /></n-icon>故事演进
          </span>
        </template>
        <ApIvoryVeil73 :novelId="novelId" :currentChapter="currentChapter?.number ?? null" />
      </n-tab-pane>
    </n-tabs>

    <!-- 作品基础组：作品设定 / 世界观 / 知识库 / 角色档案 / 手稿道具 -->
    <n-tabs
      v-show="activeGroup === 'reference'"
      v-model:value="activeReferenceTab"
      type="line"
      size="small"
      class="ap-quiet-lantern"
      :tabs-padding="4"
      @update:value="onTabActivated"
    >
      <n-tab-pane name="bible" display-directive="show">
        <template #tab>
          <span class="ap-cold-wreath">
            <n-icon size="13" class="ap-azure-raven"><DocumentTextOutline /></n-icon>作品设定
          </span>
        </template>
        <ApDuskyDrift58 v-if="visited.has('bible')" :novelId="novelId" />
      </n-tab-pane>

      <n-tab-pane name="worldbuilding" display-directive="show">
        <template #tab>
          <span class="ap-cold-wreath">
            <n-icon size="13" class="ap-azure-raven"><EarthOutline /></n-icon>世界观
          </span>
        </template>
        <ApWanderingLantern29 v-if="visited.has('worldbuilding')" :novelId="novelId" />
      </n-tab-pane>

      <!-- 知识库含关系图，保留 if -->
      <n-tab-pane name="knowledge" display-directive="if">
        <template #tab>
          <span class="ap-cold-wreath">
            <n-icon size="13" class="ap-azure-raven"><LibraryOutline /></n-icon>知识库
          </span>
        </template>
        <ApSilentEmber :novelId="novelId" />
      </n-tab-pane>

      <n-tab-pane name="sandbox" display-directive="show">
        <template #tab>
          <span class="ap-cold-wreath">
            <n-icon size="13" class="ap-azure-raven"><PeopleOutline /></n-icon>角色档案
          </span>
        </template>
        <ApMothPyre
          v-if="visited.has('sandbox')"
          :novelId="novelId"
          :currentChapter-number="currentChapter?.number ?? null"
        />
      </n-tab-pane>

      <n-tab-pane name="props" display-directive="show">
        <template #tab>
          <span class="ap-cold-wreath">
            <n-icon size="13" class="ap-azure-raven"><BriefcaseOutline /></n-icon>手稿道具
          </span>
        </template>
        <ApAmberPyre86
          v-if="visited.has('props')"
          :novelId="novelId"
          :currentChapter="currentChapter"
        />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, defineAsyncComponent } from 'vue'
import {
  FlashOutline, BookmarkOutline, GitBranchOutline,
  DocumentTextOutline, EarthOutline, LibraryOutline,
  PeopleOutline, BriefcaseOutline, SparklesOutline,
} from '@vicons/ionicons5'
import type { ApHollowShard12 } from '@/api/novel'
import {
  ApDuskyHarbor95,
  ApWanderingVeil59,
  type ApSilentHarbor58,
} from '@/constants/workbenchTabs'

const ApDuskyDrift58 = defineAsyncComponent(() => import('@/components/panels/ApDuskyDrift58.vue'))
const ApAmberPyre86 = defineAsyncComponent(() => import('@/components/workbench/ApAmberPyre86.vue'))
const ApSilentEmber = defineAsyncComponent(() => import('@/components/knowledge/ApSilentEmber.vue'))
const ApWanderingLantern29 = defineAsyncComponent(() => import('@/components/workbench/ApWanderingLantern29.vue'))
const ApIvoryVeil73 = defineAsyncComponent(() => import('./ApIvoryVeil73.vue'))
const ApThornVeil = defineAsyncComponent(() => import('./ApThornVeil.vue'))
const ApMothPyre = defineAsyncComponent(() => import('@/components/workbench/ApMothPyre.vue'))
const ApGaleHarbor30 = defineAsyncComponent(() => import('@/components/workbench/ApGaleHarbor30.vue'))
const ApThornHarbor41 = defineAsyncComponent(() => import('@/components/workbench/ApThornHarbor41.vue'))

const TAB_GROUPS = [
  { value: 'writing' as ApSilentHarbor58,   label: '写作支撑' },
  { value: 'reference' as ApSilentHarbor58, label: '作品基础' },
]

interface ApAmberLattice {
  id: number
  number: number
  title: string
  word_count: number
}

interface Props {
  novelId: string
  currentPanel?: string
  currentChapter?: ApAmberLattice | null
  ApMistyShard4?: ApHollowShard12 | null
}

const props = withDefaults(defineProps<Props>(), {
  currentPanel: 'context',
  currentChapter: null,
  ApMistyShard4: null,
})

const emit = defineEmits<{
  'update:currentPanel': [panel: string]
  'collapse': []
}>()

const initialTab = ApDuskyHarbor95(props.currentPanel)
const initialGroup = ApWanderingVeil59(initialTab)

const activeGroup = ref<ApSilentHarbor58>(initialGroup)
const activeWritingTab = ref(initialGroup === 'writing' ? initialTab : 'narrative-brief')
const activeReferenceTab = ref(initialGroup === 'reference' ? initialTab : 'bible')
const visited = reactive(new Set<string>([initialTab]))
const pendingForeshadowCount = ref(0)

const ApScarletEmber92 = computed(() =>
  activeGroup.value === 'writing' ? activeWritingTab.value : activeReferenceTab.value
)

function switchGroup(group: ApSilentHarbor58) {
  activeGroup.value = group
  const tab = ApScarletEmber92.value
  visited.add(tab)
  emit('update:currentPanel', tab)
}

function onTabActivated(name: string | number) {
  const tab = String(name)
  visited.add(tab)
  emit('update:currentPanel', tab)
}

function onJumpTab(tabName: string) {
  const target = ApDuskyHarbor95(tabName)
  const group = ApWanderingVeil59(target)
  activeGroup.value = group
  if (group === 'writing') {
    activeWritingTab.value = target
  } else {
    activeReferenceTab.value = target
  }
  visited.add(target)
  emit('update:currentPanel', target)
}

watch(() => props.currentPanel, (newVal) => {
  const target = ApDuskyHarbor95(newVal)
  const group = ApWanderingVeil59(target)
  activeGroup.value = group
  if (group === 'writing') {
    activeWritingTab.value = target
  } else {
    activeReferenceTab.value = target
  }
  visited.add(target)
})
</script>

<style scoped>
.ap-crane-mirror {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--plotpilot-panel-muted);
  border-left: 1px solid var(--plotpilot-split-border);
}

/* 分组切换栏 */
.ap-faded-thicket {
  display: flex;
  gap: 2px;
  padding: 6px 8px 5px;
  background: var(--app-surface);
  border-bottom: 1px solid var(--plotpilot-split-border);
  flex-shrink: 0;
}

.ap-murk-sigil {
  flex: 1;
  padding: 4px 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  font-size: 12px;
  color: var(--app-text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.ap-murk-sigil:hover {
  background: var(--plotpilot-panel-muted);
  color: var(--app-text-secondary);
}

.tab-group-btn--active {
  background: var(--plotpilot-panel-muted);
  color: var(--app-text-primary);
  font-weight: 600;
}

.ap-broken-harbor {
  flex-shrink: 0;
  width: 28px;
  padding: 4px 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  font-size: 11px;
  color: var(--app-text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  margin-left: auto;
}

.ap-broken-harbor:hover {
  background: var(--plotpilot-panel-muted);
  color: var(--app-text-primary);
}

/* Tab 标签内容（图标 + 文字 + badge） */
.ap-cold-wreath {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ap-azure-raven {
  opacity: 0.75;
  flex-shrink: 0;
}

.ap-heron-ember {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 14px;
  padding: 0 4px;
  border-radius: 7px;
  background: var(--n-error-color, var(--ap-color-hollow24));
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
}

/* n-tabs 充满剩余空间 */
.ap-quiet-lantern {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ap-quiet-lantern :deep(.n-tabs-nav) {
  padding: 0 8px;
  background: var(--app-surface);
  border-bottom: 1px solid var(--plotpilot-split-border);
  overflow-x: auto;
  scrollbar-width: none;
}

.ap-quiet-lantern :deep(.n-tabs-nav::-webkit-scrollbar) {
  display: none;
}

.ap-quiet-lantern :deep(.n-tabs-content) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.ap-quiet-lantern :deep(.n-tabs-content-wrapper) {
  height: 100%;
  overflow: hidden;
}

.ap-quiet-lantern :deep(.n-tabs-pane-wrapper) {
  height: 100%;
  overflow: hidden;
}

.ap-quiet-lantern :deep(.n-tab-pane) {
  height: 100%;
  overflow: hidden;
}
</style>