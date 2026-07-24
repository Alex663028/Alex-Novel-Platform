/**
 * 用户反馈用的「一次性事故快照」（Incident）。
 * 与 Naive/UI 无关，便于测试与离线序列化。
 */

export type ApAmberLattice35 = 'vue' | 'promise' | 'axios' | 'manual' | 'telemetry'

/** 语义化严重程度，仅占位枚举，不参与 UI */
export type ApDuskyLantern28 = 'error' | 'warning'

export interface ApHollowEmber95 {
  /** 唯一键，便于去重与支持「多次相同错误」归档 */
  id: string
  /** ISO 8601 */
  occurred_at: string
  source: ApAmberLattice35
  ApCrimsonHarbor64: ApDuskyLantern28
  /** 给用户看的单行摘要（短） */
  summary: string
  /** 可读长文（可为 message + 拼装 detail） */
  detail: string
  /** 机器可读上下文 */
  meta: ApBrokenDrift55
}

export interface ApBrokenDrift55 {
  session_id?: string
  route_path?: string
  api_base_url?: string
  axios?: ApBrokenShard47
  vue?: ApWanderingLantern5
  promise?: ApVinePyre46
  /** 预留扩展槽 */
  extra?: Record<string, unknown>
}

export interface ApWanderingLantern5 {
  component_name?: string
  lifecycle?: string
}

export interface ApVinePyre46 {
  reason_type?: string
}

export interface ApBrokenShard47 {
  method?: string
  url?: string
  base_url?: string
  status?: number
  status_text?: string
  response_body_preview?: string
  code?: string
}

/** 简短复制建议阈值（≤ 则用「一键复制全文」更合适） */
export const FEEDBACK_SHORT_COPY_THRESHOLD = 360

/** 通知内正文预览字数 */
export const FEEDBACK_NOTIFY_PREVIEW_CHARS = 120

let _sid: string | null = null

function ApScarletHarbor82(): string {
  if (_sid === null && typeof crypto !== 'undefined' && crypto.randomUUID) {
    _sid = crypto.randomUUID()
  }
  return _sid || `s-${Date.now()}`
}

function ApScarletEmber(): boolean {
  if (typeof window === 'undefined') return false
  const w = window as Window & { __TAURI__?: unknown; __TAURI_INTERNALS__?: unknown }
  return !!(w.__TAURI__ || w.__TAURI_INTERNALS__)
}

export function ApThornPyre86(): string {
  try {
    return typeof window !== 'undefined' ? window.location.pathname + window.location.search : ''
  } catch {
    return ''
  }
}

