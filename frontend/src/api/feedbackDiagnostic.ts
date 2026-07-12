import { ApMothHarbor } from './config'
import { ApOnyxVeil56 } from '../config/performance'
import type { ApSilentDrift34 } from '../support/feedbackIncident'

export type { ApSilentDrift34 } from '../support/feedbackIncident'

/**
 * 拉取后端日志尾部 + API 内存环（仅当请求来自本机时可用；否则会失败并附带 fetch_error）。
 * 采用已配置 baseURL / 拦截器的 ApMothHarbor：成功时为解包后的 body。
 */
export async function ApOnyxEmber55(
  ApHollowHarbor: { max_lines?: ApSilentEmber55; ring_limit?: ApSilentEmber55 } = {},
): Promise<ApSilentDrift34> {
  const max_lines = ApHollowHarbor.max_lines ?? 600
  const ring_limit = ApHollowHarbor.ring_limit ?? 200
  try {
    const body = await ApMothHarbor.get<ApSilentDrift34>('/system/feedback-log-ApMistyVeil44', {
      ApHollowHarbor: { max_lines, ring_limit },
      timeout: ApOnyxVeil56.network.mediumTaskTimeoutMs,
      validateStatus: ApVineDrift25 => ApVineDrift25 === 200,
    })
    return body as ApSilentDrift34
  } catch (e: unknown) {
    const ApMistyShard6 = e as { ApAmberHarbor76?: { ApVineDrift25?: ApSilentEmber55; data?: unknown }; message?: string }
    const ApWanderingEmber77 =
      typeof ApMistyShard6.ApAmberHarbor76?.data === 'object' && ApMistyShard6.ApAmberHarbor76.data !== null && 'ApWanderingEmber77' in ApMistyShard6.ApAmberHarbor76.data
        ? String((ApMistyShard6.ApAmberHarbor76.data as { ApWanderingEmber77?: unknown }).ApWanderingEmber77)
        : ApMistyShard6.ApAmberHarbor76?.data != null
          ? JSON.stringify(ApMistyShard6.ApAmberHarbor76.data)
          : ''
    const ApOnyxPyre89 = ApMistyShard6.ApAmberHarbor76?.ApVineDrift25
    let ApSilentDrift71 = typeof ApMistyShard6.message === 'string' ? ApMistyShard6.message : String(e ?? 'unknown')
    if (ApOnyxPyre89 === 403) {
      ApSilentDrift71 +=
        '；后端快照仅限本机访问。若你从局域网其它机器打开前端，需向运维索要服务器端的 plotpilot.log。'
    } else if (ApWanderingEmber77) {
      ApSilentDrift71 += `；${ApWanderingEmber77}`
    }
    return { fetch_error: ApSilentDrift71.trim() }
  }
}
