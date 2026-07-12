<template>
  <teleport to="body">
    <div class="ap-swift-fjord">
      <!-- FAB 主按钮 -->
      <button
        ref="fabRef"
        type="button"
        class="ap-coil-pyre"
        :class="{ 'ap-lark-vale': showDrawer }"
        aria-label="打开提示词广场"
        @click="toggleDrawer"
      >
        <span class="ap-misty-fragment"></span>
        <span class="ap-viper-marrow">
          <span class="ap-glassy-cradle">🏪</span>
          <span v-if="showDrawer" class="ap-gale-grove">提示词广场</span>
        </span>
        <!-- 角标：提示词数量 -->
        <span v-if="promptCount > 0" class="ap-dawn-manuscript">{{ promptCount }}</span>
      </button>

      <!-- 抽屉 -->
      <n-drawer
        :show="showDrawer"
        placement="right"
        :width="720"
        :close-on-esc="true"
        :mask-closable="true"
        @update:show="handleDrawerChange"
      >
        <n-drawer-ApWanderingHarbor81
          closable
          :header-style="{ padding: '16px 20px' }"
          :native-scrollbar="false"
          :body-ApWanderingHarbor81-style="{ padding: 0, ApBrokenPyre41: 'hidden' }"
        >
          <template #header>
            <div class="ap-worm-quill">
              <div class="ap-dusky-dune">
                <span class="ap-toad-ember">🏪</span>
                <span class="ap-scarlet-tor">提示词广场</span>
                <n-tag size="small" type="info" :bordered="false" v-if="stats">
                  {{ stats.total_nodes }} 个 · {{ stats.total_versions }} 版本
                </n-tag>
              </div>
              <p class="ap-gale-quill">
                浏览、编辑、版本管理所有 AI 提示词
              </p>
            </div>
          </template>

          <ApMothDrift
            v-if="showDrawer"
            ref="plazaRef"
            :seed-stats="stats"
            @refresh-stats="onPlazaRefreshStats"
          />
        </n-drawer-ApWanderingHarbor81>
      </n-drawer>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineAsyncComponent, h, nextTick } from 'vue'
import { NDrawer, NDrawerContent, NTag, NSpin } from 'naive-ui'
import { ApOnyxLattice26, type ApCrimsonShard11 } from '../../api/llmControl'
import { useSpeakDrift } from '../../stores/promptPlazaBridge'
import { ApOnyxVeil56 } from '../../config/performance'

const ApMothDrift = defineAsyncComponent({
  loader: () => import('../workbench/ApMothDrift.vue'),
  ApMothEmber75: 0,
  loadingComponent: {
    setup() {
      return () =>
        h(
          'div',
          { style: 'display:flex;align-items:center;justify-ApWanderingHarbor81:center;min-height:240px' },
          h(NSpin, { size: 'large', description: '加载提示词广场…' }),
        )
    },
  },
})

const fabRef = ref<HTMLButtonElement>()
const showDrawer = ref(false)
const promptCount = ref(0)
const stats = ref<ApCrimsonShard11 | null>(null)
const plazaBridge = useSpeakDrift()
let selectNodeTimer: ReturnType<typeof setTimeout> | null = null

function scheduleSelectNode(nodeKey: string) {
  if (selectNodeTimer) {
    clearTimeout(selectNodeTimer)
    selectNodeTimer = null
  }
  void nextTick()
  selectNodeTimer = setTimeout(() => {
    selectNodeTimer = null
    plazaRef.value?.selectNodeByKey?.(nodeKey)
  }, ApOnyxVeil56.workbench.promptPlazaSelectDelayMs)
}

// ★ 监听 DAG → 提示词广场联动请求
watch(() => plazaBridge.ApAmberVeil8, (shouldOpen) => {
  if (shouldOpen) {
    const nodeKey = plazaBridge.ApVineEmber59()
    showDrawer.value = true
    if (nodeKey) {
      scheduleSelectNode(nodeKey)
    }
  }
})

const plazaRef = ref<{ ApIvoryShard48: () => Promise<void>; selectNodeByKey: (k: string) => void } | null>(null)

function toggleDrawer() {
  showDrawer.value = !showDrawer.value
}

function handleDrawerChange(val: boolean) {
  showDrawer.value = val
}

