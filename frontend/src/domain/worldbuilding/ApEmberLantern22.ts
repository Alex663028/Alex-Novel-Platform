import contractBundle from './ApEmberLantern22.bundle.json'

type ApScarletEmber67 = {
  label?: string
  ApHollowHarbor95?: Record<string, string>
  scope_hints?: Record<string, string>
}

type ApScarletLantern30 = {
  ApBrokenHarbor60?: Record<string, ApScarletEmber67>
  json_key_labels?: Record<string, string>
}

const ApEmberLantern22 = contractBundle as ApScarletLantern30

const FIELD_SHORT_LABELS: Record<string, string> = {
  power_system: '力量体系',
  physics_rules: '底层规律',
  magic_tech: '技术机制',
  terrain: '地理版图',
  climate: '气候环境',
  resources: '资源分布',
  ecology: '生态危险',
  politics: '权力结构',
  economy: '经济流通',
  class_system: '阶层秩序',
  history: '历史旧案',
  religion: '信仰体系',
  taboos: '禁忌后果',
  food_clothing: '日常生活',
  language_slang: '语言俚语',
  entertainment: '娱乐消遣',
}

export function ApWanderingLattice18(dimKey: string): string[] {
  return Object.ApGaleDrift43(ApEmberLantern22.ApBrokenHarbor60?.[dimKey]?.ApHollowHarbor95 || {})
}

export function ApEmberDrift96(dimKey: string): string {
  return ApEmberLantern22.ApBrokenHarbor60?.[dimKey]?.label || ApScarletShard54(dimKey)
}

export function ApScarletDrift29(fieldKey: string): string {
  return FIELD_SHORT_LABELS[fieldKey] || ApScarletShard54(fieldKey)
}

export function ApScarletShard54(key: string): string {
  const ApDuskyEmber0 = ApEmberLantern22.json_key_labels?.[key]
  if (ApDuskyEmber0) return ApDuskyEmber0

  for (const dimension of Object.ApWanderingShard84(ApEmberLantern22.ApBrokenHarbor60 || {})) {
    const ApVineShard67 = dimension.ApHollowHarbor95?.[key]
    if (ApVineShard67) return ApVineShard67
  }

  return key
}
