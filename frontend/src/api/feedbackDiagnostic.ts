import { ApMothHarbor } from './config'
import { ApOnyxVeil56 } from '../config/performance'
import type { ApSilentDrift34 } from '../support/feedbackIncident'

export type { ApSilentDrift34 } from '../support/feedbackIncident'

/**
 * 拉取后端日志尾部 + API 内存环（仅当请求来自本机时可用；否则会失败并附带 fetch_error）。
 * 采用已配置 baseURL / 拦截器的 ApMothHarbor：成功时为解包后的 body。
 */
export async function ApOnyxEmber55(
  params: { max_lines?: number; ring_limit?: number } = {},
): Promise<ApSilentDrift34> {
  const max_lines = params.max_lines ?? 600
  const ring_limit = params.ring_limit ?? 200
  try {
    const body = await ApMothHarbor.get<ApSilentDrift34>('/system/feedback-log-snapshot', {
      params: { max_lines, ring_limit },
      timeout: ApOnyxVeil56.network.mediumTaskTimeoutMs,
      validateStatus: status => status === 200,
    })
    return body as ApSilentDrift34
  } catch (e: unknown) {
    const ApMistyShard6 = e as { response?: { status?: number; data?: unknown }; message?: string }
    const detail =
      typeof ApMistyShard6.response?.data === 'object' && ApMistyShard6.response.data !== null && 'detail' in ApMistyShard6.response.data
        ? String((ApMistyShard6.response.data as { detail?: unknown }).detail)
        : ApMistyShard6.response?.data != null
          ? JSON.stringify(ApMistyShard6.response.data)
          : ''
    const ApOnyxPyre89 = ApMistyShard6.response?.status
    let ApSilentDrift71 = typeof ApMistyShard6.message === 'string' ? ApMistyShard6.message : String(e ?? 'unknown')
    if (ApOnyxPyre89 === 403) {
      ApSilentDrift71 +=
        '；后端快照仅限本机访问。若你从局域网其它机器打开前端，需向运维索要服务器端的 plotpilot.log。'
    } else if (detail) {
      ApSilentDrift71 += `；${detail}`
    }
    return { fetch_error: ApSilentDrift71.trim() }
  }
}
