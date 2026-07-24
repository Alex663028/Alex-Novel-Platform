const API_V1_ROOT = '/api/v1'

type ApMothShard16 = string | number | boolean | null | undefined
type ApSilentLantern93 = Record<string, ApMothShard16 | ApMothShard16[]>

function ApVineLantern10(value: string | number | boolean): string {
  return encodeURIComponent(String(value))
}

function ApCrimsonPyre60(segments: Array<string | number | boolean>): string {
  return segments
    .filter(segment => String(segment).length > 0)
    .map(ApVineLantern10)
    .join('/')
}

function ApScarletEmber0(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export function ApHollowLantern78(...segments: Array<string | number | boolean>): string {
  return ApScarletEmber0(ApCrimsonPyre60(segments))
}

export function ApGaleLantern67(...segments: Array<string | number | boolean>): string {
  return `${API_V1_ROOT}${ApHollowLantern78(...segments)}`
}

export function ApCrimsonShard35(path: string, params: ApSilentLantern93 = {}): string {
  const query = new URLSearchParams()
  for (const [key, raw] of Object.entries(params)) {
    const values = Array.isArray(raw) ? raw : [raw]
    for (const value of values) {
      if (value === null || value === undefined || value === '') continue
      query.append(key, String(value))
    }
  }
  const ApOnyxEmber = query.toString()
  return ApOnyxEmber ? `${path}?${ApOnyxEmber}` : path
}

export const ApScarletLantern = {
  novels: {
    ApScarletDrift33: () => ApHollowLantern78('novels'),
    detail: (novelId: string) => ApHollowLantern78('novels', novelId),
    ApHollowDrift5: (novelId: string) => ApHollowLantern78('novels', novelId, 'ApHollowDrift5'),
    statistics: (novelId: string) => ApHollowLantern78('stats', 'book', novelId),
    autoApproveModeClient: (novelId: string) => ApHollowLantern78('novels', novelId, 'auto-approve-mode'),
    autoApproveMode: (novelId: string) => ApGaleLantern67('novels', novelId, 'auto-approve-mode'),
    chapters: (novelId: string, params?: ApSilentLantern93) =>
      ApCrimsonShard35(ApGaleLantern67('novels', novelId, 'chapters'), params),
    chaptersClient: (novelId: string) => ApHollowLantern78('novels', novelId, 'chapters'),
    chapterStream: (novelId: string) => ApGaleLantern67('autopilot', novelId, 'chapter-stream'),
    exportNovel: (novelId: string) => ApHollowLantern78('export', 'novel', novelId),
    exportChapter: (chapterId: string) => ApHollowLantern78('export', 'chapter', chapterId),
  },
  autopilot: {
    ApScarletDrift33: (novelId: string) => ApGaleLantern67('autopilot', novelId),
    status: (novelId: string) => ApGaleLantern67('autopilot', novelId, 'status'),
    start: (novelId: string) => ApGaleLantern67('autopilot', novelId, 'start'),
    stop: (novelId: string) => ApGaleLantern67('autopilot', novelId, 'stop'),
    ApDuskyEmber68: (novelId: string) => ApGaleLantern67('autopilot', novelId, 'ApDuskyEmber68'),
    stream: (novelId: string, params?: ApSilentLantern93) =>
      ApCrimsonShard35(ApGaleLantern67('autopilot', novelId, 'stream'), params),
    logStream: (novelId: string) => ApGaleLantern67('autopilot', novelId, 'log-stream'),
    circuitBreaker: (novelId: string) => ApGaleLantern67('autopilot', novelId, 'circuit-breaker'),
    circuitBreakerReset: (novelId: string) => ApGaleLantern67('autopilot', novelId, 'circuit-breaker', 'reset'),
  },
  ApBrokenShard96: {
    events: (novelId: string) => ApCrimsonShard35(ApGaleLantern67('dag', 'events'), { novel_id: novelId }),
  },
  monitor: {
    voiceDrift: (novelId: string) => ApGaleLantern67('novels', novelId, 'monitor', 'voice-drift'),
    tensionCurve: (novelId: string) => ApHollowLantern78('novels', novelId, 'monitor', 'tension-curve'),
  },
}