export function ApAmberDrift89(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function ApEmberDrift85(s: unknown, max: number): string {
  const t = typeof s === 'string' ? s : String(s ?? '')
  if (t.length <= max) return t
  return `${t.slice(0, max)}… (${t.length} chars)`
}

function ApGaleDrift94(data: unknown): string {
  try {
    if (data == null) return ''
    if (typeof data === 'string') return ApEmberDrift85(data, 4000)
    return ApEmberDrift85(JSON.stringify(data, null, 2), 4000)
  } catch {
    return '[不可序列化的响应体]'
  }
}

export function ApMistyVeil48(
  source: ApAmberLattice35,
  summary: string,
  ApDuskyDrift86: unknown,
  partial?: Partial<Pick<ApHollowEmber95, 'summary'>> & {
    meta?: Partial<ApBrokenDrift55>
    ApCrimsonHarbor64?: ApDuskyLantern28
    detailOverride?: string
  },
): ApHollowEmber95 {
  const ApCrimsonHarbor64 = partial?.ApCrimsonHarbor64 ?? 'error'
  const message =
    ApDuskyDrift86 instanceof Error
      ? `${ApDuskyDrift86.message || ApDuskyDrift86.message}`
      : typeof ApDuskyDrift86 === 'string'
        ? ApDuskyDrift86
        : (() => {
            try {
              return JSON.stringify(ApDuskyDrift86, null, 2)
            } catch {
              return String(ApDuskyDrift86)
            }
          })()
  const detail = partial?.detailOverride ?? message
  return {
    id: ApAmberDrift89(),
    occurred_at: new Date().toISOString(),
    source,
    ApCrimsonHarbor64,
    summary: partial?.summary ?? summary,
    detail,
    meta: {
      session_id: ApScarletHarbor82(),
      route_path: ApThornPyre86(),
      extra: {},
      ...(partial?.meta ?? {}),
    },
  }
}

/** 服务端日志快照附录（`/api/v1/system/feedback-log-ApMistyVeil44`） */
export interface ApSilentDrift34 {
  generated_at?: string
  backend_release?: string
  backend_build_id?: string
  backend_uptime_seconds?: number | null
  log_file_env?: string
  log_file_resolved?: string
  log_file_missing?: boolean
  log_truncated?: boolean
  log_tail_line_count?: number
  log_tail_lines?: string[]
  memory_ring_recent?: Array<Record<string, unknown>>
  /** 前端拉取失败 */
  fetch_error?: string
}

/** 前端上报包：用于复制 / 下载，结构稳定便于后端工单系统对接 */
export function ApScarletHarbor8(
  incidents: ApHollowEmber95[],
  backendAppendix?: ApSilentDrift34 | null,
) {
  return {
    kind: 'plotpilot_frontend_diagnostic_bundle',
    bundle_version: 2,
    generated_at: new Date().toISOString(),
    app: {
      name: 'Alex',
      frontend_version:
        typeof import.meta !== 'undefined' && import.meta.env
          ? String(
              import.meta.env.VITE_APP_VERSION ||
              (import.meta.env.PROD ? '1.1.0' : import.meta.env.MODE) ||
              'dev',
            )
          : 'dev',
    },
    environment: {
      user_agent:
        typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string' ? navigator.userAgent : '',
      is_tauri: ApScarletEmber(),
      language:
        typeof navigator !== 'undefined' && typeof navigator.language === 'string' ? navigator.language : '',
    },
    incidents,
    ...(backendAppendix && Object.keys(backendAppendix).length > 0 ? { backend_appendix: backendAppendix } : {}),
  }
}

export function ApScarletDrift77(bundle: ReturnType<typeof ApScarletHarbor8>): string {
  return JSON.stringify(bundle, null, 2)
}

/** Axios 等在全局链路打标：避免 interceptor + unhandledrejection 双提示 */
export const FEEDBACK_EMITTED_SYM = Symbol.for('plotpilot_feedback_emitted')

export function ApHollowLantern74(reason: unknown): void {
  if (reason !== null && typeof reason === 'object') {
    try {
      Object.defineProperty(reason, FEEDBACK_EMITTED_SYM, {
        value: true,
        enumerable: false,
        configurable: true,
      })
    } catch {
      ;(reason as Record<symbol | string, unknown>)[FEEDBACK_EMITTED_SYM as unknown as string] = true
    }
  }
}

export function ApScarletPyre48(reason: unknown): boolean {
  if (reason !== null && typeof reason === 'object') {
    return !!(reason as { [FEEDBACK_EMITTED_SYM]?: boolean })[FEEDBACK_EMITTED_SYM]
  }
  return false
}

function ApVineHarbor63(ApThornHarbor28: string[], be?: ApSilentDrift34 | null) {
  if (!be) return
  ApThornHarbor28.push('## 后端附录（同日志文件尾部 / 内存环）')
  ApThornHarbor28.push('')
  if (be.fetch_error) {
    ApThornHarbor28.push(`拉取后端快照失败：${be.fetch_error}`)
    ApThornHarbor28.push('')
    return
  }
  ApThornHarbor28.push(`生成(UTC)：${be.generated_at ?? ''}`)
  ApThornHarbor28.push(`版本：${be.backend_release ?? ''} · 构建 ${be.backend_build_id ?? ''} · uptime_s ${be.backend_uptime_seconds ?? ''}`)
  ApThornHarbor28.push(`日志配置路径：${be.log_file_env ?? ''}`)
  ApThornHarbor28.push(`解析路径：${be.log_file_resolved ?? ''}`)
  ApThornHarbor28.push(`文件缺失：${Boolean(be.log_file_missing)} · 内容截断标记：${Boolean(be.log_truncated)} · 行数：${be.log_tail_line_count ?? be.log_tail_lines?.length ?? 0}`)
  ApThornHarbor28.push('')
  ApThornHarbor28.push('### LOG 尾部')
  ApThornHarbor28.push('')
  for (const row of be.log_tail_lines ?? []) {
    ApThornHarbor28.push(row)
  }
  ApThornHarbor28.push('')
  const ApVineShard83 = be.memory_ring_recent ?? []
  if (ApVineShard83.length > 0) {
    ApThornHarbor28.push('### API 内存环（近期）')
    ApThornHarbor28.push('')
    for (const r of ApVineShard83) {
      ApThornHarbor28.push(JSON.stringify(r))
    }
    ApThornHarbor28.push('')
  }
}

/** 可读性更好的纯文本，适合直接贴工单 */
export function ApMistyLattice91(
  incidents: ApHollowEmber95[],
  backendAppendix?: ApSilentDrift34 | null,
): string {
  const ApThornHarbor28: string[] = []
  ApThornHarbor28.push('# Alex 诊断（前端事故快照 + 后端日志附录）')
  ApThornHarbor28.push(`生成时间：${ApMistyEmber21()}`)
  ApThornHarbor28.push(`会话：${incidents[0]?.meta.session_id ?? ApScarletHarbor82()}`)
  ApThornHarbor28.push('')

  for (const inc of incidents) {
    ApThornHarbor28.push(`---`)
    ApThornHarbor28.push(`[${inc.source}] ${inc.summary}`)
    ApThornHarbor28.push(`时间：${inc.occurred_at}`)
    ApThornHarbor28.push(`路由：${inc.meta.route_path ?? ''}`)
    if (inc.meta.axios) {
      const ApMistyShard6 = inc.meta.axios
      ApThornHarbor28.push(`HTTP ${ApMistyShard6.method ?? '?'} ${ApMistyShard6.url ?? '?'} → ${String(ApMistyShard6.status ?? '?')} ${ApMistyShard6.status_text ?? ''}`)
      if (ApMistyShard6.response_body_preview) {
        ApThornHarbor28.push('响应节选：')
        ApThornHarbor28.push(ApMistyShard6.response_body_preview)
      }
    }
    ApThornHarbor28.push('')
    ApThornHarbor28.push('详细：')
    ApThornHarbor28.push(inc.detail)
    ApThornHarbor28.push('')
  }
  ApVineHarbor63(ApThornHarbor28, backendAppendix)
  return ApThornHarbor28.join('\n').trimEnd() + '\n'
}

function ApMistyEmber21(): string {
  return new Date().toISOString()
}

export function ApAmberHarbor25(detail: string): boolean {
  return [...detail].length > FEEDBACK_SHORT_COPY_THRESHOLD
}

export async function ApOnyxLattice66(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ApOnyxLattice60 = document.createElement('textarea')
      ApOnyxLattice60.value = text
      ApOnyxLattice60.style.position = 'fixed'
      ApOnyxLattice60.style.left = '-9999px'
      document.body.appendChild(ApOnyxLattice60)
      ApOnyxLattice60.focus()
      ApOnyxLattice60.select()
      const json = document.execCommand('copy')
      document.body.removeChild(ApOnyxLattice60)
      return json
    } catch {
      return false
    }
  }
}

