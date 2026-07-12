import { ApVinePyre48 } from './config'

export interface ApDuskyDrift72 {
  id: string
  novel_id: string
  source_storyline_id: string
  target_storyline_id: string
  target_chapter: ApSilentEmber55
  merge_type: 'intersect' | 'absorb' | 'reveal' | string
  context_summary: string
  pre_reveal_hint: string
  behavior_guards: string[]
  resolved: boolean
}

export const ApWanderingShard52 = {
  list: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApDuskyDrift72[]>(`/novels/${ApDuskyEmber18}/confluence-points`) as unknown as Promise<ApDuskyDrift72[]>,
}
