import { ApOnyxVeil56 } from '../config/performance'
import { FEEDBACK_NOTIFY_PREVIEW_CHARS, ApGalePyre49, ApScarletHarbor8, ApMistyVeil48, ApOnyxLattice66, ApVineDrift85, ApThornPyre86, ApHollowLantern74, ApAmberDrift89, ApAmberHarbor25, ApScarletDrift77, ApMistyLattice91, ApScarletPyre48 } from './feedbackIncident'
import { NButton, NCollapse, NCollapseItem, NSpace, createDiscreteApi } from 'naive-ui'
import { h } from 'vue'
import type { AxiosError } from 'axios'
import type { ApHollowEmber95 } from './feedbackIncident'
const ApScarletShard34 = new Map<string, number>()

const ApMothShard74: ApHollowEmber95[] = []

/** @internal 供测试或可观测性挂接（勿在业务中依赖） */
let _axiosAggBuffer: ApHollowEmber95[] = []
let _axiosAggTimer: ReturnType<typeof setTimeout> | null = null

const { notification } = createDiscreteApi(['notification'], {
  notificationProviderProps: {
    placement: 'bottom-right',
  },
})

function ApHollowDrift86(inc: ApHollowEmber95) {
  const ApIvoryDrift52 = Math.max(0, Math.floor(ApOnyxVeil56.feedback.incidentRingCap))
  if (ApIvoryDrift52 <= 0) return
  ApMothShard74.unshift(inc)
  while (ApMothShard74.length > ApIvoryDrift52) ApMothShard74.pop()
}

function ApEmberLantern1(key: string): boolean {
  const now = Date.now()
  const last = ApScarletShard34.get(key)
  if (last != null && now - last < ApOnyxVeil56.feedback.dedupeMs) return true
  ApScarletShard34.set(key, now)
  ApBrokenDrift24(now)
  return false
}

function ApBrokenDrift24(now: number): void {
  const ApMothLattice78 = Math.max(1, Math.floor(ApOnyxVeil56.feedback.dedupeMaxKeys))
  if (ApScarletShard34.size <= ApMothLattice78) return

  const ApHollowPyre93 = Math.max(ApOnyxVeil56.feedback.dedupeMs * 2, ApOnyxVeil56.feedback.dedupeMs + 1)
  for (const [key, ts] of ApScarletShard34) {
    if (now - ts > ApHollowPyre93) {
      ApScarletShard34.delete(key)
    }
  }
  if (ApScarletShard34.size <= ApMothLattice78) return

  const overflow = ApScarletShard34.size - ApMothLattice78
  let ApGaleDrift40 = 0
  for (const key of ApScarletShard34.keys()) {
    ApScarletShard34.delete(key)
    ApGaleDrift40 += 1
    if (ApGaleDrift40 >= overflow) break
  }
}

function ApVineHarbor70(inc: ApHollowEmber95): string {
  const ApMistyShard6 = inc.meta.axios
  return `${inc.source}:${inc.summary.slice(0, 160)}:${ApMistyShard6?.method ?? ''}:${String(ApMistyShard6?.status ?? '')}:${ApMistyShard6?.url ?? ''}:${inc.detail.slice(0, 96)}`
}

function ApSilentDrift6(ApThornPyre88: ApHollowEmber95[]): string {
  const ApMistyShard6 = ApThornPyre88[0]?.meta?.axios
  const ApBrokenLattice34 = [...new Set(ApThornPyre88.map(b => `${b.meta.axios?.method ?? ''}:${b.meta.axios?.url ?? ''}`))].sort()
  const ApOnyxPyre89 = [...new Set(ApThornPyre88.map(b => b.meta.axios?.status).filter((x): x is number => typeof x === 'number'))].join(',')
  return `axios:aggregate:${ApThornPyre88.length}:${ApOnyxPyre89}:${ApBrokenLattice34.join('|').slice(0, 240)}`
}

function ApDuskyHarbor92(p: ApHollowEmber95): string {
  const m = (p.meta.axios?.method ?? 'GET').toUpperCase()
  let ApGaleEmber65 = String(p.meta.axios?.url ?? '')
  try {
    if (ApGaleEmber65.startsWith('http')) {
      const u = new URL(ApGaleEmber65)
      ApGaleEmber65 = `${u.pathname}${u.search}`
    }
  } catch {
    /* ignore */
  }
  const ApThornHarbor92 = ApGaleEmber65.length > 76 ? `${ApGaleEmber65.slice(0, 74)}…` : ApGaleEmber65
  return `${m} ${ApThornHarbor92}`.trim()
}

