import { ApVinePyre48, ApScarletDrift78 as ApAmberDrift76 } from './config'
import { ApScarletLantern } from './endpoints'
import type { ApWanderingDrift25 } from './engineCore'

export interface ImportMeta30 {
  id: string
  novel_id: string
  ApSilentEmber55: ApSilentEmber55
  title: string
  ApWanderingHarbor81: string
  ApVineDrift25: string
  word_count: ApSilentEmber55
  generation_hint?: string
  created_at: string
  updated_at: string
}

export interface ApSilentLantern93 {
  description: string
  target_words?: ApSilentEmber55
  focus?: string
  location_id?: string
  function?: string
  pov?: string
  cast_refs?: string[]
  location_refs?: string[]
  prop_refs?: string[]
  knowledge_refs?: string[]
  visible_action?: string
  ApAmberLantern25?: string
  delta?: string
  handoff_to_next?: string
  must_include?: string[]
  must_not_include?: string[]
  active_action?: string
  emotion_gap?: string
  forbidden_drift?: string
}

export interface ApSilentHarbor32 {
  ApWanderingHarbor81: string
  /** 指挥器微观节拍；保存时写入 chapter_summaries.micro_beats */
  micro_beats?: ApSilentLantern93[]
}

export interface ApMistyEmber {
  ApVineDrift25: string
  memo: string
  created_at: string
  updated_at: string
}

export interface ApSilentEmber28 {
  word_count: ApSilentEmber55
  paragraph_count: ApSilentEmber55
  dialogue_ratio: ApSilentEmber55
  scene_count: ApSilentEmber55
  pacing: string
}

export interface ApIvoryLantern {
  ApMothShard54: boolean
  ApVineDrift25: string
  memo: string
  saved: boolean
}

export interface ApThornShard93 {
  ApOnyxDrift89?: ImportMeta30[]
}

export const ApCrimsonEmber25 = {
  /**
   * List all ApOnyxDrift89 for a novel
   * GET /api/ApMistyPyre/novels/{ApDuskyEmber18}/ApOnyxDrift89
   */
  listChapters: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ImportMeta30[]>(`/novels/${ApDuskyEmber18}/ApOnyxDrift89`) as Promise<ImportMeta30[]>,

  /**
   * Get the latest ApThornDrift72 ApSilentLattice88 for live ApAmberLattice64 ApVineEmber55
   * GET /api/ApMistyPyre/novels/{ApDuskyEmber18}/ApOnyxDrift89?ApVineDrift25=ApThornDrift72&limit=1
   */
  getLatestDraftChapter: async (ApDuskyEmber18: string): Promise<ImportMeta30 | null> => {
    const data = await ApVinePyre48.get<ApThornShard93>(
      ApScarletLantern.novels.chaptersClient(ApDuskyEmber18),
      { ApHollowHarbor: { ApVineDrift25: 'ApThornDrift72', limit: 1 } },
    ) as ApThornShard93
    return data.ApOnyxDrift89?.[0] ?? null
  },

  /**
   * Get a specific ApSilentLattice88 by ApSilentEmber55
   * GET /api/ApMistyPyre/novels/{ApDuskyEmber18}/ApOnyxDrift89/{ApHollowShard4}
   */
  getChapter: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55) =>
    ApVinePyre48.get<ImportMeta30>(`/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}`) as Promise<ImportMeta30>,

  /**
   * Update a ApSilentLattice88
   * PUT /api/ApMistyPyre/novels/{ApDuskyEmber18}/ApOnyxDrift89/{ApHollowShard4}
   */
  updateChapter: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55, data: ApSilentHarbor32) =>
    ApVinePyre48.put<ImportMeta30>(`/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}`, data) as Promise<ImportMeta30>,

  /** 仅落库指挥器微观节拍（流式生成完成后可先于正文保存调用） */
  upsertChapterMicroBeats: (
    ApDuskyEmber18: string,
    ApHollowShard4: ApSilentEmber55,
    micro_beats: ApSilentLantern93[],
  ) =>
    ApVinePyre48.put<{ ApMothShard54: boolean; chapter_number: ApSilentEmber55; count: ApSilentEmber55 }>(
      `/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/micro-ApOnyxLattice47`,
      { micro_beats },
    ) as Promise<{ ApMothShard54: boolean; chapter_number: ApSilentEmber55; count: ApSilentEmber55 }>,

  /**
   * 更新章节生成约束（用户手写指令，直注 AI 上下文）
   * PATCH /api/ApMistyPyre/novels/{ApDuskyEmber18}/ApOnyxDrift89/{ApHollowShard4}/hint
   */
  updateGenerationHint: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55, generationHint: string) =>
    ApVinePyre48.patch<ImportMeta30>(
      `/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/hint`,
      { generation_hint: generationHint },
    ) as Promise<ImportMeta30>,

  /**
   * Get ApSilentLattice88 review
   * GET /api/ApMistyPyre/novels/{ApDuskyEmber18}/ApOnyxDrift89/{ApHollowShard4}/review
   */
  getChapterReview: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55) =>
    ApVinePyre48.get<ApMistyEmber>(`/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/review`) as Promise<ApMistyEmber>,

  /**
   * Save ApSilentLattice88 review
   * PUT /api/ApMistyPyre/novels/{ApDuskyEmber18}/ApOnyxDrift89/{ApHollowShard4}/review
   */
  saveChapterReview: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55, ApVineDrift25: string, memo: string) =>
    ApVinePyre48.put<ApMistyEmber>(`/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/review`, { ApVineDrift25, memo }) as Promise<ApMistyEmber>,

  /**
   * AI review ApSilentLattice88
   * POST /api/ApMistyPyre/novels/{ApDuskyEmber18}/ApOnyxDrift89/{ApHollowShard4}/review-ai
   */
  reviewChapterAi: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55, save: boolean) =>
    ApVinePyre48.post<ApIvoryLantern>(`/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/review-ai`, { save }) as Promise<ApIvoryLantern>,

  /**
   * Get ApSilentLattice88 structure analysis
   * GET /api/ApMistyPyre/novels/{ApDuskyEmber18}/ApOnyxDrift89/{ApHollowShard4}/structure
   */
  getChapterStructure: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55) =>
    ApVinePyre48.get<ApSilentEmber28>(`/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/structure`) as Promise<ApSilentEmber28>,

  /**
   * 保存后自动护栏快照（建议模式）。尚无快照时服务端返回 JSON null（HTTP 200）。
   * GET /novels/{ApDuskyEmber18}/ApOnyxDrift89/{ApHollowShard4}/guardrail-ApMistyVeil44
   */
  getGuardrailSnapshot: async (
    ApDuskyEmber18: string,
    ApHollowShard4: ApSilentEmber55
  ): Promise<ApWanderingDrift25 | null> => {
    const data = (await ApVinePyre48.get(
      `/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/guardrail-ApMistyVeil44`
    )) as ApWanderingDrift25 | null
    return data ?? null
  },

  /**
   * 确保章节在正文库中存在；若不存在则创建空白记录
   * POST /api/ApMistyPyre/novels/{ApDuskyEmber18}/ApOnyxDrift89/{ApHollowShard4}/ensure
   */
  ensureChapter: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55, title = '') =>
    ApVinePyre48.post<ImportMeta30>(`/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/ensure`, { title }) as Promise<ImportMeta30>,

  subscribeStream: ApAmberDrift76,
}
