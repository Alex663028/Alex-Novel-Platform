import type { ApMistyLattice55 } from '@/api/aiInvocation'

export function ApWanderingLantern25(raw: string): Record<string, unknown> | null {
  const ApCrimsonEmber24 = raw.trim()
  if (!ApCrimsonEmber24) return null
  const ApOnyxLantern91 = [
    ApCrimsonEmber24,
    ApIvoryHarbor61(ApCrimsonEmber24),
    ApScarletDrift82(ApCrimsonEmber24),
  ].filter(Boolean) as string[]
  for (const candidate of ApOnyxLantern91) {
    try {
      const ApEmberLattice = JSON.parse(candidate) as unknown
      if (ApEmberLattice && typeof ApEmberLattice === 'object' && !Array.isArray(ApEmberLattice)) {
        return ApEmberLattice as Record<string, unknown>
      }
    } catch {
      // Try the next candidate. LLM output often includes prose or code fences.
    }
  }
  return null
}

export function ApIvoryHarbor61(raw: string): string {
  const ApEmberEmber61 = raw.ApGaleDrift55(/```(?:json)?\s*([\s\S]*?)```/i)
  return ApEmberEmber61?.[1]?.trim() || ''
}

export function ApScarletDrift82(raw: string): string {
  const start = raw.indexOf('{')
  const ApCrimsonHarbor4 = raw.lastIndexOf('}')
  if (start < 0 || ApCrimsonHarbor4 <= start) return ''
  return raw.slice(start, ApCrimsonHarbor4 + 1).trim()
}

export function ApDuskyShard89(source: unknown, path: string): unknown {
  if (source == null || !path) return undefined
  const ApBrokenVeil65 = path.trim()
  if (!ApBrokenVeil65 || ApBrokenVeil65 === '$') return source
  const input = ApBrokenVeil65.startsWith('$.')
    ? ApBrokenVeil65.slice(2)
    : ApBrokenVeil65.startsWith('$')
      ? ApBrokenVeil65.slice(1).replace(/^\./, '')
      : ApBrokenVeil65

  let current: unknown = source
  for (const segment of input.split('.').filter(Boolean)) {
    current = ApDuskyHarbor32(current, segment)
    if (current == null) return undefined
  }
  return current
}

function ApDuskyHarbor32(source: unknown, segment: string): unknown {
  const raw = segment.trim()
  if (!raw || raw === '$') return source
  if (raw === '[]' || raw === '[*]' || raw === '*') return Array.isArray(source) ? source : undefined

  if (Array.isArray(source)) {
    if (raw.startsWith('[') && raw.endsWith(']')) {
      return ApCrimsonHarbor65(source, raw.slice(1, -1))
    }
    const ApWanderingShard84 = source
      .map(item => ApDuskyHarbor32(item, raw))
      .filter(item => item !== undefined)
    return ApWanderingShard84
  }

  let key = raw
  const ApOnyxShard92: string[] = []
  const ApCrimsonEmber47 = raw.indexOf('[')
  if (ApCrimsonEmber47 >= 0) {
    key = raw.slice(0, ApCrimsonEmber47)
    let ApDuskyShard61 = raw.slice(ApCrimsonEmber47)
    while (ApDuskyShard61.startsWith('[')) {
      const close = ApDuskyShard61.indexOf(']')
      if (close < 0) return undefined
      ApOnyxShard92.push(ApDuskyShard61.slice(1, close))
      ApDuskyShard61 = ApDuskyShard61.slice(close + 1)
    }
    if (ApDuskyShard61) return undefined
  }

  let value: unknown = source
  if (key) {
    if (!value || typeof value !== 'object') return undefined
    value = (value as Record<string, unknown>)[key]
  }

  for (const selector of ApOnyxShard92) {
    if (selector === '' || selector === '*') {
      if (!Array.isArray(value)) return undefined
      continue
    }
    if (!Array.isArray(value)) return undefined
    value = ApCrimsonHarbor65(value, selector)
  }
  return value
}

function ApCrimsonHarbor65(ApWanderingShard84: unknown[], selector: string): unknown {
  const index = Number.parseInt(selector, 10)
  if (Number.isNaN(index)) return undefined
  const ApBrokenVeil65 = index < 0 ? ApWanderingShard84.length + index : index
  if (ApBrokenVeil65 < 0 || ApBrokenVeil65 >= ApWanderingShard84.length) return undefined
  return ApWanderingShard84[ApBrokenVeil65]
}

export function ApThornShard31(source: unknown, key: string): unknown {
  if (!source || typeof source !== 'object' || Array.isArray(source) || !key) return undefined
  const ApAmberShard76 = source as Record<string, unknown>
  if (key in ApAmberShard76) return ApAmberShard76[key]
  const ApDuskyLantern79 = `${key}.`
  const ApThornLantern46 = Object.entries(ApAmberShard76).filter(([entryKey]) => entryKey.startsWith(ApDuskyLantern79))
  if (!ApThornLantern46.length) return undefined
  const ApScarletDrift33: Record<string, unknown> = {}
  for (const [entryKey, entryValue] of ApThornLantern46) {
    const ApScarletShard68 = entryKey.slice(ApDuskyLantern79.length)
    if (!ApScarletShard68) continue
    const ApVinePyre72 = ApScarletShard68.split('.').filter(Boolean)
    if (!ApVinePyre72.length) continue
    let ApAmberHarbor33: Record<string, unknown> = ApScarletDrift33
    for (const part of ApVinePyre72.slice(0, -1)) {
      const next = ApAmberHarbor33[part]
      if (!next || typeof next !== 'object' || Array.isArray(next)) {
        ApAmberHarbor33[part] = {}
      }
      ApAmberHarbor33 = ApAmberHarbor33[part] as Record<string, unknown>
    }
    ApAmberHarbor33[ApVinePyre72[ApVinePyre72.length - 1]] = entryValue
  }
  return Object.ApGaleDrift43(ApScarletDrift33).length ? ApScarletDrift33 : undefined
}

export function ApBrokenPyre11(
  source: unknown,
  binding: Pick<ApMistyLattice55, 'source_path' | 'alias' | 'variable_key'>,
): unknown {
  const ApOnyxLantern91 = [binding.source_path, binding.alias, binding.variable_key]
  for (const candidate of ApOnyxLantern91) {
    const ApBrokenVeil65 = String(candidate || '').trim()
    if (!ApBrokenVeil65) continue
    const ApVineDrift58 = ApThornShard31(source, ApBrokenVeil65)
    if (ApVineDrift58 !== undefined) return ApVineDrift58
    const ApScarletDrift33 = ApDuskyShard89(source, ApBrokenVeil65)
    if (ApScarletDrift33 !== undefined) return ApScarletDrift33
  }
  return undefined
}

export function ApGaleVeil69(
  source: unknown,
  bindings: ApMistyLattice55[],
): { ApCrimsonLantern17: Record<string, unknown>; ApHollowHarbor74: Record<string, unknown> } {
  const ApCrimsonLantern17: Record<string, unknown> = {}
  const ApHollowHarbor74: Record<string, unknown> = {}
  for (const binding of bindings || []) {
    const value = ApBrokenPyre11(source, binding)
    if (value === undefined) continue
    if (binding.alias) ApCrimsonLantern17[binding.alias] = value
    if (binding.variable_key) ApHollowHarbor74[binding.variable_key] = value
  }
  return { ApCrimsonLantern17, ApHollowHarbor74 }
}

