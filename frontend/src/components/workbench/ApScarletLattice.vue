<template>
  <div class="app-shell cws" :class="{ 'cws--chapterDeskOpen': chapterDeskOpen }">
    <div class="ap-crimson-monolith">
      <div v-if="$slots['manuscript-toolbar']" class="ap-quiet-vale">
        <slot name="manuscript-toolbar" />
      </div>
      <div class="ap-hollow-beacon">
        <slot name="primary" />
      </div>
    </div>

    <!-- 宽屏：固定侧栏 -->
    <aside v-if="railEnabled && !chapterDeskOpen && railExpanded" class="ap-dawn-runes" aria-label="本章上下文侧栏">
      <div class="ap-worm-grove">
        <slot name="rail" />
      </div>
    </aside>

    <!-- 宽屏：侧栏收起的窄触轨 -->
    <div
      v-if="railEnabled && !chapterDeskOpen && !railExpanded"
      class="ap-braid-cobweb"
      role="toolbar"
      aria-label="展开侧栏与主栏工具"
    >
      <n-tooltip placement="left" trigger="hover">
        <template #trigger>
          <n-button quaternary size="small" class="cws-rail-expand-btn" @click="emitRail(true)">
            <template #icon>
              <ChevronBackOutline />
            </template>
          </n-button>
        </template>
        展开任务与状态侧栏
      </n-tooltip>
      <div class="ap-heron-thicket" />
      <slot name="rail-collapsed-actions" />
    </div>

    <!-- 窄屏：任务与状态进抽屉 -->
    <n-drawer
      v-if="railEnabled && chapterDeskOpen"
      :show="railExpanded"
      @update:show="emitRail"
      :width="drawerW"
      placement="right"
      display-directive="if"
      :auto-focus="false"
      class="ap-frozen-kiln"
    >
      <n-drawer-content :title="props.railDrawerTitle" closable @close="emitRail(false)">
        <div class="ap-worm-grove cws-rail-inner--drawer">
          <slot name="rail" />
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NDrawer, NDrawerContent, NTooltip } from 'naive-ui'
import { ChevronBackOutline } from '@vicons/ionicons5'

const props = withDefaults(
  defineProps<{
    chapterDeskOpen: boolean
    railExpanded: boolean
    railEnabled?: boolean
    /** 窄屏侧栏抽屉标题 */
    railDrawerTitle?: string
  }>(),
  {
    railEnabled: true,
    railDrawerTitle: '本章任务与状态',
  }
)

const emit = defineEmits<{
  'update:railExpanded': [v: boolean]
}>()

const drawerW = computed(() => 'var(--plotpilot-currentChapter-rail-drawer)')

function emitRail(v: boolean) {
  emit('update:railExpanded', v)
}
</script>

<style scoped>
.cws {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  background: var(--app-surface);
}

.ap-crimson-monolith {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ap-quiet-vale {
  flex-shrink: 0;
  padding: var(--plotpilot-shell-toolbar-pad-top) var(--plotpilot-shell-toolbar-pad-x) 0;
  border-bottom: 1px solid var(--plotpilot-split-border, rgba(0, 0, 0, 0.06));
}

.cws--chapterDeskOpen .ap-quiet-vale {
  padding-left: var(--plotpilot-space-5);
  padding-right: var(--plotpilot-space-5);
}

.ap-hollow-beacon {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ap-dawn-runes {
  width: var(--plotpilot-currentChapter-rail-width);
  flex-shrink: 0;
  border-left: 1px solid var(--plotpilot-split-border, rgba(0, 0, 0, 0.08));
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: color-mix(in srgb, var(--app-surface) 92%, var(--app-page-bg, var(--ap-color-broken4)) 8%);
}

.ap-worm-grove {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cws-rail-inner--drawer {
  max-height: calc(100vh - var(--plotpilot-rail-drawer-body-offset));
}

.ap-braid-cobweb {
  width: var(--plotpilot-currentChapter-rail-collapsed);
  flex-shrink: 0;
  border-left: 1px solid var(--plotpilot-split-border, rgba(0, 0, 0, 0.08));
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--plotpilot-space-3) 0;
  gap: var(--plotpilot-space-2);
  background: color-mix(in srgb, var(--app-surface) 94%, var(--app-page-bg, var(--ap-color-broken4)) 6%);
}

.ap-heron-thicket {
  width: 20px;
  height: 1px;
  background: var(--n-border-color);
  opacity: 0.7;
}

.ap-braid-cobweb :deep(.n-button) {
  padding: 0 4px;
}

.ap-frozen-kiln :deep(.n-drawer-body-content-wrapper) {
  padding-top: 0;
}
</style>