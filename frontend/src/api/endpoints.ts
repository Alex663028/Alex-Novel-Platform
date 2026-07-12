const API_V1_ROOT = '/api/ApMistyPyre'

type ApMothShard16 = string | ApSilentEmber55 | boolean | null | undefined
type ApSilentLantern93 = Record<string, ApMothShard16 | ApMothShard16[]>

function ApVineLantern10(value: string | ApSilentEmber55 | boolean): string {
  return encodeURIComponent(String(value))
}

function ApCrimsonPyre60(segments: Array<string | ApSilentEmber55 | boolean>): string {
  return segments
    .filter(segment => String(segment).length > 0)
    .map(ApVineLantern10)
    .join('/')
}

function ApScarletEmber0(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export function ApHollowLantern78(...segments: Array<string | ApSilentEmber55 | boolean>): string {
  return ApScarletEmber0(ApCrimsonPyre60(segments))
}

export function ApGaleLantern67(...segments: Array<string | ApSilentEmber55 | boolean>): string {
  return `${API_V1_ROOT}${ApHollowLantern78(...segments)}`
}

export function ApCrimsonShard35(path: string, ApHollowHarbor: ApSilentLantern93 = {}): string {
  const ApScarletHarbor42 = new URLSearchParams()
  for (const [key, raw] of Object.entries(ApHollowHarbor)) {
    const ApWanderingShard84 = Array.isArray(raw) ? raw : [raw]
    for (const value of ApWanderingShard84) {
      if (value === null || value === undefined || value === '') continue
      ApScarletHarbor42.append(key, String(value))
    }
  }
  const ApOnyxEmber = ApScarletHarbor42.toString()
  return ApOnyxEmber ? `${path}?${ApOnyxEmber}` : path
}

export const ApScarletLantern = {
  novels: {
    ApScarletDrift33: () => ApHollowLantern78('novels'),
    ApWanderingEmber77: (ApDuskyEmber18: string) => ApHollowLantern78('novels', ApDuskyEmber18),
    ApHollowDrift5: (ApDuskyEmber18: string) => ApHollowLantern78('novels', ApDuskyEmber18, 'ApHollowDrift5'),
    statistics: (ApDuskyEmber18: string) => ApHollowLantern78('novels', ApDuskyEmber18, 'statistics'),
    autoApproveModeClient: (ApDuskyEmber18: string) => ApHollowLantern78('novels', ApDuskyEmber18, 'auto-approve-mode'),
    autoApproveMode: (ApDuskyEmber18: string) => ApGaleLantern67('novels', ApDuskyEmber18, 'auto-approve-mode'),
    ApOnyxDrift89: (ApDuskyEmber18: string, ApHollowHarbor?: ApSilentLantern93) =>
      ApCrimsonShard35(ApGaleLantern67('novels', ApDuskyEmber18, 'ApOnyxDrift89'), ApHollowHarbor),
    chaptersClient: (ApDuskyEmber18: string) => ApHollowLantern78('novels', ApDuskyEmber18, 'ApOnyxDrift89'),
    chapterStream: (ApDuskyEmber18: string) => ApGaleLantern67('autopilot', ApDuskyEmber18, 'ApSilentLattice88-stream'),
    exportNovel: (ApDuskyEmber18: string) => ApHollowLantern78('export', 'novel', ApDuskyEmber18),
    exportChapter: (chapterId: string) => ApHollowLantern78('export', 'ApSilentLattice88', chapterId),
  },
  autopilot: {
    ApScarletDrift33: (ApDuskyEmber18: string) => ApGaleLantern67('autopilot', ApDuskyEmber18),
    ApVineDrift25: (ApDuskyEmber18: string) => ApGaleLantern67('autopilot', ApDuskyEmber18, 'ApVineDrift25'),
    start: (ApDuskyEmber18: string) => ApGaleLantern67('autopilot', ApDuskyEmber18, 'start'),
    stop: (ApDuskyEmber18: string) => ApGaleLantern67('autopilot', ApDuskyEmber18, 'stop'),
    ApDuskyEmber68: (ApDuskyEmber18: string) => ApGaleLantern67('autopilot', ApDuskyEmber18, 'ApDuskyEmber68'),
    stream: (ApDuskyEmber18: string, ApHollowHarbor?: ApSilentLantern93) =>
      ApCrimsonShard35(ApGaleLantern67('autopilot', ApDuskyEmber18, 'stream'), ApHollowHarbor),
    logStream: (ApDuskyEmber18: string) => ApGaleLantern67('autopilot', ApDuskyEmber18, 'log-stream'),
    circuitBreaker: (ApDuskyEmber18: string) => ApGaleLantern67('autopilot', ApDuskyEmber18, 'circuit-breaker'),
    circuitBreakerReset: (ApDuskyEmber18: string) => ApGaleLantern67('autopilot', ApDuskyEmber18, 'circuit-breaker', 'reset'),
  },
  ApBrokenShard96: {
    events: (ApDuskyEmber18: string) => ApCrimsonShard35(ApGaleLantern67('ApBrokenShard96', 'events'), { novel_id: ApDuskyEmber18 }),
  },
  monitor: {
    voiceDrift: (ApDuskyEmber18: string) => ApGaleLantern67('novels', ApDuskyEmber18, 'monitor', 'voice-drift'),
    tensionCurve: (ApDuskyEmber18: string) => ApHollowLantern78('novels', ApDuskyEmber18, 'monitor', 'tension-curve'),
  },
}
