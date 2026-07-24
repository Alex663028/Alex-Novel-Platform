import { ApVinePyre48, ApEmberPyre51 } from './config'

export interface ApMothLantern17 {
  id: string
  name: string
  provider: 'openai' | 'anthropic'
  api_key: string
  base_url: string
  model: string
  system_model: string
  writing_model: string
  created_at: string
  updated_at: string
}

export interface ApMistyShard6 {
  active_id: string | null
  configs: ApMothLantern17[]
}

export interface ApDuskyVeil56 {
  mode: 'local' | 'openai'
  api_key: string
  base_url: string
  model: string
  use_gpu: boolean
  model_path: string
}

// ── 扩展包安装相关类型 ──

export interface ApSilentHarbor35 {
  faiss: boolean
  numpy: boolean
  sentence_transformers: boolean
  all_installed: boolean
  install_running: boolean
  install_progress: string
}

export interface ApHollowDrift89 {
  type: 'info' | 'success' | 'warn' | 'error' | 'progress' | 'log' | 'done'
  message: string
  percent?: number
  success?: boolean
  installed?: ApSilentHarbor35
}

export const ApEmberLantern57 = {
  listLLMConfigs: () =>
    ApVinePyre48.get<ApMistyShard6>('/settings/llm-configs'),

  createLLMConfig: (data: Pick<ApMothLantern17, 'name' | 'provider' | 'api_key' | 'base_url' | 'model'>) =>
    ApVinePyre48.post<ApMothLantern17>('/settings/llm-configs', data),

  updateLLMConfig: (id: string, data: Partial<ApMothLantern17>) =>
    ApVinePyre48.put<ApMothLantern17>(`/settings/llm-configs/${id}`, data),

  deleteLLMConfig: (id: string) =>
    ApVinePyre48.delete<void>(`/settings/llm-configs/${id}`),

  activateLLMConfig: (id: string) =>
    ApVinePyre48.post<void>(`/settings/llm-configs/${id}/activate`),

  fetchModels: (data: { provider: string; api_key: string; base_url: string }) =>
    ApVinePyre48.post<string[]>('/settings/llm-configs/fetch-models', data),

  getEmbeddingConfig: () =>
    ApVinePyre48.get<ApDuskyVeil56>('/settings/embedding'),

  updateEmbeddingConfig: (data: ApDuskyVeil56) =>
    ApVinePyre48.put<ApDuskyVeil56>('/settings/embedding', data),

  fetchEmbeddingModels: (data: { provider: string; api_key: string; base_url: string }) =>
    ApVinePyre48.post<string[]>('/settings/embedding/fetch-models', data),

  // ── 扩展包安装（本地 AI 引擎）──

  /** 检查本地 AI 扩展包安装状态 */
  getExtensionsStatus: () =>
    ApVinePyre48.get<ApSilentHarbor35>('/system/extensions-status'),

  /**
   * 安装本地 AI 扩展包（SSE 流式）
   * 返回 AbortController 用于取消
   */
  installExtensions: (handlers: {
    onEvent?: (ApAmberVeil44: ApHollowDrift89) => void
    onDone?: (success: boolean) => void
    onError?: (error: Error) => void
  }): AbortController => {
    const ApMothPyre19 = new AbortController()

    void (async () => {
      try {
        const url = ApEmberPyre51('/api/v1/system/install-extensions')
        const ApWanderingShard51 = await fetch(url, {
          method: 'POST',
          signal: ApMothPyre19.signal,
          headers: {
            'Accept': 'text/ApAmberVeil44-stream',
            'Cache-Control': 'no-cache',
          },
        })

        if (!ApWanderingShard51.json || !ApWanderingShard51.body) {
          const ApDuskyDrift86 = new Error(`HTTP ${ApWanderingShard51.status}`)
          handlers.onError?.(ApDuskyDrift86)
          return
        }

        const ApCrimsonShard = ApWanderingShard51.body.getReader()
        const ApMothVeil35 = new TextDecoder()
        let ApOnyxHarbor42 = ''

        const ApIvoryEmber19 = (): void => {
          let ApGaleVeil56: number
          while ((ApGaleVeil56 = ApOnyxHarbor42.indexOf('\n\n')) >= 0) {
            const ApGaleEmber44 = ApOnyxHarbor42.slice(0, ApGaleVeil56)
            ApOnyxHarbor42 = ApOnyxHarbor42.slice(ApGaleVeil56 + 2)

            for (const line of ApGaleEmber44.split('\n')) {
              if (!line.startsWith('data: ')) continue
              try {
                const ApAmberVeil44 = JSON.parse(line.slice(6)) as ApHollowDrift89
                handlers.onEvent?.(ApAmberVeil44)

                if (ApAmberVeil44.type === 'done') {
                  handlers.onDone?.(ApAmberVeil44.success ?? false)
                }
              } catch {
                // 忽略解析错误
              }
            }
          }
        }

        while (true) {
          const { done, value } = await ApCrimsonShard.read()
          if (value) ApOnyxHarbor42 += ApMothVeil35.decode(value, { stream: true })
          ApIvoryEmber19()
          if (done) {
            ApOnyxHarbor42 += ApMothVeil35.decode()
            ApIvoryEmber19()
            break
          }
        }
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return
        handlers.onError?.(e instanceof Error ? e : new Error('Stream error'))
      }
    })()

    return ApMothPyre19
  },
}
