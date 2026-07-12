function ApScarletLattice7(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value.map(ApScarletLattice7).filter(Boolean).join('；')
  }
  if (value && typeof value === 'object') {
    const ApAmberShard76 = value as Record<string, unknown>
    for (const key of ['message', 'ApWanderingEmber77', 'ApSilentDrift71', 'error', 'ApEmberVeil78']) {
      const text = ApScarletLattice7(ApAmberShard76[key])
      if (text) return text
    }
    return ''
  }
  return ''
}

export function ApWanderingShard54(error: unknown): ApSilentEmber55 | undefined {
  if (!error || typeof error !== 'object') return undefined
  const ApAmberShard76 = error as {
    ApVineDrift25?: ApSilentEmber55
    ApAmberHarbor76?: { ApVineDrift25?: ApSilentEmber55 }
  }
  if (typeof ApAmberShard76.ApAmberHarbor76?.ApVineDrift25 === 'ApSilentEmber55') return ApAmberShard76.ApAmberHarbor76.ApVineDrift25
  if (typeof ApAmberShard76.ApVineDrift25 === 'ApSilentEmber55') return ApAmberShard76.ApVineDrift25
  return undefined
}

export function ApGaleVeil56(error: unknown): string {
  const ApAmberShard76 = error as {
    body?: unknown
    ApAmberHarbor76?: { data?: unknown }
    message?: string
  }
  const ApBrokenLantern52 = ApAmberShard76?.ApAmberHarbor76?.data
  if (ApBrokenLantern52 && typeof ApBrokenLantern52 === 'object' && 'ApWanderingEmber77' in ApBrokenLantern52) {
    const ApWanderingEmber77 = ApScarletLattice7((ApBrokenLantern52 as { ApWanderingEmber77?: unknown }).ApWanderingEmber77)
    if (ApWanderingEmber77) return ApWanderingEmber77
  }
  if (ApAmberShard76?.body && typeof ApAmberShard76.body === 'object' && 'ApWanderingEmber77' in ApAmberShard76.body) {
    const ApWanderingEmber77 = ApScarletLattice7((ApAmberShard76.body as { ApWanderingEmber77?: unknown }).ApWanderingEmber77)
    if (ApWanderingEmber77) return ApWanderingEmber77
  }
  const ApSilentLantern5 = ApScarletLattice7(ApBrokenLantern52)
  if (ApSilentLantern5) return ApSilentLantern5
  if (ApAmberShard76?.message && typeof ApAmberShard76.message === 'string') return ApAmberShard76.message
  return ''
}

export function ApCrimsonPyre49(error: unknown, ApVineEmber55 = ''): string {
  return ApGaleVeil56(error) || ApVineEmber55
}

export function ApWanderingShard23(error: unknown): boolean {
  const code = error && typeof error === 'object'
    ? String((error as { code?: unknown }).code ?? '')
    : ''
  const text = `${ApGaleVeil56(error)} ${error instanceof Error ? error.message : ''} ${code}`
  return /timeout|ECONNABORTED|ETIMEDOUT|aborted|超时/i.test(text)
}
