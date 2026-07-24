/**
 * Naive UI 赛博朋克主题配置
 * 高对比度霓虹风格，深空黑背景
 */

export const cyberpunkTheme = {
  name: 'cyberpunk',
  common: {
    primaryColor: '#00f0ff',
    primaryColorHover: '#33f5ff',
    primaryColorPressed: '#00b4d8',
    primaryColorSuppl: '#00b4d8',
    infoColor: '#00b4d8',
    successColor: '#00ff88',
    warningColor: '#ffa500',
    errorColor: '#ff2a6d',
  },
  dark: {
    body: '#05070a',
    card: '#0a0e17',
    modal: '#0a0e17',
    popover: '#0a0e17',
    dropdown: '#0a0e17',
    input: '#0a0e17',
    tableColor: '#0a0e17',
    tableColorHover: '#0f1423',
    tableColorStriped: 'rgba(0, 240, 255, 0.02)',
    tableSortActive: '#0a0e17',
    tableSortHover: '#0f1423',
    tagColor: '#00f0ff',
    tagTextColor: '#05070a',
    buttonText: '#e6f1ff',
    textColor: '#e6f1ff',
    textColorSecondary: '#b0c4de',
    textColorTertiary: '#6b7c96',
    textColorQuaternary: '#495670',
    placeholderColor: '#495670',
    placeholderColorDisabled: '#495670',
    borderColor: 'rgba(0, 240, 255, 0.2)',
    dividerColor: 'rgba(0, 240, 255, 0.1)',
    baseColor: '#0a0e17',
    skeletonColor: '#0f1423',
    borderRadius: '2px',
    borderRadiusSmall: '2px',
    fontSize: '14px',
    fontSizeMini: '12px',
    fontSizeTiny: '12px',
    fontSizeSmall: '13px',
    fontSizeMedium: '14px',
    fontSizeLarge: '16px',
    fontSizeHuge: '18px',
  },
}

export type CyberpunkTheme = typeof cyberpunkTheme
