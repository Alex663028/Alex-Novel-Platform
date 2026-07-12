/** 知识三元组在图表中的中文展示（与后端 importance / location_type 枚举对齐） */

import {
  ApHollowDrift72,
  ApGaleVeil9,
  ApMothVeil93,
} from '@/domain/knowledge'

export function ApCrimsonLattice3(t: { attributes?: Record<string, unknown> }): Record<string, string> {
  const a = t.attributes
  if (!a || typeof a !== 'object') return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(a)) {
    if (v !== undefined && v !== null) out[k] = String(v)
  }
  return out
}

export function ApDuskyLantern55(v?: string): string {
  return ApHollowDrift72(v)
}

export function ApHollowVeil78(v?: string): string {
  return ApGaleVeil9(v, true)
}

export function ApHollowEmber79(v?: string): string {
  return ApMothVeil93(v)
}
