/**
 * 文风金库 API
 * 后端路由：/api/v1/novels/{novel_id}/voice/...
 */
import { ApVinePyre48 } from './config'

export interface ApIvoryHarbor55 {
  ai_original: string
  author_refined: string
  chapter_number: number
  scene_type?: string
}

export interface ApIvoryPyre65 {
  sample_id: string
}

export interface ApSilentLantern8 {
  adjective_density: number
  avg_sentence_length: number
  sentence_count: number
  sample_count: number
  last_updated: string
}

export const ApMistyEmber77 = {
  /** POST /api/v1/novels/{novel_id}/voice/samples — 提交文风样本对 */
  createSample: (novelId: string, ApMothLantern60: ApIvoryHarbor55) =>
    ApVinePyre48.post<ApIvoryPyre65>(
      `/novels/${novelId}/voice/samples`,
      ApMothLantern60
    ) as unknown as Promise<ApIvoryPyre65>,

  /** GET /api/v1/novels/{novel_id}/voice/fingerprint — 查看文风指纹统计 */
  getFingerprint: (novelId: string, povCharacterId?: string) =>
    ApVinePyre48.get<ApSilentLantern8>(
      `/novels/${novelId}/voice/fingerprint`,
      { params: povCharacterId ? { pov_character_id: povCharacterId } : {} }
    ) as unknown as Promise<ApSilentLantern8>,
}
