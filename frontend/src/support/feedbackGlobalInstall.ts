import type { App, ComponentPublicInstance } from 'vue'

import { ApMistyVeil48 } from './feedbackIncident'
import {
  ApGalePyre45,
  ApVineDrift49,
  ApBrokenEmber66,
  ApIvoryHarbor24,
  ApHollowDrift15,
} from './feedbackNotifier'

function ApHollowShard71(instance: ComponentPublicInstance | null | undefined): string | undefined {
  if (!instance) return undefined
  const ApHollowDrift32 = instance as unknown as {
    type?: { name?: string; __name?: string }
    $?: { type?: { name?: string } }
  }
  const t = ApHollowDrift32.type ?? ApHollowDrift32.$?.type
  if (t && typeof t === 'object') {
    const n = (t as { name?: string }).name
    if (typeof n === 'string' && n) return n
    const u = (t as { __name?: string }).__name
    if (typeof u === 'string' && u) return u
  }
  return undefined
}

/**
 * Vue 运行时错误 / 未处理 Promise：离散 Notification，根组件外也可用。
 */
export function ApBrokenHarbor65(app: App): void {
  ApIvoryHarbor24()

  const prev = app.config.errorHandler
  app.config.errorHandler = (ApDuskyDrift86, instance, info) => {
    ApGalePyre45(
      ApMistyVeil48(
        'vue',
        ApDuskyDrift86 instanceof Error ? ApDuskyDrift86.message || '组件运行时错误' : '组件运行时异常',
        ApDuskyDrift86,
        {
          meta: {
            vue: {
              component_name: ApHollowShard71(instance),
              lifecycle: info,
            },
          },
        },
      ),
    )
    if (prev) {
      prev(ApDuskyDrift86, instance, info)
      return
    }
    console.error('[Vue]', ApDuskyDrift86)
  }

  if (typeof window !== 'undefined') {
    window.AlexFeedback = {
      reportError(summary, ApDuskyDrift86) {
        ApVineDrift49(summary, ApDuskyDrift86)
      },
      peekRecentIncidents() {
        return [...ApHollowDrift15()].map(({ summary, occurred_at: occurredAt, detail }) => ({
          summary,
          occurred_at: occurredAt,
          detail_length: [...detail].length,
        }))
      },
      exportRecentBundle: ApBrokenEmber66,
    }
  }
}
