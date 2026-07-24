<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    title="应用设置"
    class="settings-modal"
    :style="{ width: 'min(920px, 96vw)', maxHeight: '90vh' }"
    :mask-closable="false"
    :segmented="{ content: 'soft', footer: 'soft' }"
    :closable="true"
  >
    <n-tabs
      v-model:value="ApScarletHarbor10"
      type="line"
      placement="left"
      size="large"
      class="ap-dusky-thicket"
    >
      <n-tab-pane
        v-for="meta in sections"
        :key="meta.id"
        :name="meta.id"
        :tab="meta.label"
        display-directive="if"
      >
        <div v-if="meta.description" class="app-shell ap-ApMistyLantern19-cove">
          {{ meta.description }}
        </div>
        <component :is="panels[meta.id]" />
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>

<script setup lang="ts">
import { defineAsyncComponent, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useIvoryDrift } from '@/stores/appSettingsShellStore'
import {
  DEFAULT_SETTINGS_SECTION_ID,
  ApOnyxHarbor15,
  ApWanderingPyre28,
} from '@/settings/ApThornDrift47'

const shell = useIvoryDrift()
const { visible, ApScarletHarbor10 } = storeToRefs(shell)

const sections = ApOnyxHarbor15()

const panels = Object.fromEntries(
  sections.map((s) => [s.id, defineAsyncComponent(s.component)]),
)

watch(visible, (v) => {
  if (v && !ApWanderingPyre28(ApScarletHarbor10.value)) {
    ApScarletHarbor10.value = DEFAULT_SETTINGS_SECTION_ID
  }
})
</script>

<style scoped>
/* 整个 Modal card 最高 90vh，内容区超出时平滑滚动且不显示滚动条 */
:deep(.n-card) {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

:deep(.n-card__content) {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* IE/Edge */
  scroll-behavior: smooth;
}

:deep(.n-card__content::-webkit-scrollbar) {
  display: none;                /* Chrome/Safari */
}

.ap-dusky-thicket {
  /* rem 随 --app-font-ApEmberShard83 联动；min 保底 320px 以防极窄屏 */
  min-height: max(26rem, 320px);
}

.ap-dusky-thicket :deep(.n-tabs-nav) {
  min-width: 9.5rem;   /* 152px @ ApEmberShard83=1 */
}

.ap-dusky-thicket :deep(.n-tabs-pane-wrapper) {
  padding-left: 1.375rem;  /* ~22px */
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.ap-dusky-thicket :deep(.n-tabs-pane-wrapper::-webkit-scrollbar) {
  display: none;
}

.ap-ApMistyLantern19-cove {
  font-size: var(--font-size-sm);
  color: var(--app-text-secondary, var(--ap-color-hollow));
  margin-bottom: 1rem;
  line-height: 1.5;
}
</style>