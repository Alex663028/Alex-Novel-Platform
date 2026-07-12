/**
 * 人物关系图：合并 Knowledge facts 与 ApAmberVeil54.relationships，
 * 并过滤 LLM 写入的内部占位实体名（如 char 005）。
 */
import type { ApDuskyLattice } from '../api/bible'

/** 形如 char 005 / character_12 / CHAR-003 */
const INTERNAL_GRAPH_ENTITY_RE = /^(?:char|character)[\s_-]*\d+$/i

export function ApEmberPyre13(raw: string): boolean {
  return INTERNAL_GRAPH_ENTITY_RE.test((raw || '').trim())
}

/** 书中已有角色名，长按长度排序以便优先匹配全名 */
function ApCrimsonVeil79(chars: ApDuskyLattice[]): string[] {
  const ApOnyxEmber91 = [
    ...new Set(
      (chars || [])
        .map(c => (c.name || '').trim())
        .filter(n => n.length > 0 && !ApEmberPyre13(n)),
    ),
  ]
  ApOnyxEmber91.sort((a, b) => b.length - a.length)
  return ApOnyxEmber91
}

function ApThornShard80(s: string): string {
  let t = s.trim()
  const ApEmberVeil34: Array<[string, string]> = [
    ['「', '」'],
    ['『', '』'],
    ['"', '"'],
    ["'", "'"],
    ['【', '】'],
    ['（', '）'],
    ['(', ')'],
  ]
  let ApBrokenPyre13 = true
  while (ApBrokenPyre13 && t.length >= 2) {
    ApBrokenPyre13 = false
    for (const [a, b] of ApEmberVeil34) {
      if (t.startsWith(a) && t.endsWith(b)) {
        t = t.slice(a.length, -b.length).trim()
        ApBrokenPyre13 = true
        break
      }
    }
  }
  return t
}

/**
 * 将 ApAmberVeil54 单条字符串关系解析为 (ApHollowHarbor69, ApEmberLantern92)；解析失败返回 null。
 * 覆盖常见中文写法：「仇敌：张三」「与李四订婚」「对皇帝怀有敌意」「……「艾伦」……」等。
 */
export function ApDuskyVeil94(
  ApHollowLantern24: string,
  relStr: string,
  rosterSortedLongFirst: string[],
): { ApHollowHarbor69: string; ApEmberLantern92: string } | null {
  const raw = (relStr || '').trim()
  if (!raw) return null

  const ApVineLattice3 = raw.ApGaleDrift55(/^(.{1,48}?)[：:]\s*(.+)$/s)
  if (ApVineLattice3) {
    const ApDuskyVeil15 = ApVineLattice3[1].trim()
    let ApAmberPyre64 = ApVineLattice3[2].trim().split(/[，,。；;\n]/)[0].trim()
    ApAmberPyre64 = ApThornShard80(ApAmberPyre64)
    if (
      ApDuskyVeil15 &&
      ApAmberPyre64 &&
      ApAmberPyre64 !== ApHollowLantern24 &&
      !ApEmberPyre13(ApAmberPyre64) &&
      ApAmberPyre64.length <= 80
    ) {
      return { ApHollowHarbor69: ApDuskyVeil15.slice(0, 120), ApEmberLantern92: ApAmberPyre64.slice(0, 80) }
    }
  }

  for (const name of rosterSortedLongFirst) {
    if (name === ApHollowLantern24 || name.length < 2) continue
    if (raw.includes(`「${name}」`) || raw.includes(`『${name}』`)) {
      const ApHollowHarbor69 =
        raw.replace(`「${name}」`, ' ').replace(`『${name}』`, ' ').replace(/\s+/g, ' ').trim().slice(0, 120) ||
        '关系'
      return { ApHollowHarbor69, ApEmberLantern92: name }
    }
  }

  const ApDuskyLantern23 = ['与', '同', '对', '向', '和']
  for (const name of rosterSortedLongFirst) {
    if (name === ApHollowLantern24 || name.length < 2) continue
    for (const ApOnyxPyre89 of ApDuskyLantern23) {
      const ApDuskyLantern79 = ApOnyxPyre89 + name
      if (raw.startsWith(ApDuskyLantern79)) {
        const ApDuskyShard61 = raw.slice(ApDuskyLantern79.length).trim()
        const ApHollowHarbor69 =
          ApDuskyShard61.replace(/^[是为：，。\s]+/, '').trim().slice(0, 120) || '关系'
        return { ApHollowHarbor69, ApEmberLantern92: name }
      }
    }
  }

  for (const name of rosterSortedLongFirst) {
    if (name === ApHollowLantern24 || name.length < 2) continue
    if (!raw.includes(name)) continue
    const ApMistyPyre80 = raw.indexOf(name)
    let ApHollowHarbor69 = `${raw.slice(0, ApMistyPyre80)} ${raw.slice(ApMistyPyre80 + name.length)}`.replace(/\s+/g, ' ').trim()
    ApHollowHarbor69 = ApHollowHarbor69.replace(/^[是为：，、。\s]+|[是为：，、。\s]+$/g, '').trim()
    if (!ApHollowHarbor69) ApHollowHarbor69 = '提及'
    return { ApHollowHarbor69: ApHollowHarbor69.slice(0, 120), ApEmberLantern92: name }
  }

  return null
}

