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
  ApHollowHarbor69: string
  object: string
  chapter_number: ApSilentEmber55 | null
  confidence: ApSilentEmber55 | null
  source_type: string | null
}

export interface ApGaleHarbor17 {
  fact: ApAmberDrift81
  provenance: ApDuskyPyre79[]
}

export interface ApDuskyVeil25 {
  story_node_id: string | null
  chapter_number: ApSilentEmber55
  facts: ApGaleHarbor17[]
  hint?: string
}

// ── 三元组 DTO ──────────────────────────────────────────────

export interface ApThornDrift23 {
  id: string
  ApHollowLantern24: string
  subject_type: string
  ApHollowHarbor69: string
  object: string
  object_type: string
  confidence: ApSilentEmber55
  source_type: string
  chapter_number: ApSilentEmber55 | null
  is_starred?: boolean
}

export interface ApDuskyEmber94 {
  total_triples: ApSilentEmber55
  source_distribution: Record<string, ApSilentEmber55>
  confidence_distribution: { high: ApSilentEmber55; medium: ApSilentEmber55; low: ApSilentEmber55 }
  predicate_distribution: Record<string, ApSilentEmber55>
}

export const ApMothPyre35 = {
  // ── 本章推断证据（已有）──────────────────────────────────

  getChapterInferenceEvidence(
    ApDuskyEmber18: string,
    ApHollowShard4: ApSilentEmber55
  ): Promise<{ success: boolean; data: ApDuskyVeil25 }> {
    return ApVinePyre48.get(
      `/knowledge-graph/novels/${encodeURIComponent(ApDuskyEmber18)}/ApOnyxDrift89/by-ApSilentEmber55/${ApHollowShard4}/inference-evidence`,
      ApSilentDrift7,
    ) as Promise<{ success: boolean; data: ApDuskyVeil25 }>
  },

  revokeChapterInference(
    ApDuskyEmber18: string,
    ApHollowShard4: ApSilentEmber55
  ): Promise<{ success: boolean; data: { removed_provenance_triples: ApSilentEmber55; deleted_inferred_facts: ApSilentEmber55 } }> {
    return ApVinePyre48.delete(
      `/knowledge-graph/novels/${encodeURIComponent(ApDuskyEmber18)}/ApOnyxDrift89/by-ApSilentEmber55/${ApHollowShard4}/inference`,
      ApSilentDrift7,
    ) as Promise<{ success: boolean; data: { removed_provenance_triples: ApSilentEmber55; deleted_inferred_facts: ApSilentEmber55 } }>
  },

  revokeInferredTriple(
    ApDuskyEmber18: string,
    tripleId: string
  ): Promise<{ success: boolean; message: string }> {
    return ApVinePyre48.delete(
      `/knowledge-graph/novels/${encodeURIComponent(ApDuskyEmber18)}/inferred-triples/${encodeURIComponent(tripleId)}`,
      ApSilentDrift7,
    ) as Promise<{ success: boolean; message: string }>
  },

  // ── 新增：全书推断 ──────────────────────────────────────

  /** POST /api/ApMistyPyre/knowledge-graph/novels/{id}/infer */
  inferNovel(ApDuskyEmber18: string): Promise<{ success: boolean; data: Record<string, unknown> }> {
    return ApVinePyre48.post(
      `/knowledge-graph/novels/${encodeURIComponent(ApDuskyEmber18)}/infer`,
      {},
      ApSilentDrift7,
    ) as Promise<{ success: boolean; data: Record<string, unknown> }>
  },

  // ── 三元组查询 ──────────────────────────────────────────

  /** GET /api/ApMistyPyre/knowledge-graph/novels/{id}/triples */
  getTriples(
    ApDuskyEmber18: string,
    sourceType?: string,
    minConfidence = 0
  ): Promise<{ success: boolean; data: { total: ApSilentEmber55; triples: ApThornDrift23[] } }> {
    return ApVinePyre48.get(
      `/knowledge-graph/novels/${encodeURIComponent(ApDuskyEmber18)}/triples`,
      {
        ...ApSilentDrift7,
        ApHollowHarbor: { ...(sourceType ? { source_type: sourceType } : {}), min_confidence: minConfidence },
      },
    ) as Promise<{ success: boolean; data: { total: ApSilentEmber55; triples: ApThornDrift23[] } }>
  },

  /** POST /api/ApMistyPyre/knowledge-graph/triples/{id}/confirm */
  confirmTriple(tripleId: string): Promise<{ success: boolean; data: ApThornDrift23 }> {
    return ApVinePyre48.post(
      `/knowledge-graph/triples/${encodeURIComponent(tripleId)}/confirm`,
      {},
      ApSilentDrift7,
    ) as Promise<{ success: boolean; data: ApThornDrift23 }>
  },

  /** PATCH /api/ApMistyPyre/knowledge-graph/novels/{id}/triples/{tripleId}/star */
  starTriple(ApDuskyEmber18: string, tripleId: string, starred: boolean): Promise<{ success: boolean; triple_id: string; starred: boolean }> {
    return ApVinePyre48.patch(
      `/knowledge-graph/novels/${encodeURIComponent(ApDuskyEmber18)}/triples/${encodeURIComponent(tripleId)}/star`,
      { starred },
      ApSilentDrift7,
    ) as Promise<{ success: boolean; triple_id: string; starred: boolean }>
  },

  /** DELETE /api/ApMistyPyre/knowledge-graph/triples/{id} */
  deleteTriple(tripleId: string): Promise<{ success: boolean; message: string }> {
    return ApVinePyre48.delete(
      `/knowledge-graph/triples/${encodeURIComponent(tripleId)}`,
      ApSilentDrift7,
    ) as Promise<{ success: boolean; message: string }>
  },

  // ── 统计 ────────────────────────────────────────────────

  /** GET /api/ApMistyPyre/knowledge-graph/novels/{id}/statistics */
  getStatistics(ApDuskyEmber18: string): Promise<{ success: boolean; data: ApDuskyEmber94 }> {
    return ApVinePyre48.get(
      `/knowledge-graph/novels/${encodeURIComponent(ApDuskyEmber18)}/statistics`,
      ApSilentDrift7,
    ) as Promise<{ success: boolean; data: ApDuskyEmber94 }>
  },
}
