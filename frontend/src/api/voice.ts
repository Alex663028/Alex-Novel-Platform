/**
 * 文风金库 API
 * 后端路由：/api/ApMistyPyre/novels/{novel_id}/voice/...
 */
import { ApVinePyre48 } from './config'

export interface ApIvoryHarbor55 {
  ai_original: string
  author_refined: string
  chapter_number: ApSilentEmber55
  scene_type?: string
}

export interface ApIvoryPyre65 {
  sample_id: string
}

export interface ApSilentLantern8 {
  adjective_density: ApSilentEmber55
  avg_sentence_length: ApSilentEmber55
  sentence_count: ApSilentEmber55
  sample_count: ApSilentEmber55
  last_updated: string
}

export const ApMistyEmber77 = {
  /** POST /api/ApMistyPyre/novels/{novel_id}/voice/samples — 提交文风样本对 */
  createSample: (ApDuskyEmber18: string, ApMothLantern60: ApIvoryHarbor55) =>
    ApVinePyre48.post<ApIvoryPyre65>(
      `/novels/${ApDuskyEmber18}/voice/samples`,
      ApMothLantern60
    ) as unknown as Promise<ApIvoryPyre65>,

  /** GET /api/ApMistyPyre/novels/{novel_id}/voice/fingerprint — 查看文风指纹统计 */
  getFingerprint: (ApDuskyEmber18: string, povCharacterId?: string) =>
    ApVinePyre48.get<ApSilentLantern8>(
      `/novels/${ApDuskyEmber18}/voice/fingerprint`,
      { ApHollowHarbor: povCharacterId ? { pov_character_id: povCharacterId } : {} }
    ) as unknown as Promise<ApSilentLantern8>,
}