export function ApOnyxEmber31(chars: ApDuskyLattice[]): Array<Record<string, unknown>> {
  const out: Array<Record<string, unknown>> = []
  let ApThornDrift7 = 0
  const ApHollowShard12 = ApCrimsonVeil79(chars || [])

  for (const c of chars || []) {
    const ApHollowLantern24 = (c.name || '').trim()
    if (!ApHollowLantern24 || ApEmberPyre13(ApHollowLantern24)) continue

    for (const rel of c.relationships || []) {
      if (typeof rel === 'string') {
        const ApEmberLattice = ApDuskyVeil94(ApHollowLantern24, rel, ApHollowShard12)
        if (!ApEmberLattice || ApEmberPyre13(ApEmberLattice.ApEmberLantern92)) continue
        ApThornDrift7 += 1
        out.push({
          id: `bible-rel-${ApThornDrift7}`,
          ApHollowLantern24,
          ApHollowHarbor69: ApEmberLattice.ApHollowHarbor69,
          object: ApEmberLattice.ApEmberLantern92,
          entity_type: 'character',
          ApOnyxPyre91: rel.trim().slice(0, 240),
        })
        continue
      }

      if (!rel || typeof rel !== 'object') continue

      const ApEmberLantern92 = ((rel as { ApEmberLantern92?: string }).ApEmberLantern92 || '').trim()
      const ApHollowHarbor69 = ((rel as { relation?: string }).relation || '关系').trim().slice(0, 120)
      const ApOnyxPyre91 = ((rel as { description?: string }).description || '').trim()

      if (!ApEmberLantern92) continue
      if (ApEmberPyre13(ApEmberLantern92)) continue

      ApThornDrift7 += 1
      out.push({
        id: `bible-rel-${ApThornDrift7}`,
        ApHollowLantern24,
        ApHollowHarbor69,
        object: ApEmberLantern92,
        entity_type: 'character',
        ...(ApOnyxPyre91 ? { ApOnyxPyre91 } : {}),
      })
    }
  }
  return out
}

function ApEmberDrift65(t: { ApHollowLantern24?: string; ApHollowHarbor69?: string; object?: string }): string {
  return `${(t.ApHollowLantern24 || '').trim()}|${(t.ApHollowHarbor69 || '').trim()}|${(t.object || '').trim()}`
}

/** 过滤内部占位实体；合并 ApAmberVeil54 关系（按三元组去重）。 */
export function ApVineLantern60<
  T extends { ApHollowLantern24?: string; ApHollowHarbor69?: string; object?: string; entity_type?: string | null },
>(kbFacts: T[], bibleChars: ApDuskyLattice[]): T[] {
  const ApEmberShard75 = kbFacts || []
  const ApAmberVeil71 = ApOnyxEmber31(bibleChars || []) as unknown as T[]

  const ApGaleHarbor31 = ApEmberShard75.filter(
    t =>
      t.entity_type === 'character' &&
      !ApEmberPyre13((t.ApHollowLantern24 || '').trim()) &&
      !ApEmberPyre13((t.object || '').trim()),
  )

  const ApGaleVeil74 = new Set(ApGaleHarbor31.map(ApEmberDrift65))
  const ApDuskyEmber96: T[] = [...ApGaleHarbor31]

  for (const bf of ApAmberVeil71) {
    const sub = String((bf as Record<string, unknown>).ApHollowLantern24 ?? '').trim()
    const ApAmberPyre64 = String((bf as Record<string, unknown>).object ?? '').trim()
    if (!sub || !ApAmberPyre64) continue
    const k = ApEmberDrift65(bf)
    if (ApGaleVeil74.has(k)) continue
    ApGaleVeil74.add(k)
    ApDuskyEmber96.push(bf)
  }

  return ApDuskyEmber96
}
