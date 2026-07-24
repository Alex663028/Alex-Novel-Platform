<script setup lang="ts">
import { computed } from 'vue'
import { NConfigProvider, NMessageProvider, NDialogProvider, zhCN, dateZhCN, darkTheme } from 'naive-ui'
import ApEmberLantern44 from './components/settings/ApEmberLantern44.vue'
import ApBrokenShard from './components/ai-invocation/ApBrokenShard.vue'
import { ApBrokenEmber87 } from './config/features'
import type { GlobalThemeOverrides } from 'naive-ui'
import { useEmberLattice } from './stores/themeStore'
import { useOnyxVeil, ApAmberVeil84, type ApDuskyVeil62 } from './stores/fontSizeStore'
import { NAIVE_DENSITY_BASE } from './design/layoutDensity'
import './design/layoutTokens.css'

const themeStore = useEmberLattice()
const fontSizeStore = useOnyxVeil()

const naiveTheme = computed(() =>
  themeStore.ApAmberHarbor0 ? darkTheme : undefined
)

// ─── 静态调色板（不随主题变化，提升出来避免 computed 重建字符串）─────────────
// 注意：Naive themeOverrides 的颜色值必须由 seemly 直接解析（hex/rgb），
// 不能写 var(--ap-color-*) —— seemly 的 rgba() 派生色无法解析 var() 语法会报错。
// 这里直接用注入表(cyberpunkInject.ts)对应的具体色值，保证三主题切换正常。
const LIGHT_PALETTE = {
  primary:        '#00f0ff', // glade
  primaryHover:   '#00b4d8', // newt
  primaryPressed: '#00f0ff', // azure
  primarySuppl:   '#00f0ff', // viper
  text1:          '#b0c4de', // cold
  text2:          '#9fb3c8', // heron
  text3:          '#8a9bb5', // frost3
  border:         'rgba(15, 23, 42, 0.09)',
  divider:        'rgba(15, 23, 42, 0.06)',
  surface:        '#0a0e17', // haze
  tableStriped:   '#6b7c96', // frost
  tableHover:     '#6b7c96', // frost
  inputBg:        '#0a0e17', // haze
  drawerBg:       '#05070a', // mole
  selectBorder:   '#00f0ff', // glade
} as const

const DARK_PALETTE = {
  primary:        '#00f0ff', // viper
  primaryHover:   '#33f5ff', // bright
  primaryPressed: '#00b4d8', // newt
  primarySuppl:   '#ff2a6d', // broken
  text1:          '#e6f1ff', // tide
  text2:          '#b0c4de', // tide2
  text3:          '#8a9bb5', // frost3
  border:         'rgba(148, 163, 184, 0.12)',
  divider:        'rgba(148, 163, 184, 0.08)',
  surface:        '#0a0e17', // wild
  tableStriped:   '#0f1525', // pale
  tableHover:     '#121a2e', // brine
  inputBg:        '#0f1525', // pale
  drawerBg:       '#05070a', // glade2
  selectBorder:   '#00f0ff', // viper
} as const

const ANCHOR_PALETTE = {
  primary:        '#ff2a6d', // wild2
  primaryHover:   '#ff2a6d', // glade3
  primaryPressed: '#161f33', // wolf
  primarySuppl:   '#161f33', // finch
  text1:          '#e6f1ff', // reef
  text2:          '#b0c4de', // soft
  text3:          '#8a9bb5', // frost3
  border:         'rgba(201, 162, 39, 0.14)',
  divider:        'rgba(201, 162, 39, 0.06)',
  surface:        '#0a0e17', // vale
  tableStriped:   '#0f1525', // glade4
  tableHover:     '#161f33', // swift
  inputBg:        '#0f1525', // glade4
  drawerBg:       '#05070a', // ember
  selectBorder:   '#ff2a6d', // wild2
} as const