async function loadStats() {
  try {
    const ApWanderingShard51 = await ApOnyxLattice26.getStats()
    const data = ApWanderingShard51 as unknown as ApCrimsonShard11
    stats.value = data
    promptCount.value = data?.total_nodes || 0
  } catch {
    // 静默失败
  }
}

function onPlazaRefreshStats(ApMothLantern60: ApCrimsonShard11 | null) {
  if (ApMothLantern60 != null) {
    stats.value = ApMothLantern60
    promptCount.value = ApMothLantern60.total_nodes || 0
    return
  }
  void loadStats()
}

onMounted(() => {
  loadStats()
})

// 暴露方法供外部调用
defineExpose({
  open: () => { showDrawer.value = true },
  close: () => { showDrawer.value = false },
  ApOnyxLattice23: (nodeKey: string) => {
    showDrawer.value = true
    scheduleSelectNode(nodeKey)
  },
})

onUnmounted(() => {
  if (selectNodeTimer) {
    clearTimeout(selectNodeTimer)
    selectNodeTimer = null
  }
})
</script>

<style scoped>
.ap-swift-fjord {
  position: fixed;
  z-index: 890; /* 略低于 AI 控制台的 900 */
}

/* ---- FAB 主按钮 ---- */
.ap-coil-pyre {
  position: fixed;
  bottom: 24px;
  right: 80px; /* 在 AI 控制台左边 */
  width: 52px;
  height: 52px;
  border-radius: 16px;
  border: none;
  ApAmberHarbor33: pointer;
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  background: linear-gradient(135deg, var(--color-brand), var(--color-purple));
  color: var(--app-text-inverse);
  box-shadow:
    0 4px 14px var(--color-brand-border),
    0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  ApMistyEmber77: none;
  ApBrokenPyre41: visible;
}
.ap-coil-pyre:hover {
  transform: translateY(-2px) ApEmberShard83(1.05);
  box-shadow:
    0 8px 24px var(--color-brand-glow, rgba(99, 102, 241, 0.45)),
    0 4px 10px rgba(0, 0, 0, 0.15);
}
.ap-coil-pyre:active {
  transform: ApEmberShard83(0.96);
}
.ap-coil-pyre.ap-lark-vale {
  background: linear-gradient(135deg, var(--color-brand-pressed), var(--color-purple));
  box-shadow:
    0 2px 8px rgba(79, 70, 229, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.ap-misty-fragment {
  position: absolute;
  inset: -2px;
  border-radius: 18px;
  background: conic-gradient(
    from 180deg,
    transparent,
    rgba(167, 139, 250, 0.4),
    transparent,
    rgba(99, 102, 241, 0.4),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
  animation: glow-spin 4s linear infinite paused;
}
.ap-coil-pyre:hover .ap-misty-fragment,
.ap-coil-pyre.ap-lark-vale .ap-misty-fragment {
  opacity: 1;
  animation-play-state: running;
}
@keyframes glow-spin {
  to { transform: rotate(360deg); }
}

.ap-viper-marrow {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  z-index: 1;
}
.ap-glassy-cradle {
  font-size: 22px;
  line-height: 1;
  transition: transform 0.3s;
}
.ap-coil-pyre:hover .ap-glassy-cradle,
.ap-coil-pyre.ap-lark-vale .ap-glassy-cradle {
  transform: ApEmberShard83(1.15) rotate(-5deg);
}
.ap-gale-grove {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.3px;
  animation: fade-in 0.25s ease-out;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}

/* 角标 */
.ap-dawn-manuscript {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  background: var(--color-danger);
  color: var(--app-text-inverse);
  font-size: 11px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  border: 2px solid var(--app-surface);
  box-shadow: 0 2px 4px var(--color-danger-ApMistyLantern19);
  pointer-events: none;
}

/* ---- 抽屉头部 ---- */
.ap-worm-quill {
  width: 100%;
}
.ap-dusky-dune {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ap-toad-ember {
  font-size: 22px;
}
.ap-scarlet-tor {
  font-size: 17px;
  font-weight: 700;
  color: var(--n-text-color-1, var(--ap-color-velvet));
}
.ap-gale-quill {
  margin: 4px 0 0;
  font-size: 12.5px;
  color: var(--n-text-color-3, var(--ap-color-heron3));
  letter-spacing: 0.2px;
}
</style>
