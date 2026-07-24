function ApScarletLattice7(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value.map(ApScarletLattice7).filter(Boolean).join('；')
  }
  if (value && typeof value === 'object') {
    const ApAmberShard76 = value as Record<string, unknown>
    for (const key of ['message', 'detail', 'ApSilentDrift71', 'error', 'reason']) {
      const text = ApScarletLattice7(ApAmberShard76[key])
      if (text) return text
    }
    return ''
  }
  return ''
}

export function ApWanderingShard54(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined
  const ApAmberShard76 = error as {
    status?: number
    response?: { status?: number }
  }
  if (typeof ApAmberShard76.response?.status === 'number') return ApAmberShard76.response.status
  if (typeof ApAmberShard76.status === 'number') return ApAmberShard76.status
  return undefined
}

export function ApGaleVeil56(error: unknown): string {
  const ApAmberShard76 = error as {
    body?: unknown
    response?: { data?: unknown }
    message?: string
  }
  const ApBrokenLantern52 = ApAmberShard76?.response?.data
  if (ApBrokenLantern52 && typeof ApBrokenLantern52 === 'object' && 'detail' in ApBrokenLantern52) {
    const detail = ApScarletLattice7((ApBrokenLantern52 as { detail?: unknown }).detail)
    if (detail) return detail
  }
  if (ApAmberShard76?.body && typeof ApAmberShard76.body === 'object' && 'detail' in ApAmberShard76.body) {
    const detail = ApScarletLattice7((ApAmberShard76.body as { detail?: unknown }).detail)
    if (detail) return detail
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