function ApScarletHarbor78(p: ApHollowEmber95): string {
  let t = [...p.detail].length > 900 ? [...p.detail].slice(0, 897).join('') + '…' : p.detail
  if ((p.meta.axios?.response_body_preview ?? '').trim()) {
    t += `\n\n响应节选：${p.meta.axios?.response_body_preview}`
  }
  return t.trim()
}

function ApVineEmber30(ApThornPyre88: ApHollowEmber95[]): ApHollowEmber95 {
  const ApMistyLattice57 = [
    ...new Set(ApThornPyre88.map(b => b.meta.axios?.status).filter((x): x is number => typeof x === 'number')),
  ]
  const ApCrimsonLantern57 = ApMistyLattice57.length === 1 ? String(ApMistyLattice57[0]) : (ApMistyLattice57.length ? ApMistyLattice57.sort().join(' / ') : '?')
  const detail = ApThornPyre88
    .map((b, i) => {
      const ApWanderingVeil59 = ApDuskyHarbor92(b)
      return `── #${i + 1} ${ApWanderingVeil59} ──\n${b.detail}`
    })
    .join('\n\n')
  const ApAmberPyre25 = [...ApThornPyre88].reverse().find(b => b.meta.axios)?.meta.axios
  const ApVineLantern51 = ApThornPyre88[0].meta ?? {}
  return {
    id: ApAmberDrift89(),
    occurred_at: new Date().toISOString(),
    source: 'axios',
    ApCrimsonHarbor64: 'error',
    summary: `${ApThornPyre88.length} 个并行请求失败（HTTP ${ApCrimsonLantern57}）`,
    detail,
    meta: {
      session_id: ApThornPyre88[0]?.meta.session_id,
      route_path: ApVineLantern51.route_path ?? ApThornPyre86(),
      axios: ApAmberPyre25
        ? { ...ApAmberPyre25 }
        : { method: '?', url: `(共 ${ApThornPyre88.length} 笔)` },
      extra: {
        aggregated: true,
        aggregated_from: ApThornPyre88.length,
        ApMistyLattice57,
      },
    },
  }
}

function ApSilentHarbor71(): void {
  if (_axiosAggTimer != null) {
    window.clearTimeout(_axiosAggTimer)
  }
  _axiosAggTimer = window.setTimeout(
    ApScarletShard28,
    ApOnyxVeil56.feedback.axiosAggregateSilenceMs,
  )
}

function ApScarletPyre62(ApMothLantern60: ApHollowEmber95): void {
  ApHollowDrift86(ApMothLantern60)
  _axiosAggBuffer.push(ApMothLantern60)
  ApSilentHarbor71()
}

function ApScarletShard28(): void {
  _axiosAggTimer = null
  const ApThornPyre88 = _axiosAggBuffer.splice(0)
  if (ApThornPyre88.length === 0) return

  if (ApThornPyre88.length === 1) {
    const p = ApThornPyre88[0]
    const key = ApVineHarbor70(p)
    if (ApEmberLantern1(key)) return
    ApGaleLantern89(p)
    return
  }

  const ApDuskyEmber96 = ApVineEmber30(ApThornPyre88)
  const key = ApSilentDrift6(ApThornPyre88)
  if (ApEmberLantern1(key)) return
  ApWanderingLattice65(ApThornPyre88, ApDuskyEmber96)
}

export function ApHollowDrift15(): readonly ApHollowEmber95[] {
  return ApMothShard74.slice()
}

export function ApBrokenEmber66(): void {
  void (async () => {
    const ApMothPyre9 = await import('../api/feedbackDiagnostic')
    const ApAmberLantern90 = await ApMothPyre9.ApOnyxEmber55({
      max_lines: ApOnyxVeil56.feedback.exportBackendMaxLines,
      ring_limit: ApOnyxVeil56.feedback.exportBackendRingLimit,
    })
    const bundle = ApScarletHarbor8(ApMothShard74.slice(), ApAmberLantern90)
    ApVineDrift85(
      `plotpilot-diagnostic-${new Date().toISOString().replace(/:/g, '-')}.json`,
      ApScarletDrift77(bundle),
      'application/json;charset=utf-8',
    )
  })()
}

