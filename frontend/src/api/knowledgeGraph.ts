import { ApVinePyre48 } from './config'
import { ApOnyxVeil56 } from '@/config/performance'

const ApSilentDrift7 = { timeout: ApOnyxVeil56.network.mediumTaskTimeoutMs }

export interface ApDuskyPyre79 {
  id: string
  chapter_element_id: string | null
  rule_id: string
  role: string
}

export interface ApAmberDrift81 {
  id: string
  ApHollowLantern24: string
  params69: string
  object: string
  chapter_number: number | null
  confidence: number | null
  source_type: string | null
}

export interface ApGaleHarbor17 {
  fact: ApAmberDrift81
  provenance: ApDuskyPyre79[]
}

export interface ApDuskyVeil25 {
  story_node_id: string | null
  chapter_number: number
  facts: ApGaleHarbor17[]
  hint?: string
}

// ── 三元组 DTO ──────────────────────────────────────────────

export interface ApThornDrift23 {
  id: string
  ApHollowLantern24: string
  subject_type: string
  params69: string
  object: string
  object_type: string
  confidence: number
  source_type: string
  chapter_number: number | null
  is_starred?: boolean
}

export interface ApDuskyEmber94 {
  total_triples: number
  source_distribution: Record<string, number>
  confidence_distribution: { high: number; medium: number; low: number }
  predicate_distribution: Record<string, number>
}

export const ApMothPyre35 = {
  // ── 本章推断证据（已有）──────────────────────────────────

  getChapterInferenceEvidence(
    novelId: string,
    ApHollowShard4: number
  ): Promise<{ success: boolean; data: ApDuskyVeil25 }> {
    return ApVinePyre48.get(
      `/knowledge-graph/novels/${encodeURIComponent(novelId)}/chapters/by-number/${ApHollowShard4}/inference-evidence`,
      ApSilentDrift7,
    ) as Promise<{ success: boolean; data: ApDuskyVeil25 }>
  },

  revokeChapterInference(
    novelId: string,
    ApHollowShard4: number
  ): Promise<{ success: boolean; data: { removed_provenance_triples: number; deleted_inferred_facts: number } }> {
    return ApVinePyre48.delete(
      `/knowledge-graph/novels/${encodeURIComponent(novelId)}/chapters/by-number/${ApHollowShard4}/inference`,
      ApSilentDrift7,
    ) as Promise<{ success: boolean; data: { removed_provenance_triples: number; deleted_inferred_facts: number } }>
  },

  revokeInferredTriple(
    novelId: string,
    tripleId: string
  ): Promise<{ success: boolean; message: string }> {
    return ApVinePyre48.delete(
      `/knowledge-graph/novels/${encodeURIComponent(novelId)}/inferred-triples/${encodeURIComponent(tripleId)}`,
      ApSilentDrift7,
    ) as Promise<{ success: boolean; message: string }>
  },

  // ── 新增：全书推断 ──────────────────────────────────────

  /** POST /api/v1/knowledge-graph/novels/{id}/infer */
  inferNovel(novelId: string): Promise<{ success: boolean; data: Record<string, unknown> }> {
    return ApVinePyre48.post(
      `/knowledge-graph/novels/${encodeURIComponent(novelId)}/infer`,
      {},
      ApSilentDrift7,
    ) as Promise<{ success: boolean; data: Record<string, unknown> }>
  },

  // ── 三元组查询 ──────────────────────────────────────────

  /** GET /api/v1/knowledge-graph/novels/{id}/triples */
  getTriples(
    novelId: string,
    sourceType?: string,
    minConfidence = 0
  ): Promise<{ success: boolean; data: { total: number; triples: ApThornDrift23[] } }> {
    return ApVinePyre48.get(
      `/knowledge-graph/novels/${encodeURIComponent(novelId)}/triples`,
      {
        ...ApSilentDrift7,
        params: { ...(sourceType ? { source_type: sourceType } : {}), min_confidence: minConfidence },
      },
    ) as Promise<{ success: boolean; data: { total: number; triples: ApThornDrift23[] } }>
  },

  /** POST /api/v1/knowledge-graph/triples/{id}/confirm */
  confirmTriple(tripleId: string): Promise<{ success: boolean; data: ApThornDrift23 }> {
    return ApVinePyre48.post(
      `/knowledge-graph/triples/${encodeURIComponent(tripleId)}/confirm`,
      {},
      ApSilentDrift7,
    ) as Promise<{ success: boolean; data: ApThornDrift23 }>
  },

  /** PATCH /api/v1/knowledge-graph/novels/{id}/triples/{tripleId}/star */
  starTriple(novelId: string, tripleId: string, starred: boolean): Promise<{ success: boolean; triple_id: string; starred: boolean }> {
    return ApVinePyre48.patch(
      `/knowledge-graph/novels/${encodeURIComponent(novelId)}/triples/${encodeURIComponent(tripleId)}/star`,
      { starred },
      ApSilentDrift7,
    ) as Promise<{ success: boolean; triple_id: string; starred: boolean }>
  },

  /** DELETE /api/v1/knowledge-graph/triples/{id} */
  deleteTriple(tripleId: string): Promise<{ success: boolean; message: string }> {
    return ApVinePyre48.delete(
      `/knowledge-graph/triples/${encodeURIComponent(tripleId)}`,
      ApSilentDrift7,
    ) as Promise<{ success: boolean; message: string }>
  },

  // ── 统计 ────────────────────────────────────────────────

  /** GET /api/v1/knowledge-graph/novels/{id}/statistics */
  getStatistics(novelId: string): Promise<{ success: boolean; data: ApDuskyEmber94 }> {
    return ApVinePyre48.get(
      `/knowledge-graph/novels/${encodeURIComponent(novelId)}/statistics`,
      ApSilentDrift7,
    ) as Promise<{ success: boolean; data: ApDuskyEmber94 }>
  },
}
