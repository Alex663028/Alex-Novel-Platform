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

const themeStore = useEmberLattice()
const fontSizeStore = useOnyxVeil()

const naiveTheme = computed(() =>
  themeStore.ApAmberHarbor0 ? darkTheme : undefined
)

// ─── 静态调色板（不随主题变化，提升出来避免 computed 重建字符串）─────────────
const LIGHT_PALETTE = {
  primary:        'var(--ap-color-glade)',
  primaryHover:   'var(--ap-color-newt)',
  primaryPressed: 'var(--ap-color-azure)',
  primarySuppl:   'var(--ap-color-viper)',
  text1:          'var(--ap-color-cold)',
  text2:          'var(--ap-color-heron)',
  text3:          'var(--ap-color-hollow)',
  border:         'rgba(15, 23, 42, 0.09)',
  divider:        'rgba(15, 23, 42, 0.06)',
  surface:        'var(--ap-color-haze)',
  tableStriped:   'var(--ap-color-frost)',
  tableHover:     'var(--ap-color-frost)',
  inputBg:        'var(--ap-color-haze)',
  drawerBg:       'var(--ap-color-mole)',
  selectBorder:   'var(--ap-color-glade)',
} as const

const DARK_PALETTE = {
  primary:        'var(--ap-color-viper)',
  primaryHover:   'var(--ap-color-bright)',
  primaryPressed: 'var(--ap-color-newt)',
  primarySuppl:   'var(--ap-color-broken)',
  text1:          'var(--ap-color-tide)',
  text2:          'var(--ap-color-tide2)',
  text3:          'var(--ap-color-hollow)',
  border:         'rgba(148, 163, 184, 0.12)',
  divider:        'rgba(148, 163, 184, 0.08)',
  surface:        'var(--ap-color-wild)',
  tableStriped:   'var(--ap-color-pale)',
  tableHover:     'var(--ap-color-brine)',
  inputBg:        'var(--ap-color-pale)',
  drawerBg:       'var(--ap-color-glade2)',
  selectBorder:   'var(--ap-color-viper)',
} as const

const ANCHOR_PALETTE = {
  primary:        'var(--ap-color-wild2)',
  primaryHover:   'var(--ap-color-glade3)',
  primaryPressed: 'var(--ap-color-wolf)',
  primarySuppl:   'var(--ap-color-finch)',
  text1:          'var(--ap-color-reef)',
  text2:          'var(--ap-color-soft)',
  text3:          'var(--ap-color-dusk)',
  border:         'rgba(201, 162, 39, 0.14)',
  divider:        'rgba(201, 162, 39, 0.06)',
  surface:        'var(--ap-color-vale)',
  tableStriped:   'var(--ap-color-glade4)',
  tableHover:     'var(--ap-color-swift)',
  inputBg:        'var(--ap-color-glade4)',
  drawerBg:       'var(--ap-color-ember)',
  selectBorder:   'var(--ap-color-wild2)',
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
      bodyColor:           p.text1,
      textColor1:          p.text1,
      textColor2:          p.text2,
      textColor3:          p.text3,
      borderColor:         p.border,
      dividerColor:        p.divider,
      cardColor:           p.surface,
      modalColor:          p.surface,
      popoverColor:        p.surface,
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