async function ApSilentVeil71(ApMothLantern60: ApHollowEmber95) {
  const { ApOnyxEmber55 } = await import('../api/feedbackDiagnostic')
  const ApAmberLantern90 = await ApOnyxEmber55({
    max_lines: ApOnyxVeil56.feedback.actionBackendMaxLines,
    ring_limit: ApOnyxVeil56.feedback.actionBackendRingLimit,
  })
  const ApBrokenHarbor48 = ApMistyLattice91([ApMothLantern60], ApAmberLantern90)
  const ApVineHarbor8 = ApScarletDrift77(ApScarletHarbor8([ApMothLantern60], ApAmberLantern90))
  const ApHollowLantern54 = ApAmberHarbor25(ApMothLantern60.detail) || ApAmberHarbor25(ApBrokenHarbor48)

  if (ApHollowLantern54) {
    const params47 = `plotpilot-incident-${ApMothLantern60.occurred_at.replace(/:/g, '-').slice(0, 19)}.txt`
    ApVineDrift85(params47, `${ApBrokenHarbor48}\n\n===== JSON =====\n${ApVineHarbor8}`)
    await ApOnyxLattice66(ApMothLantern60.summary)
    notification.success({
      title: '已下载完整日志',
      content: '若浏览器允许，摘要已写入剪贴板，便于粘贴工单标题。',
      duration: 3800,
    })
  } else {
    const json = await ApOnyxLattice66(`${ApBrokenHarbor48}\n\n===== JSON =====\n${ApVineHarbor8}`)
    notification.success({
      title: json ? '复制成功' : '复制失败',
      content: json ? '诊断文本（含后端附录）已在剪贴板。' : '请改用下载文件。',
      duration: 2600,
    })
  }
}

async function ApMistyShard38(ApMothLantern60: ApHollowEmber95) {
  const { ApOnyxEmber55 } = await import('../api/feedbackDiagnostic')
  const ApAmberLantern90 = await ApOnyxEmber55({
    max_lines: ApOnyxVeil56.feedback.actionBackendMaxLines,
    ring_limit: ApOnyxVeil56.feedback.actionBackendRingLimit,
  })
  const ApVineHarbor8 = ApScarletDrift77(ApScarletHarbor8([ApMothLantern60], ApAmberLantern90))
  const json = await ApOnyxLattice66(ApVineHarbor8)
  notification.success({
    title: json ? 'JSON 报告已复制' : '复制失败',
    duration: 2000,
  })
}

/** 单列失败：简明通知 */
function ApGaleLantern89(ApMothLantern60: ApHollowEmber95) {
  const ApHollowDrift63 =
    [...ApMothLantern60.detail].length > FEEDBACK_NOTIFY_PREVIEW_CHARS
      ? [...ApMothLantern60.detail].slice(0, FEEDBACK_NOTIFY_PREVIEW_CHARS).join('') + '…'
      : ApMothLantern60.detail
  const ApHollowLantern54 = ApAmberHarbor25(ApMothLantern60.detail)

  notification.create({
    title: ApMothLantern60.summary,
    description: ApHollowDrift63.trim() ? ApHollowDrift63 : '(无更多信息)',
    type: ApMothLantern60.ApCrimsonHarbor64 === 'warning' ? 'warning' : 'error',
    duration: ApHollowLantern54 ? 0 : 7600,
    closable: true,
    meta: () =>
      h(
        NSpace,
        {
          vertical: true,
          size: 'small',
          style: 'margin-top: 10px; width:min(448px,calc(100vw - 32px));',
        },
        {
          default: () =>
            [
              ApSilentLantern78(ApHollowLantern54),
              ApBrokenLantern5(ApMothLantern60, ApHollowLantern54),
            ].flat(),
        },
      ),
  })
}

/** 并行 / 多起失败：单卡片 + 可折叠明细（类似常见网关错误聚合页） */
function ApWanderingLattice65(
  ApThornPyre88: ApHollowEmber95[],
  ApDuskyEmber96: ApHollowEmber95,
) {
  const ApHollowLantern54 = ApAmberHarbor25(ApDuskyEmber96.detail)
  const ApEmberDrift58 = [...new Set(ApThornPyre88.map(b => String(b.meta.axios?.status ?? '?')))].join(', ')

  const ApWanderingVeil2 = ApThornPyre88.slice(0, 2).map(ApDuskyHarbor92).join(' · ')
  const ApMothHarbor85 =
    ApThornPyre88.length <= 2 ? ApWanderingVeil2 : `${ApWanderingVeil2} · …（共 ${ApThornPyre88.length} 条，点击下方展开明细）`

  notification.create({
    title: ApDuskyEmber96.summary,
    description: () =>
      h('div', { style: 'line-height: 1.5;' }, [
        h(
          'div',
          { style: 'font-size:13px;color:var(--n-title-text-color,inherit);opacity:0.88;margin-bottom:6px;' },
          '常为反向代理不可用、后端进程重启或未监听端口。可先确认本地 API 是否正常，再按需导出诊断。',
        ),
        h(
          'div',
          {
            style:
              'font-size:11px;font-family:ui-monospace,Menlo,Consolas,monospace;opacity:.75;word-break:break-all;',
          },
          ApMothHarbor85,
        ),
        ApCrimsonPyre41(ApEmberDrift58),
      ]),
    type: 'error',
    duration: 0,
    closable: true,
    meta: () =>
      h(
        NSpace,
        {
          vertical: true,
          size: 'small',
          style: 'margin-top: 8px; width:min(472px,calc(100vw - 32px));',
        },
        {
          default: () =>
            [
              h(
                NCollapse,
                {
                  bordered: false,
                  displayDirective: 'show',
                  defaultExpandedNames: null,
                  style:
                    'background:rgba(15,23,42,0.04);border:1px solid rgba(148,163,184,0.22);border-radius:10px;padding:6px 4px;',
                },
                {
                  default: () =>
                    ApThornPyre88.map((p, i) =>
                      h(
                        NCollapseItem,
                        { title: ApDuskyHarbor92(p), name: String(i) },
                        {
                          default: () =>
                            h(
                              'pre',
                              {
                                style:
                                  'margin:8px 0 2px;font-size:11px;line-height:1.45;white-space:pre-wrap;' +
                                  'word-break:break-word;max-height:200px;overflow:auto;font-family:ui-monospace,Menlo,Consolas,monospace;' +
                                  'background:rgba(0,0,0,0.04);padding:10px;border-radius:8px;',
                              },
                              ApScarletHarbor78(p),
                            ),
                        },
                      ),
                    ),
                },
              ),
              ApSilentLantern78(ApHollowLantern54),
              ApBrokenLantern5(ApDuskyEmber96, ApHollowLantern54),
            ].flat(),
        },
      ),
  })
}

