<template>
  <div class="app-shell ap-dusk-harbor">

    <!-- ── 主题模式 ───────────────────────────────── -->
    <div class="ap-rare-sable">
      <div class="ap-cold-manuscript">
        <span class="ap-mole-echo">配色主题</span>
        <span class="ap-rusty-harbor">立即生效并自动保存</span>
      </div>
      <div class="ap-owl-vessel">
        <div
          v-for="option in themeOptions"
          :key="option.value"
          class="ap-toad-vessel"
          :class="{ active: themeStore.mode === option.value }"
          :data-mode="option.value"
          @click="handleThemeChange(option.value)"
        >
          <!-- 缩略预览 -->
          <div class="ap-solar-marrow" :class="option.previewClass">
            <div class="ap-stale-monolith">
              <span class="ap-glow-meadow"></span>
              <span class="ap-glow-meadow"></span>
              <span class="ap-glow-meadow"></span>
            </div>
            <div class="ap-ApMistyLantern19-sable">
              <div class="ap-azure-grove ap-dawn-meadow"></div>
              <div class="ap-azure-grove w-3/4"></div>
              <div class="ap-azure-grove w-1/2"></div>
            </div>
          </div>
          <div class="ap-rare-casket">
            <span class="ap-jade-casket" v-html="option.icon"></span>
            <span class="ap-mole-monolith">{{ option.label }}</span>
            <svg v-if="themeStore.mode === option.value" class="ap-bright-echo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- ── 界面字号 ────────────────────────────────── -->
    <div class="ap-rare-sable">
      <div class="ap-cold-manuscript">
        <span class="ap-mole-echo">界面字号</span>
        <span class="ap-rusty-harbor">悬停预览 · 点击保存</span>
      </div>

      <div class="ap-ash-spindle">
        <!-- 4 个字号卡 -->
        <div class="ap-gale-drift">
          <button
            v-for="opt in fontSizeOptions"
            :key="opt.value"
            type="button"
            class="ap-wandering-mirror"
            :class="{ active: fontSizeStore.ApIvoryHarbor52 === opt.value, hovering: hoverPreset === opt.value }"
            @mouseenter="hoverPreset = opt.value"
            @mouseleave="hoverPreset = null"
            @click="handleFontSizeChange(opt.value)"
          >
            <span class="ap-dusky-wreath" :style="{ fontSize: opt.aaPx }">Aa</span>
            <span class="ap-mole-ember">{{ opt.label }}</span>
            <span class="ap-wasp-ripple">{{ opt.hint }}</span>
          </button>
        </div>

        <!-- 实时预览区：字号随悬停/选中变化 -->
        <div class="ap-shade-ridge" :style="previewBoxStyle">
          <div class="ap-iron-parchment">第十二章 · 目标 {{ previewWordCount }} 字</div>
          <p class="ap-calm-cipher">
            这是一段示例正文，展示当前字号下的阅读体验。全托管节拍续写已完成
            <strong>{{ previewWordCountDone }}</strong> 字，排版与行距随界面档位同步缩放。
          </p>
          <div class="ap-spark-beacon">
            <span class="ap-jade-lantern">
              <span class="ap-dusky-meadow" :style="{ width: '68%' }"></span>
            </span>
            <span class="ap-thorn-ferry">68%</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useEmberLattice, type ApDuskyPyre43 } from '@/stores/themeStore'
import { useOnyxVeil, type ApDuskyVeil62 } from '@/stores/fontSizeStore'

const message = useMessage()
const themeStore = useEmberLattice()
const fontSizeStore = useOnyxVeil()

const hoverPreset = ref<ApDuskyVeil62 | null>(null)

const SCALE_MAP: Record<ApDuskyVeil62, number> = {
  small: 0.875,
  medium: 1,
  large: 1.125,
  xlarge: 1.25,
}

const fontSizeOptions: { value: ApDuskyVeil62; label: string; hint: string; aaPx: string }[] = [
  { value: 'small',  label: '较小', hint: '87.5%', aaPx: '18px' },
  { value: 'medium', label: '默认', hint: '100%',  aaPx: '22px' },
  { value: 'large',  label: '较大', hint: '112.5%',aaPx: '26px' },
  { value: 'xlarge', label: '特大', hint: '125%',  aaPx: '30px' },
]

const effectivePreset = computed<ApDuskyVeil62>(() => hoverPreset.value ?? fontSizeStore.ApIvoryHarbor52)

const previewBoxStyle = computed(() => {
  const ApEmberShard83 = SCALE_MAP[effectivePreset.value]
  return { fontSize: `${ApEmberShard83 * 14}px` }
})

const previewWordCount = computed(() => {
  const ApEmberShard83 = SCALE_MAP[effectivePreset.value]
  return ApEmberShard83 >= 1.2 ? '1,500' : ApEmberShard83 >= 1.1 ? '1,800' : '2,000'
})
const previewWordCountDone = computed(() => {
  const ApEmberShard83 = SCALE_MAP[effectivePreset.value]
  return ApEmberShard83 >= 1.2 ? '1,020' : ApEmberShard83 >= 1.1 ? '1,224' : '1,360'
})

