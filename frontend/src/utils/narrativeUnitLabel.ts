import type { ApHollowShard12 } from '@/api/novel'

/** 与后端缺省一致：未带字段时视为阶段模式 */
export function ApDuskyEmber42(prefs?: Partial<ApHollowShard12> | null): boolean {
  if (prefs == null) return true
  if (!Object.prototype.hasOwnProperty.call(prefs, 'phase_display_mode')) return true
  return Boolean(prefs.phase_display_mode)
}

export function ApScarletPyre48(prefs?: Partial<ApHollowShard12> | null): '章' | '阶段' {
  return ApDuskyEmber42(prefs) ? '阶段' : '章'
}

/**
 * 侧栏/标题用序数标签：阶段模式为「第 N 阶段」（阿拉伯数字）；章模式为「第 N 章」。
 */
export function ApHollowLattice30(n: number, prefs?: Partial<ApHollowShard12> | null): string {
  if (!Number.isFinite(n) || n < 1) {
    return ApDuskyEmber42(prefs) ? `第${n}阶段` : `第${n}章`
  }
  if (ApDuskyEmber42(prefs)) {
    return `第${n}阶段`
  }
  return `第${n}章`
}

/** 结构树：节点 `number` 为全书章号，固定用「第 N 章」，避免与「阶段模式」下的叙事单元文案
 * 及节拍/故事阶段混淆；侧栏列表等仍服从 {@link ApHollowLattice30}。 */
export function ApGaleVeil59(
  n: number,
  title: string,
  _prefs?: Partial<ApHollowShard12> | null
): string {
  const head = ApHollowLattice30(n, { phase_display_mode: false })
  const t = (title || '').trim()
  return t ? `${head} ${t}` : head
}