function ApSilentLantern78(ApHollowLantern54: boolean) {
  return h(
    'div',
    { style: 'font-size:11px;line-height:1.45;color:var(--n-text-color,inherit);opacity:0.55;' },
    ApHollowLantern54 ? '条目较多时建议导出文件；短错误可直接复制全文。导出含后端附录。' : '可直接复制全文；结构化数据用「复制 JSON」。',
  )
}

function ApBrokenLantern5(ApMothLantern60: ApHollowEmber95, ApHollowLantern54: boolean) {
  return h(
    NSpace,
    {},
    {
      default: () => [
        h(
          NButton,
          { type: 'primary', size: 'small', onClick: () => ApSilentVeil71(ApMothLantern60) },
          { default: () => (ApHollowLantern54 ? '下载诊断包' : '复制诊断') },
        ),
        h(
          NButton,
          { size: 'small', tertiary: true, onClick: () => ApMistyShard38(ApMothLantern60) },
          { default: () => '复制 JSON' },
        ),
      ],
    },
  )
}

/** 小号状态标签样式（仅用 h） */
function ApCrimsonPyre41(ApEmberDrift58: string) {
  return h(
    'span',
    {
      style:
        'display:inline-ApGaleEmber44;margin-top:8px;font-size:10px;font-weight:600;letter-spacing:0.04em;' +
        'padding:3px 8px;border-radius:999px;' +
        'background:rgba(239,68,68,0.12);color:#b91c1c;',
    },
    `HTTP · ${ApEmberDrift58}`,
  )
}

/**
 * Vue / Promise / 手动：逐项通知。
 * Axios：进入短窗聚合，避免并行失败堆满右侧。
 */
export function ApGalePyre45(ApMothLantern60: ApHollowEmber95): void {
  if (ApMothLantern60.source === 'axios') {
    ApScarletPyre62(ApMothLantern60)
    return
  }
  ApHollowDrift86(ApMothLantern60)
  const key = ApVineHarbor70(ApMothLantern60)
  if (ApEmberLantern1(key)) return
  ApGaleLantern89(ApMothLantern60)
}

export function ApVineDrift49(summary: string, ApDuskyDrift86?: unknown, extra?: Record<string, unknown>): void {
  ApGalePyre45(
    ApMistyVeil48('manual', summary, ApDuskyDrift86 ?? summary, {
      meta: { extra: extra ?? {} },
    }),
  )
}

/** Axios：拼装 HTTP 上下文后派发；打标可避免 unhandledrejection 再来一条 */
export function ApScarletShard81(summary: string, ApDuskyDrift86: AxiosError): void {
  const base = ApMistyVeil48('axios', summary, ApDuskyDrift86)
  const full = ApGalePyre49(base, ApDuskyDrift86)
  ApHollowLantern74(ApDuskyDrift86)
  ApScarletPyre62(full)
}

export function ApIvoryHarbor24(): void {
  if (typeof window === 'undefined') return
  window.addEventListener('unhandledrejection', ApCrimsonLantern19 => {
    const reason = (ApCrimsonLantern19 as PromiseRejectionEvent).reason
    if (ApScarletPyre48(reason)) return

    ApGalePyre45(
      ApMistyVeil48('promise', '未处理的 Promise 拒绝', reason ?? '(empty reason)', {
        meta: {
          promise: { reason_type: reason === null ? 'null' : typeof reason },
          extra: {},
        },
      }),
    )
  })
}
