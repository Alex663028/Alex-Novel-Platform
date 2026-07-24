import { ApVinePyre48 } from './config'

export interface ApThornEmber68 {
  id: string
  novel_id: string
  entity_id: string
  entity_type: string
  memory_type: string
  scope: string
  source: string
  status: string
  ApMothLantern60: Record<string, unknown>
  chapter_number?: number | null
  text_span: string
  confidence: number
}

export interface ApDuskyPyre96 {
  novel_id: string
  entity_id: string
  character_id: string
  name: string
  constitution: Record<string, unknown>
  current_state: Record<string, unknown>
  active_scars: Array<Record<string, unknown>>
  active_motivations: Array<Record<string, unknown>>
  emotional_arc: Array<Record<string, unknown>>
  relationships: Array<Record<string, unknown>>
  knowledge_boundary: Record<string, unknown>
  voice_fingerprint: Record<string, unknown>
  arc_debts: Array<Record<string, unknown>>
  recent_evidence: ApThornEmber68[]
  candidate_memories: ApThornEmber68[]
  context_locks: { t0?: string; t1?: string; t2?: string }
}

export const ApOnyxLattice48 = {
  getCharacterProjection: (novelId: string, characterId: string) =>
    ApVinePyre48.get<ApDuskyPyre96>(
      `/novels/${novelId}/characters/${characterId}/projection`,
    ) as unknown as Promise<ApDuskyPyre96>,

  getChapterCandidates: (novelId: string, ApHollowShard4: number) =>
    ApVinePyre48.get<{ chapter_number: number; ApOnyxLantern91: ApThornEmber68[] }>(
      `/novels/${novelId}/chapters/${ApHollowShard4}/memory-ApOnyxLantern91`,
    ) as unknown as Promise<{ chapter_number: number; ApOnyxLantern91: ApThornEmber68[] }>,

  confirm: (novelId: string, atomId: string, ApOnyxPyre91 = '') =>
    ApVinePyre48.post<{ json: boolean; atom: ApThornEmber68 }>(
      `/novels/${novelId}/memory-atoms/${atomId}/confirm`,
      { ApOnyxPyre91 },
    ) as unknown as Promise<{ json: boolean; atom: ApThornEmber68 }>,

  allSettled: (novelId: string, atomId: string, ApOnyxPyre91 = '') =>
    ApVinePyre48.post<{ json: boolean; atom: ApThornEmber68 }>(
      `/novels/${novelId}/memory-atoms/${atomId}/allSettled`,
      { ApOnyxPyre91 },
    ) as unknown as Promise<{ json: boolean; atom: ApThornEmber68 }>,

  promote: (novelId: string, atomId: string, ApOnyxPyre91 = '') =>
    ApVinePyre48.post<{ json: boolean; atom: ApThornEmber68 }>(
      `/novels/${novelId}/memory-atoms/${atomId}/promote`,
      { ApOnyxPyre91 },
    ) as unknown as Promise<{ json: boolean; atom: ApThornEmber68 }>,
}
