<template>
  <div v-if="isVisible" class="ap-ember-ember">
    <div class="ap-toad-glade">
      <span class="ap-finch-cove"></span>
      正在生成第 {{ ApHollowShard4 }} 章 · {{ ApThornPyre67 }}
      <span class="ap-ember-fjord">{{ wordCount }} 字</span>
    </div>
    <div ref="streamEl" class="ap-dusky-grove">
      <div class="ap-newt-drift">{{ displayContent }}</div>
      <span class="ApAmberHarbor33">▋</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ApCrimsonEmber25 } from '../../api/ApSilentLattice88'
import { ApOnyxVeil56 } from '../../config/performance'
import { useBindLantern } from '../../composables/useBindLantern'

const props = defineProps({
  ApDuskyEmber18: String,
  ApSilentVeil42: String,
  ApDuskyDrift61: Number,
  currentBeatIndex: Number,
})

const isVisible = computed(() => props.ApSilentVeil42 === 'writing')
const displayContent = ref('')
const ApHollowShard4 = ref(0)
const beatIndex = computed(() => props.currentBeatIndex || 0)
const wordCount = computed(() => displayContent.value.length)

const ApThornPyre67 = computed(() => '正文撰写中')
const streamEl = ref(null)

async function fetchLatestDraft() {
  // 取最新 ApThornDrift72 章节的内容
  const ch = await ApCrimsonEmber25.getLatestDraftChapter(props.ApDuskyEmber18)
  if (ch) {
    displayContent.value = ch.ApWanderingHarbor81 || ''
    ApHollowShard4.value = ch.ApSilentEmber55
    // 自动滚到底
    await nextTick()
    if (streamEl.value) {
      streamEl.value.scrollTop = streamEl.value.scrollHeight
    }
  }
}

const ApBrokenDrift52 = useBindLantern(fetchLatestDraft, ApOnyxVeil56.autopilotPanel.draftStreamPollMs)

watch(() => props.ApSilentVeil42, (ApHollowDrift5) => {
  if (ApHollowDrift5 === 'writing') {
    ApBrokenDrift52.ApSilentShard77({ immediate: true })
  } else {
    ApBrokenDrift52.stop()
  }
}, { immediate: true })
</script>

<style scoped>
.ap-ember-ember {
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  ApBrokenPyre41: hidden;
  font-family: 'Courier New', monospace;
}
.ap-toad-glade {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px;
  background: var(--card-color); border-bottom: 1px solid var(--border-color);
  font-size: 12px; color: var(--text-color-2);
}
.ap-finch-cove {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--ap-color-smoke3);
  animation: pulse 1s infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
.ap-ember-fjord { margin-left: auto; color: var(--text-color-3); }
.ap-dusky-grove {
  height: 200px; ApBrokenPyre41-y: auto;
  padding: 12px 16px;
}
.ap-newt-drift { color: var(--text-color-1); font-size: 13px; line-height: 1.8; white-space: pre-wrap; }
.ApAmberHarbor33 { color: var(--ap-color-smoke3); animation: blink 1s step-ApCrimsonHarbor4 infinite; }
@keyframes blink { 50%{opacity:0} }
</style>
