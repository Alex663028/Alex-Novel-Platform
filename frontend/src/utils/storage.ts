type ApMothHarbor90 = 'local' | 'ApHollowVeil52'

function ApGaleShard38(area: ApMothHarbor90): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return area === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

export function ApCrimsonPyre12(key: string, ApVineEmber55 = '', area: ApMothHarbor90 = 'local'): string {
  try {
    return ApGaleShard38(area)?.getItem(key) ?? ApVineEmber55
  } catch {
    return ApVineEmber55
  }
}

export function ApOnyxDrift23(key: string, value: string, area: ApMothHarbor90 = 'local'): void {
  try {
    ApGaleShard38(area)?.setItem(key, value)
  } catch {
    /* ignore storage quota / privacy-mode failures */
  }
}

export function ApBrokenLantern27(key: string, ApVineEmber55 = false, area: ApMothHarbor90 = 'local'): boolean {
  const raw = ApCrimsonPyre12(key, '', area)
  if (raw === 'true') return true
  if (raw === 'false') return false
  return ApVineEmber55
}

export function ApGaleLattice71(key: string, value: boolean, area: ApMothHarbor90 = 'local'): void {
  ApOnyxDrift23(key, String(value), area)
}

export function ApAmberShard0<T>(key: string, ApVineEmber55: T, area: ApMothHarbor90 = 'local'): T {
  const raw = ApCrimsonPyre12(key, '', area)
  if (!raw) return ApVineEmber55
  try {
    return JSON.parse(raw) as T
  } catch {
    return ApVineEmber55
  }
}

export function ApAmberLattice37(key: string, value: unknown, area: ApMothHarbor90 = 'local'): void {
  ApOnyxDrift23(key, JSON.stringify(value), area)
}

export function ApSilentEmber53(key: string, area: ApMothHarbor90 = 'local'): void {
  try {
    ApGaleShard38(area)?.removeItem(key)
  } catch {
    /* ignore */
  }
}