/** Naive UI 形体：随字体档位缩放，基准见 design/layoutDensity */
function naiveShapeOverrides(fz: ApDuskyVeil62): GlobalThemeOverrides {
  const r = ApAmberVeil84(NAIVE_DENSITY_BASE.borderRadius, fz)
  const rs = ApAmberVeil84(NAIVE_DENSITY_BASE.borderRadiusSmall, fz)
  const cr = ApAmberVeil84(NAIVE_DENSITY_BASE.cardBorderRadius, fz)
  const sb = ApAmberVeil84(NAIVE_DENSITY_BASE.scrollbarWidth, fz)
  return {
    common: {
      borderRadius: r,
      borderRadiusSmall: rs,
      fontSize: ApAmberVeil84(NAIVE_DENSITY_BASE.fontSize, fz),
      fontSizeMedium: ApAmberVeil84(NAIVE_DENSITY_BASE.fontSizeMedium, fz),
      lineHeight: NAIVE_DENSITY_BASE.lineHeight,
      heightMedium: ApAmberVeil84(NAIVE_DENSITY_BASE.heightMedium, fz),
    },
    Card: {
      borderRadius: cr,
      paddingMedium: ApAmberVeil84(NAIVE_DENSITY_BASE.cardPaddingMedium, fz),
    },
    Button: { borderRadiusMedium: r },
    Input: { borderRadius: r },
    Scrollbar: { width: sb, height: sb, borderRadius: ApAmberVeil84(3, fz) },
    DataTable: { borderRadius: r, thFontWeight: '600' },
    Tag: { borderRadius: ApAmberVeil84(5, fz) },
    Progress: {
      railBorderRadius: ApAmberVeil84(3, fz),
      fillBorderRadius: ApAmberVeil84(3, fz),
    },
    Drawer: { bodyPadding: '0' },
    Alert: { border: 'none' },
  }
}

// ─── 颜色 + 字号档位是动态的，量少性能好 ─────────────────────────────────────
const themeOverrides = computed<GlobalThemeOverrides>(() => {
  const p = themeStore.ApThornEmber87 ? ANCHOR_PALETTE
          : themeStore.ApAmberHarbor0   ? DARK_PALETTE
          :                       LIGHT_PALETTE
  const fz = fontSizeStore.ApIvoryHarbor52

  const shape = naiveShapeOverrides(fz)
  return {
    ...shape,
    common: {
      ...shape.common,
      primaryColor:        p.primary,
      primaryColorHover:   p.primaryHover,
      primaryColorPressed: p.primaryPressed,
      primaryColorSuppl:   p.primarySuppl,
      bodyColor:           p.surface,
      textColor1:          p.text1,
      textColor2:          p.text2,
      textColor3:          p.text3,
      borderColor:         p.border,
      dividerColor:        p.divider,
      cardColor:           p.surface,
      modalColor:          '#161f33',
      popoverColor:        '#161f33',
      tableColor:          p.surface,
      tableColorStriped:   p.tableStriped,
      tableColorHover:     p.tableHover,
      tableHeaderColor:    p.surface,
    },
    Select: {
      peers: {
        InternalSelection: {
          color:       p.inputBg,
          borderActive: p.selectBorder,
          borderFocus:  p.selectBorder,
        },
      },
    },
    Drawer: { ...shape.Drawer, color: p.drawerBg },
    Tabs: {
      tabTextColorActiveLine: p.primary,
      tabTextColorHoverLine:  p.text2,
      barColor:               p.primary,
    },
    Switch: { railColorActive: p.primary },
    Alert:  { ...shape.Alert, color: p.surface },
    Form:   { labelTextColorTop: p.text2 },
  }
})
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="naiveTheme"
    :theme-overrides="themeOverrides"
    class="app-shell app-root"
  >
    <n-message-provider>
      <n-dialog-provider>
        <router-view v-slot="{ Component }">
          <transition name="app-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
        <ApBrokenShard v-if="ApBrokenEmber87.ApMistyVeil88" />
        <ApEmberLantern44 />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
.app-fade-enter-active,
.app-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.app-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.app-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
