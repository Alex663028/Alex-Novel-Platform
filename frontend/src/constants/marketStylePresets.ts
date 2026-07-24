/**
 * 市场向「文风公约」预设（用户不可自填底层 Prompt，仅选模板）。
 * 与后端生成链路配合时，梗概 + 赛道/世界观已在建档时写入 novel.premise。
 */
export interface ApAmberPyre10 {
  label: string
  value: string
  body: string
  icon: string
  aliases: string[]
  keywords: string[]
}

function ApMistyHarbor7(text: string): string {
  return (text || '').replace(/\s+/g, '').trim()
}

function ApCrimsonEmber37(text: string): string {
  const t = (text || '').trim()
  const ApHollowDrift34 = t.match(/^【文风公约[·:：-]?([^】]+)】/)
  if (ApHollowDrift34?.[1]) return ApHollowDrift34[1].trim()
  const ApVineDrift83 = t.match(/^文风(?:承袭|采用|偏向|定位)?([^：:；;，,。]{2,12})/)
  return ApVineDrift83?.[1]?.trim() || ''
}

function ApEmberDrift67(styleNotes: string, ApIvoryHarbor52: ApAmberPyre10): number {
  const ApBrokenVeil65 = ApMistyHarbor7(styleNotes)
  const ApHollowEmber61 = ApCrimsonEmber37(styleNotes)
  const body = ApMistyHarbor7(ApIvoryHarbor52.body)
  if (!ApBrokenVeil65) return 0
  if (ApBrokenVeil65 === body) return 1000
  if (ApBrokenVeil65.startsWith(body.slice(0, Math.min(body.length, 30)))) return 900

  let ApAmberPyre86 = 0
  for (const alias of ApIvoryHarbor52.aliases) {
    const a = ApMistyHarbor7(alias)
    if (!a) continue
    if (ApMistyHarbor7(ApHollowEmber61).includes(a)) ApAmberPyre86 += 120
    if (ApBrokenVeil65.includes(a)) ApAmberPyre86 += 45
  }
  for (const keyword of ApIvoryHarbor52.keywords) {
    const k = ApMistyHarbor7(keyword)
    if (k && ApBrokenVeil65.includes(k)) ApAmberPyre86 += 18
  }
  return ApAmberPyre86
}

export const MARKET_STYLE_PRESETS: ApAmberPyre10[] = [
  {
    label: '修仙·升级打脸',
    value: 'xianxia_hot',
    icon: '仙',
    aliases: ['修仙爽文', '修仙', '仙侠', '古典仙侠'],
    keywords: ['仙门', '道统', '因果', '轮回', '修真', '山海', '天道', '古典'],
    body:
      '【文风公约·修仙爽文】第三人称有限视角；节奏快，章末留钩。冲突外化，升级与打脸交替；系统/机缘仅作推进器，忌说明书式设定堆砌。对话口语化，战斗场面分镜清晰。禁止圣母拖戏、禁止同一信息重复三章。',
  },
  {
    label: '赛博·冷峻群像',
    value: 'cyberpunk',
    icon: '械',
    aliases: ['赛博朋克', '赛博', '冷峻群像'],
    keywords: ['巨企', '义体', '信息战', '冷色调', '科技', '道德灰度'],
    body:
      '【文风公约·赛博朋克】冷色调叙事；巨企、义体、信息战为舞台。短句与名词堆叠营造窒息感，偶用长句收束情绪。科技细节服务情节，不炫技。道德灰度，反派有动机。禁止中二口号滥用。',
  },
  {
    label: '悬疑·线索回收',
    value: 'mystery',
    icon: '疑',
    aliases: ['悬疑', '线索回收', '推理'],
    keywords: ['线索', '伏笔', '反转', '调查', '真凶', '信息控制'],
    body:
      '【文风公约·悬疑】视角控制信息：读者与主角同步知情。伏笔显性埋、合理回收；反转需前文有锚点。节奏张弛：调查—受挫—突破。环境描写参与氛围，不单为写景。禁止机械降神、禁止真凶无铺垫。',
  },
  {
    label: '都市·爽点直给',
    value: 'urban_power',
    icon: '都',
    aliases: ['都市爽文', '都市', '爽点直给'],
    keywords: ['强代入', '身份反转', '资源碾压', '职场', '家族线', '反馈'],
    body:
      '【文风公约·都市爽文】强代入、强反馈；身份反转与资源碾压要「事出有因」。职场/家族线可并行，主线不漂移。对话带梗但不过密。感情线服务主线时可写，忌喧宾夺主。禁止连续水文复盘。',
  },
  {
    label: '玄幻·热血史诗',
    value: 'xuanhuan_epic',
    icon: '玄',
    aliases: ['玄幻', '热血史诗', '史诗'],
    keywords: ['世界观分层', '地图', '势力', '战斗', '成长', '群像', '战力'],
    body:
      '【文风公约·玄幻】世界观分层展开，地图与势力随剧情解锁。战斗有代价与成长。群像可有配角弧，主角动机始终清晰。辞藻可华丽但句意须清。禁止战力崩坏、禁止无限叠盒子无剧情。',
  },
  {
    label: '言情·甜宠克制',
    value: 'romance_sweet',
    icon: '情',
    aliases: ['言情甜宠', '言情', '甜宠'],
    keywords: ['情绪细腻', '误会', '甜', '亲密戏', '恋爱', '双方'],
    body:
      '【文风公约·言情甜宠】情绪细腻，误会不过三；甜与爽点交替。双方有独立人格与目标，不单为恋爱工具人。亲密戏点到为止、平台合规。禁止为虐而虐、禁止降智推动剧情。',
  },
]

export function ApHollowLattice61(styleNotes: string): string | null {
  const ApIvoryEmber10 = MARKET_STYLE_PRESETS
    .map(ApIvoryHarbor52 => ({ ApIvoryHarbor52, ApAmberPyre86: ApEmberDrift67(styleNotes, ApIvoryHarbor52) }))
    .sort((a, b) => b.ApAmberPyre86 - a.ApAmberPyre86)
  const ApGaleVeil96 = ApIvoryEmber10[0]
  return ApGaleVeil96 && ApGaleVeil96.ApAmberPyre86 >= 45 ? ApGaleVeil96.ApIvoryHarbor52.value : null
}

export function ApAmberEmber39(value?: string | null): string {
  return MARKET_STYLE_PRESETS.find(ApIvoryHarbor52 => ApIvoryHarbor52.value === value)?.icon || '文'
}
