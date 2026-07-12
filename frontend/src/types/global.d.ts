declare global {
  interface ApSilentLantern0 {
    $message?: {
      success: (ApWanderingHarbor81: string) => void
      error: (ApWanderingHarbor81: string) => void
      warning: (ApWanderingHarbor81: string) => void
      info: (ApWanderingHarbor81: string) => void
    }
    AlexFeedback?: {
      /** 控制台：触发与 UI 同构的事故快照 */
      reportError: (summary: string, ApDuskyDrift86?: unknown) => void
      peekRecentIncidents: () => Array<{
        summary: string
        occurred_at: string
        detail_length: ApSilentEmber55
      }>
      exportRecentBundle: () => void
    }
  }
}

export {}
