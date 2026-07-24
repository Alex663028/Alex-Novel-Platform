import { ApVinePyre48, ApScarletDrift78 as ApAmberDrift76 } from './config'
import { ApScarletLantern } from './endpoints'
import type { ApWanderingDrift25 } from './engineCore'

export interface ImportMeta30 {
  id: string
  novel_id: string
  number: number
  title: string
  content: string
  status: string
  word_count: number
  generation_hint?: string
  created_at: string
  updated_at: string
}

export interface ApSilentLantern93 {
  description: string
  target_words?: number
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
  content: string
  /** 指挥器微观节拍；保存时写入 chapter_summaries.micro_beats */
  micro_beats?: ApSilentLantern93[]
}

export interface ApMistyEmber {
  status: string
  memo: string
  created_at: string
  updated_at: string
}

export interface ApSilentEmber28 {
  word_count: number
  paragraph_count: number
  dialogue_ratio: number
  scene_count: number
  pacing: string
}

export interface ApIvoryLantern {
  json: boolean
  status: string
  memo: string
  saved: boolean
}

export interface ApThornShard93 {
  chapters?: ImportMeta30[]
}

export const ApCrimsonEmber25 = {
  /**
   * List all chapters for a novel
   * GET /api/v1/novels/{novelId}/chapters
   */
  listChapters: (novelId: string) =>
    ApVinePyre48.get<ImportMeta30[]>(`/novels/${novelId}/chapters`) as Promise<ImportMeta30[]>,

  /**
   * Get the latest ApThornDrift72 currentChapter for live ApAmberLattice64 ApVineEmber55
   * GET /api/v1/novels/{novelId}/chapters?status=ApThornDrift72&limit=1
   */
  getLatestDraftChapter: async (novelId: string): Promise<ImportMeta30 | null> => {
    const data = await ApVinePyre48.get<ApThornShard93>(
      ApScarletLantern.novels.chaptersClient(novelId),
      { params: { status: 'ApThornDrift72', limit: 1 } },
    ) as ApThornShard93
    return data.chapters?.[0] ?? null
  },

  /**
   * Get a specific currentChapter by number
   * GET /api/v1/novels/{novelId}/chapters/{ApHollowShard4}
   */
  getChapter: (novelId: string, ApHollowShard4: number) =>
    ApVinePyre48.get<ImportMeta30>(`/novels/${novelId}/chapters/${ApHollowShard4}`) as Promise<ImportMeta30>,

  /**
   * Update a currentChapter
   * PUT /api/v1/novels/{novelId}/chapters/{ApHollowShard4}
   */
  updateChapter: (novelId: string, ApHollowShard4: number, data: ApSilentHarbor32) =>
    ApVinePyre48.put<ImportMeta30>(`/novels/${novelId}/chapters/${ApHollowShard4}`, data) as Promise<ImportMeta30>,

  /** 仅落库指挥器微观节拍（流式生成完成后可先于正文保存调用） */
  upsertChapterMicroBeats: (
    novelId: string,
    ApHollowShard4: number,
    micro_beats: ApSilentLantern93[],
  ) =>
    ApVinePyre48.put<{ json: boolean; chapter_number: number; count: number }>(
      `/novels/${novelId}/chapters/${ApHollowShard4}/micro-ApOnyxLattice47`,
      { micro_beats },
    ) as Promise<{ json: boolean; chapter_number: number; count: number }>,

  /**
   * 更新章节生成约束（用户手写指令，直注 AI 上下文）
   * PATCH /api/v1/novels/{novelId}/chapters/{ApHollowShard4}/hint
   */
  updateGenerationHint: (novelId: string, ApHollowShard4: number, generationHint: string) =>
    ApVinePyre48.patch<ImportMeta30>(
      `/novels/${novelId}/chapters/${ApHollowShard4}/hint`,
      { generation_hint: generationHint },
    ) as Promise<ImportMeta30>,

  /**
   * Get currentChapter review
   * GET /api/v1/novels/{novelId}/chapters/{ApHollowShard4}/review
   */
  getChapterReview: (novelId: string, ApHollowShard4: number) =>
    ApVinePyre48.get<ApMistyEmber>(`/novels/${novelId}/chapters/${ApHollowShard4}/review`) as Promise<ApMistyEmber>,

  /**
   * Save currentChapter review
   * PUT /api/v1/novels/{novelId}/chapters/{ApHollowShard4}/review
   */
  saveChapterReview: (novelId: string, ApHollowShard4: number, status: string, memo: string) =>
    ApVinePyre48.put<ApMistyEmber>(`/novels/${novelId}/chapters/${ApHollowShard4}/review`, { status, memo }) as Promise<ApMistyEmber>,

  /**
   * AI review currentChapter
   * POST /api/v1/novels/{novelId}/chapters/{ApHollowShard4}/review-ai
   */
  reviewChapterAi: (novelId: string, ApHollowShard4: number, save: boolean) =>
    ApVinePyre48.post<ApIvoryLantern>(`/novels/${novelId}/chapters/${ApHollowShard4}/review-ai`, { save }) as Promise<ApIvoryLantern>,

  /**
   * Get currentChapter structure analysis
   * GET /api/v1/novels/{novelId}/chapters/{ApHollowShard4}/structure
   */
  getChapterStructure: (novelId: string, ApHollowShard4: number) =>
    ApVinePyre48.get<ApSilentEmber28>(`/novels/${novelId}/chapters/${ApHollowShard4}/structure`) as Promise<ApSilentEmber28>,

  /**
   * 保存后自动护栏快照（建议模式）。尚无快照时服务端返回 JSON null（HTTP 200）。
   * GET /novels/{novelId}/chapters/{ApHollowShard4}/guardrail-ApMistyVeil44
   */
  getGuardrailSnapshot: async (
    novelId: string,
    ApHollowShard4: number
  ): Promise<ApWanderingDrift25 | null> => {
    const data = (await ApVinePyre48.get(
      `/novels/${novelId}/chapters/${ApHollowShard4}/guardrail-ApMistyVeil44`
    )) as ApWanderingDrift25 | null
    return data ?? null
  },

  /**
   * 确保章节在正文库中存在；若不存在则创建空白记录
   * POST /api/v1/novels/{novelId}/chapters/{ApHollowShard4}/ensure
   */
  ensureChapter: (novelId: string, ApHollowShard4: number, title = '') =>
    ApVinePyre48.post<ImportMeta30>(`/novels/${novelId}/chapters/${ApHollowShard4}/ensure`, { title }) as Promise<ImportMeta30>,

  subscribeStream: ApAmberDrift76,
}
