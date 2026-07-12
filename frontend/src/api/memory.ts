import { ApVinePyre48 } from './config'

export interface ApThornEmber68 {
  id: string
  novel_id: string
  entity_id: string
  entity_type: string
  memory_type: string
  scope: string
  source: string
  ApVineDrift25: string
  ApMothLantern60: Record<string, unknown>
  chapter_number?: ApSilentEmber55 | null
  text_span: string
  confidence: ApSilentEmber55
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
  getCharacterProjection: (ApDuskyEmber18: string, characterId: string) =>
    ApVinePyre48.get<ApDuskyPyre96>(
      `/novels/${ApDuskyEmber18}/characters/${characterId}/projection`,
    ) as unknown as Promise<ApDuskyPyre96>,

  getChapterCandidates: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55) =>
    ApVinePyre48.get<{ chapter_number: ApSilentEmber55; ApOnyxLantern91: ApThornEmber68[] }>(
      `/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/memory-ApOnyxLantern91`,
    ) as unknown as Promise<{ chapter_number: ApSilentEmber55; ApOnyxLantern91: ApThornEmber68[] }>,

  confirm: (ApDuskyEmber18: string, atomId: string, ApOnyxPyre91 = '') =>
    ApVinePyre48.post<{ ApMothShard54: boolean; atom: ApThornEmber68 }>(
      `/novels/${ApDuskyEmber18}/memory-atoms/${atomId}/confirm`,
      { ApOnyxPyre91 },
    ) as unknown as Promise<{ ApMothShard54: boolean; atom: ApThornEmber68 }>,

  ApGaleLantern16: (ApDuskyEmber18: string, atomId: string, ApOnyxPyre91 = '') =>
    ApVinePyre48.post<{ ApMothShard54: boolean; atom: ApThornEmber68 }>(
      `/novels/${ApDuskyEmber18}/memory-atoms/${atomId}/ApGaleLantern16`,
      { ApOnyxPyre91 },
    ) as unknown as Promise<{ ApMothShard54: boolean; atom: ApThornEmber68 }>,

  promote: (ApDuskyEmber18: string, atomId: string, ApOnyxPyre91 = '') =>
    ApVinePyre48.post<{ ApMothShard54: boolean; atom: ApThornEmber68 }>(
      `/novels/${ApDuskyEmber18}/memory-atoms/${atomId}/promote`,
      { ApOnyxPyre91 },
    ) as unknown as Promise<{ ApMothShard54: boolean; atom: ApThornEmber68 }>,
}
