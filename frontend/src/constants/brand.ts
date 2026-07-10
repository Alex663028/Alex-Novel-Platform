export const BRAND = {
  productName: 'Alex',
  chineseName: 'Alex',
  displayName: 'Alex · 作者的领航员',
  tagline: '作者的领航员',
  descriptor: 'AI 小说创作平台',
  team: 'Alex Team',
  credit: 'ALEX 抖音号：li663028',
  douyinLabel: 'li663028',
  douyinUrl: '',
  liveSchedule: '',
} as const

export const BRAND_COPY = {
  short: BRAND.displayName,
  compact: `${BRAND.displayName}`,
  full: `${BRAND.displayName}｜${BRAND.credit}`,
  social: '',
} as const
