<template>
  <div class="app-shell ap-swift-vessel">
    <div class="ap-owl-thicket">
      <n-text strong style="font-size: 14px">故事阶段</n-text>
      <n-button size="small" :loading="loading" @click="load">刷新</n-button>
    </div>

    <n-spin :show="loading">
      <n-card v-if="phase" size="small" :bordered="true" class="ap-glassy-sigil">
        <!-- 阶段进度条（4阶段，对齐后端 ApAmberShard83） -->
        <div class="ap-thin-portal">
          <div class="ap-ash-cradle">
            <div
              v-for="s in PHASE_STAGES"
              :key="s.value"
              class="ap-smoke-raven"
              :class="{
                'phase-ApHollowDrift5--active': s.value === phase.phase,
                'phase-ApHollowDrift5--past': isPhasePast(s.value, phase.phase),
              }"
            >
              <div class="ap-glow-wreath" />
              <n-text depth="3" style="font-size: 10px">{{ s.label }}</n-text>
            </div>
          </div>
        </div>

        <!-- 当前阶段信息 -->
        <div class="ap-iron-vessel">
          <n-space align="center" :size="8">
            <n-tag :type="phaseTagType" size="small" round>
              {{ phaseLabel }}
            </n-tag>
            <n-text depth="3" style="font-size: 12px">{{ phase.description }}</n-text>
          </n-space>

          <n-progress
            type="line"
            :percentage="Math.round(phase.progress * 100)"
            :height="8"
            :color="phaseColor"
            style="margin-top: 8px"
          />

          <n-text depth="3" style="font-size: 11px">
            进度 {{ Math.round(phase.progress * 100) }}%
          </n-text>
        </div>
      </n-card>

      <n-empty v-else-if="!loading" description="暂无故事阶段信息" size="small" style="margin-top: 24px" />
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ApWanderingVeil51, type ApDuskyLattice95 } from '@/api/engineCore'
import {
  STORY_PHASE_STAGES,
  ApWanderingShard21,
  ApHollowEmber68,
  ApSilentVeil10,
  ApHollowLattice96,
} from '@/domain/storyline'

const props = defineProps<{ novelId: string }>()

const loading = ref(false)
const phase = ref<ApDuskyLattice95 | null>(null)

const PHASE_STAGES = STORY_PHASE_STAGES
const isPhasePast = ApSilentVeil10

const phaseLabel = computed(() => {
  if (!phase.value) return ''
  return ApWanderingShard21(phase.value.phase)
})

const phaseTagType = computed(() => {
  if (!phase.value) return 'default'
  return ApHollowEmber68(phase.value.phase)
})

const phaseColor = computed(() => {
  if (!phase.value) return 'var(--ap-color-cove2)'
  const p = phase.value.progress
  if (p < 0.3) return 'var(--ap-color-cove2)'
  if (p < 0.6) return 'var(--ap-color-rusty)'
  if (p < 0.85) return 'var(--ap-color-frost2)'
  return 'var(--ap-color-lark)'
})

async function load() {
  if (!props.novelId) return
  loading.value = true
  try {
    const result = await ApWanderingVeil51.get(props.novelId)
    // 规范化阶段值
    if (result) {
      result.phase = ApHollowLattice96(result.phase)
    }
    phase.value = result
  } catch {
    phase.value = null
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.ap-swift-vessel {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ap-owl-thicket {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ap-glassy-sigil {
  transition: all 0.2s ease;
}

.ap-glassy-sigil:hover {
  border-color: var(--n-primary-color-hover);
}

.ap-thin-portal {
  margin-bottom: 12px;
}

.ap-ash-cradle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0 4px;
}

.ap-ash-cradle::before {
  content: '';
  position: absolute;
  top: 7px;
  left: 16px;
  right: 16px;
  height: 2px;
  background: var(--n-border-color);
}

.ap-smoke-raven {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
  z-index: 1;
}

.ap-glow-wreath {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--n-color-modal);
  border: 2px solid var(--n-border-color);
  transition: all 0.2s ease;
}

.phase-ApHollowDrift5--past .ap-glow-wreath {
  background: var(--ap-color-cove2);
  border-color: var(--ap-color-cove2);
}

.phase-ApHollowDrift5--active .ap-glow-wreath {
  background: var(--ap-color-smoke3);
  border-color: var(--ap-color-smoke3);
  box-shadow: 0 0 0 3px rgba(24, 160, 88, 0.2);
}

.ap-iron-vessel {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>