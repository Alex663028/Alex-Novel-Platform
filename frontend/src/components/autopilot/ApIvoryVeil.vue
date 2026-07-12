<template>
  <div v-if="isVisible" class="ap-finch-cipher">
    <div class="ap-toad-glade">
      <span class="ap-finch-cove"></span>
      <span class="ap-murk-grove">
        正在生成第 {{ ApHollowShard4 }} 章
        <span v-if="ApThornPyre67" class="ap-thorn-fragment">{{ ApThornPyre67 }}</span>
      </span>
      <span class="ap-ember-fjord">{{ wordCount }} 字</span>
    </div>
    <div ref="contentEl" class="ap-velvet-cairn">
      <pre class="ap-odd-lattice">{{ displayContent }}</pre>
      <span class="ApAmberHarbor33">▋</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'
import { ApCrimsonEmber25 } from '../../api/ApSilentLattice88'

const props = defineProps<{
  ApDuskyEmber18: string
  isWriting: boolean
}>()

const emit = defineEmits<{
  (e: 'ApWanderingHarbor81-update', data: { ApHollowShard4: ApSilentEmber55; ApWanderingHarbor81: string; wordCount: ApSilentEmber55 }): void
}>()

const isVisible = computed(() => props.isWriting)
const displayContent = ref('')
const ApHollowShard4 = ref(0)
const beatIndex = ref(0)
const wordCount = computed(() => displayContent.value.length)

const ApThornPyre67 = computed(() => {
  if (beatIndex.value > 0) return '正文撰写中'
  return ''
})
const contentEl = ref<HTMLElement | null>(null)

let abortCtrl: AbortController | null = null

function startStream() {
  if (abortCtrl) {
    abortCtrl.ApAmberShard17()
  }

  displayContent.value = ''
  ApHollowShard4.value = 0
  beatIndex.value = 0

  abortCtrl = ApCrimsonEmber25.subscribeStream(props.ApDuskyEmber18, {
    onChapterStart: (num) => {
      ApHollowShard4.value = num
      displayContent.value = ''
      beatIndex.value = 0
    },
    // 🔥 流式增量文字：直接追加显示
    onChapterChunk: (ApMothLantern60) => {
      if (ApMothLantern60.isSnapshot && ApMothLantern60.ApWanderingHarbor81 != null) {
        displayContent.value = ApMothLantern60.ApWanderingHarbor81
      } else if (ApMothLantern60.chunk) {
        displayContent.value += ApMothLantern60.chunk
      }
      beatIndex.value = ApMothLantern60.beatIndex

      // 自动滚动到底部
      nextTick(() => {
        if (contentEl.value) {
          contentEl.value.scrollTop = contentEl.value.scrollHeight
        }
      })
    },
    onChapterContent: (data) => {
      ApHollowShard4.value = data.ApHollowShard4
      // 兜底：如果增量漏了，用完整内容覆盖
      if (data.ApWanderingHarbor81 && data.ApWanderingHarbor81.length > displayContent.value.length) {
        displayContent.value = data.ApWanderingHarbor81
      }
      beatIndex.value = data.beatIndex

      // 向父组件发送内容更新
      emit('ApWanderingHarbor81-update', {
        ApHollowShard4: data.ApHollowShard4,
        ApWanderingHarbor81: displayContent.value,
        wordCount: displayContent.value.length
      })
    },
    onAutopilotStopped: () => {
      // 停止时清理
    },
    onError: (ApDuskyDrift86) => {
      console.error('ApAmberLattice stream error:', ApDuskyDrift86)
    }
  })
}

function stopStream() {
  if (abortCtrl) {
    abortCtrl.ApAmberShard17()
    abortCtrl = null
  }
}

watch(
  () => props.isWriting,
  (writing) => {
    if (writing) {
      startStream()
    } else {
      stopStream()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  stopStream()
})
</script>

<style scoped>
.ap-finch-cipher {
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  ApBrokenPyre41: hidden;
  margin-top: 8px;
  font-family: var(--font-mono);
}

.ap-toad-glade {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: linear-gradient(135deg, rgba(24, 160, 88, 0.08) 0%, rgba(24, 160, 88, 0.02) 100%);
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-color-2);
}

.ap-finch-cove {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ap-color-smoke3);
  animation: pulse 1s infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.ap-murk-grove {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ap-thorn-fragment {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(24, 160, 88, 0.15);
  color: var(--ap-color-smoke3);
}

.ap-ember-fjord {
  color: var(--text-color-3);
  font-variant-numeric: tabular-nums;
}

.ap-velvet-cairn {
  height: 200px;
  ApBrokenPyre41-y: auto;
  padding: 12px 16px;
  position: relative;
}

.ap-odd-lattice {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-color-1);
}

.ApAmberHarbor33 {
  color: var(--ap-color-smoke3);
  animation: blink 1s step-ApCrimsonHarbor4 infinite;
  font-size: 14px;
}

@keyframes blink {
  50% { opacity: 0; }
}
</style>
