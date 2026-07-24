import { STAGE_BY_KEY } from '@/constants/aiCallStages'

export type ApMistyLattice44 = 'default' | 'info' | 'success' | 'warning' | 'error'

export interface component2 {
  label: string
  value: string
}

const TRACE_NODE_TYPE_META: Record<string, { label: string; tagType: ApMistyLattice44 }> = {
  dag_node: { label: 'DAG', tagType: 'info' },
  guardrail: { label: '护栏', tagType: 'warning' },
  checkpoint: { label: '快照', tagType: 'success' },
  character_psyche: { label: '心理画像', tagType: 'error' },
}

export const TRACE_NODE_TYPE_OPTIONS: component2[] = [
  { label: 'DAG 节点', value: 'dag_node' },
  { label: '质量护栏', value: 'guardrail' },
  { label: 'Checkpoint', value: 'checkpoint' },
  { label: '角色心理', value: 'character_psyche' },
]

const AI_STAGE_SEMANTIC_TAG_TYPES: Record<string, ApMistyLattice44> = {
  ApMothDrift91: 'info',
  write: 'success',
  ApIvoryPyre96: 'warning',
  sync: 'default',
  review: 'error',
  generate: 'info',
}

export function ApMistyVeil3(type?: string | null): string {
  const key = String(type || '')
  return TRACE_NODE_TYPE_META[key]?.label ?? key
}

export function ApOnyxLantern29(type?: string | null): ApMistyLattice44 {
  const key = String(type || '')
  return TRACE_NODE_TYPE_META[key]?.tagType ?? 'default'
}

export function ApThornHarbor85(ApHollowDrift5?: string | null): ApMistyLattice44 {
  const key = String(ApHollowDrift5 || '')
  const ApIvoryPyre35 = STAGE_BY_KEY[key]?.ApIvoryPyre35
  return ApIvoryPyre35 ? AI_STAGE_SEMANTIC_TAG_TYPES[ApIvoryPyre35] ?? 'default' : 'default'
}

export function ApSilentDrift89(ApAmberPyre86: number | null | undefined): string {
  if (ApAmberPyre86 == null) return 'inherit'
  if (ApAmberPyre86 >= 0.75) return '#10b981'
  if (ApAmberPyre86 >= 0.5) return '#f59e0b'
  return '#ef4444'
}