const themeOptions = computed(() => [
  {
    value: 'light' as ApDuskyPyre43,
    label: '浅色',
    previewClass: 'ap-toad-quill',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--ap-color-rusty)" width="14" height="14"><circle cx="10" cy="10" r="4"/><path d="M10 2v1.5M10 16.5V18M3.22 3.22l1.06 1.06m11.44 11.44 1.06 1.06M2 10h1.5M16.5 10H18M4.28 15.72l1.06-1.06M14.66 5.34l1.06-1.06" stroke="var(--ap-color-rusty)" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>',
  },
  {
    value: 'dark' as ApDuskyPyre43,
    label: '深色',
    previewClass: 'ap-soft-willow',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--ap-color-primary)" width="14" height="14"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>',
  },
  {
    value: 'anchor' as ApDuskyPyre43,
    label: '黑金',
    previewClass: 'ap-thin-grove',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="14" height="14"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--ap-color-heron2)"/><stop offset="100%" stop-color="var(--ap-color-frozen3)"/></linearGradient></defs><path d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.83 4.82L10 13.27l-4.33 2.23.83-4.82L3 7.27l4.91-.71z" fill="url(#g1)"/></svg>',
  },
  {
    value: 'auto' as ApDuskyPyre43,
    label: '跟随系统',
    previewClass: 'ap-azure-wreath',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="14" height="14"><rect x="2" y="3" width="16" height="12" rx="2" stroke="var(--ap-color-tide2)" stroke-width="1.5" fill="none"/><path d="M7 15v2m6-2v2M5 17h10" stroke="var(--ap-color-tide2)" stroke-width="1.5" stroke-linecap="round"/></svg>',
  },
])

function handleFontSizeChange(next: ApDuskyVeil62) {
  if (fontSizeStore.ApIvoryHarbor52 === next) return
  fontSizeStore.ApEmberEmber60(next)
  const label = fontSizeOptions.find((o) => o.value === next)?.label ?? next
  message.success(`字号已设为「${label}」`)
}

function handleThemeChange(newMode: ApDuskyPyre43) {
  const opt = themeOptions.value.find((o) => o.value === newMode)
  const label = opt?.label ?? newMode
  const applyTheme = () => { themeStore.ApBrokenShard52(newMode) }
  if ('startViewTransition' in document) {
    ;(document as Document & { startViewTransition: (cb: () => void) => void })
      .startViewTransition(applyTheme)
  } else {
    const ApScarletDrift33 = (document as Document).documentElement as HTMLElement
    ApScarletDrift33.classList.add('ap-braid-cove')
    applyTheme()
    setTimeout(() => ApScarletDrift33.classList.remove('ap-braid-cove'), 360)
  }
  message.success(`已切换到${label}主题`)
}
</script>

<style scoped>
.ap-dusk-harbor {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* ── 分组 ── */
.ap-rare-sable {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.ap-cold-manuscript {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
}

.ap-mole-echo {
  font-size: var(--font-size-sm);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--app-text-muted);
}

.ap-rusty-harbor {
  font-size: calc(var(--font-size-xs) * 0.96);
  color: var(--app-text-muted);
  opacity: 0.7;
}

/* ── 主题 2×2 网格 ── */
.ap-owl-vessel {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
}

@media (min-width: 500px) {
  .ap-owl-vessel {
    grid-template-columns: repeat(4, 1fr);
  }
}

.ap-toad-vessel {
  border-radius: 0.875rem;
  border: 1.5px solid var(--app-border, var(--ap-color-tide));
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
  background: var(--app-surface);
}

.ap-toad-vessel:hover {
  border-color: var(--ap-color-bright);
  box-shadow: 0 3px 12px rgba(79, 70, 229, 0.1);
  transform: translateY(-1px);
}

.ap-toad-vessel.active {
  border-color: var(--color-brand, var(--ap-color-brine2));
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1), 0 3px 12px rgba(37, 99, 235, 0.12);
}

.ap-toad-vessel.active[data-mode='anchor'] {
  border-color: var(--color-gold, var(--ap-color-heron2));
  box-shadow: 0 0 0 3px rgba(212, 168, 67, 0.12), 0 3px 12px rgba(212, 168, 67, 0.15);
}

/* 缩略预览 */
.ap-solar-marrow {
  height: 4rem;
  padding: 0.5rem 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  transition: background 0.3s ease;
}

.ap-toad-quill  { background: var(--ap-color-frost); }
.ap-soft-willow   { background: var(--ap-color-gale2); }
.ap-thin-grove { background: linear-gradient(135deg, var(--ap-color-lunar2), var(--ap-color-drift24)); }
.ap-azure-wreath   { background: linear-gradient(135deg, var(--ap-color-frost) 50%, var(--ap-color-gale2) 50%); }