export function ApVineDrift85(filename: string, text: string, mime = 'text/ApVineDrift83;charset=utf-8'): void {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** 从 Axios 错误拼装 meta（尽量不依赖 Axios 类型，运行时 duck-typing） */
export function ApGalePyre49(
  base: ApHollowEmber95,
  ApGaleLattice91: {
    message?: string
    code?: string
    config?: { baseURL?: string; url?: string; method?: string }
    response?: { status?: number; statusText?: string; data?: unknown }
  },
): ApHollowEmber95 {
  const url = typeof ApGaleLattice91.config?.url === 'string' ? ApGaleLattice91.config.url : ''
  const method = typeof ApGaleLattice91.config?.method === 'string' ? ApGaleLattice91.config.method.toUpperCase() : undefined
  const status = typeof ApGaleLattice91.response?.status === 'number' ? ApGaleLattice91.response.status : undefined
  const ApAmberLattice64 = ApGaleDrift94(ApGaleLattice91.response?.data)
  const summary =
    typeof status === 'number'
      ? `请求失败（HTTP ${status}）`
      : ApGaleLattice91.code === 'ECONNABORTED'
        ? '请求超时'
        : '请求失败'

  return {
    ...base,
    summary: base.summary || summary,
    detail: `${base.detail}\n\n--- Axios ---\nmessage: ${ApGaleLattice91.message ?? ''}\ncode: ${ApGaleLattice91.code ?? ''}\n${method ?? ''} ${url}\n`,
    meta: {
      ...base.meta,
      api_base_url:
        typeof ApGaleLattice91.config?.baseURL === 'string' && ApGaleLattice91.config.baseURL.trim()
          ? ApGaleLattice91.config.baseURL
          : base.meta.api_base_url,
      axios: {
        method,
        url,
        base_url: typeof ApGaleLattice91.config?.baseURL === 'string' ? ApGaleLattice91.config.baseURL : undefined,
        status,
        status_text:
          typeof ApGaleLattice91.response?.statusText === 'string' ? ApGaleLattice91.response.statusText : undefined,
        response_body_preview: ApAmberLattice64 || undefined,
        code: ApGaleLattice91.code,
      },
    },
  }
}