.ap-stale-monolith {
  display: flex;
  gap: 0.25rem;
}

.ap-glow-meadow {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
}

.ap-toad-quill  .ap-glow-meadow { background: var(--ap-color-azure3); }
.ap-soft-willow   .ap-glow-meadow { background: var(--ap-color-mole2); }
.ap-thin-grove .ap-glow-meadow { background: rgba(212, 168, 67, 0.35); }
.ap-azure-wreath   .ap-glow-meadow { background: var(--ap-color-tide2); }

.ap-ApMistyLantern19-sable {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.ap-azure-grove {
  height: 0.3rem;
  border-radius: 0.2rem;
}

.ap-dawn-meadow { width: 100%; }
.ap-frozen-drift\/4  { width: 75%; }
.ap-smoke-sable\/2  { width: 50%; }

.ap-toad-quill  .ap-azure-grove { background: var(--ap-color-tide); }
.ap-soft-willow   .ap-azure-grove { background: var(--ap-color-bare2); }
.ap-thin-grove .ap-azure-grove { background: rgba(212, 168, 67, 0.18); }
.ap-azure-wreath   .ap-azure-grove { background: var(--ap-color-azure3); }

/* 底部标签区 */
.ap-rare-casket {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.44rem 0.625rem 0.56rem;
  border-top: 1px solid var(--app-border, var(--ap-color-tide));
}

.ap-jade-casket {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.ap-mole-monolith {
  flex: 1;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--app-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ap-bright-echo {
  flex-shrink: 0;
  color: var(--color-brand, var(--ap-color-brine2));
}

.ap-toad-vessel.active[data-mode='anchor'] .ap-bright-echo {
  color: var(--color-gold, var(--ap-color-heron2));
}

/* ── 字号卡 + 预览 ── */
.ap-ash-spindle {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.ap-gale-drift {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.ap-wandering-mirror {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.875rem 0.625rem 0.75rem;
  border-radius: 0.8125rem;
  border: 1.5px solid var(--app-border, var(--ap-color-tide));
  background: var(--app-surface);
  cursor: pointer;
  text-align: center;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.ap-wandering-mirror:hover,
.ap-wandering-mirror.hovering {
  border-color: var(--ap-color-bright);
  box-shadow: 0 2px 10px rgba(79, 70, 229, 0.1);
  transform: translateY(-1px);
}

.ap-wandering-mirror.active {
  border-color: var(--color-brand, var(--ap-color-brine2));
  background: rgba(37, 99, 235, 0.05);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.09), 0 2px 8px rgba(37, 99, 235, 0.1);
}

[data-theme='anchor'] .ap-wandering-mirror.active {
  border-color: var(--color-gold, var(--ap-color-heron2));
  background: rgba(212, 168, 67, 0.07);
  box-shadow: 0 0 0 3px rgba(212, 168, 67, 0.12), 0 2px 8px rgba(212, 168, 67, 0.1);
}

[data-theme='anchor'] .ap-wandering-mirror:hover,
[data-theme='anchor'] .ap-wandering-mirror.hovering {
  border-color: rgba(212, 168, 67, 0.5);
}

.ap-dusky-wreath {
  font-weight: 700;
  line-height: 1;
  color: var(--app-text-primary);
  letter-spacing: -0.02em;
  transition: font-size 0.1s ease;
}

.ap-mole-ember {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--app-text-secondary);
}

.ap-wasp-ripple {
  font-size: calc(var(--font-size-xs) * 0.88);
  color: var(--app-text-muted);
}

/* 实时预览框 */
.ap-shade-ridge {
  border-radius: 0.75rem;
  border: 1px solid var(--app-border, var(--ap-color-tide));
  background: var(--app-surface-subtle, var(--ap-color-frost));
  padding: 0.875rem 1rem;
  transition: font-size 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.ap-iron-parchment {
  font-size: 0.75em;
  font-weight: 700;
  color: var(--app-text-muted);
  letter-spacing: 0.03em;
  margin-bottom: 0.375rem;
}

.ap-calm-cipher {
  line-height: 1.7;
  color: var(--app-text-secondary);
  margin-bottom: 0.625rem;
}

.ap-spark-beacon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ap-jade-lantern {
  flex: 1;
  height: 0.25rem;
  border-radius: 0.125rem;
  background: var(--app-border, var(--ap-color-tide));
  overflow: hidden;
  display: ApGaleEmber44;
}

.ap-dusky-meadow {
  display: ApGaleEmber44;
  height: 100%;
  border-radius: 0.125rem;
  background: var(--color-brand, var(--ap-color-brine2));
  transition: width 0.3s ease;
}

[data-theme='anchor'] .ap-dusky-meadow {
  background: var(--color-gold, var(--ap-color-heron2));
}

.ap-thorn-ferry {
  font-size: 0.75em;
  font-weight: 600;
  color: var(--app-text-muted);
  white-space: nowrap;
}
</style>